import { getStandardsArray } from "~/lib/getStandardsArray.server";
import { standardTitles } from "~/lib/standardTitles";
import { formatTime } from "~/lib/formatTime";
import { db } from "~/lib/db.server";
import { courses } from "~/lib/courses";
import { getModeColor } from "~/lib/getModeColor";
import type { LoaderFunctionArgs } from "@remix-run/node"; // or cloudflare/deno
import { json, redirect } from "@remix-run/node"; // or cloudflare/deno
import { Link, useLoaderData } from "@remix-run/react";
import { format } from "date-fns/format";
import { useContext, useMemo, useState } from "react";
import { AdminContext } from "~/context/AdminContext";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const cid = url.searchParams.get("cid");
  const mode = url.searchParams.get("mode");
  return json(await getLoaderData({ cid, mode }));
};

async function getLoaderData(params: { cid: string; mode: string }) {
  const modeNameToModeId = {
    nonzzmt: 0,
    zzmt: 1,
    sc: 2,
    nolapskips: 3,
  };
  if (params.cid === null) {
    throw redirect(`/`);
  }
  if (params.mode === null) {
    throw redirect(`/`);
  }
  const modeId = modeNameToModeId[params.mode];
  if (modeId === undefined) {
    throw new Error("modeId not valid");
  }

  const mkscvids = await db.mkscvids.findMany({
    where: { cid: Number(params.cid), mode: modeId },
    // select: { cid: true, link: true, time: true },
    orderBy: { time: "asc" },
  });

  return {
    mkscvids,
    mode: params.mode,
    cid: Number(params.cid),
  };
}
const subtractOneIfOdd = (i) => {
  if (i % 2 === 0) {
    return i;
  }
  return i - 1;
};
const getCourseName = (cid) => {
  const arrayIndex = subtractOneIfOdd(cid) / 2;
  return courses[arrayIndex];
};

export default function Videos() {
  const { isAdmin } = useContext(AdminContext);
  const { mkscvids, mode, cid } = useLoaderData<typeof loader>();
  // const mkscvids = props.mkscvids;
  // const mode = props.params.mode;
  // const cid = Number(props.params.cid);

  const courseLapType = cid % 2 === 0 ? "Course" : "Flap";
  const otherTypeCid = courseLapType === "Course" ? cid + 1 : cid - 1;

  const [displayingDeadLinks, setDisplayingDeadLinks] = useState(false);
  const deadLinksCount = mkscvids.filter((mkscvid) => !mkscvid.is_alive).length;

  const videosList = useMemo(() => {
    if (displayingDeadLinks) {
      return mkscvids;
    } else {
      return mkscvids.filter((mkscvid) => mkscvid.is_alive);
    }
  }, [displayingDeadLinks, mkscvids]);

  return (
    <div className="flex flex-col h-full min-h-screen">
      <header className="flex items-center justify-between p-4 bg-slate-800">
        <h3 className="font-bold text-white">
          <Link to="/"> Home</Link>
        </h3>
        <h3 className="font-bold text-white">
          <Link to="/admin">
            {isAdmin ? "Admin mode on" : "Turn on Admin mode?"}
          </Link>
        </h3>
      </header>

      <main className="h-full bg-white ml-20">
        <div
          className="flex items-center gap-4"
          // style={{ width: "26rem" }}
        >
          <div className="p-4">
            <h1 className="text-3xl whitespace-nowrap mb-2 font-bold">
              {getCourseName(cid)}
            </h1>
            <div className="flex items-end gap-2 mb-2">
              {["Course", "Flap"].map((type) => {
                return (
                  <a
                    key={type}
                    className="hover:underline"
                    style={{
                      color: getModeColor(type),
                      fontWeight: courseLapType === type ? "500" : "normal",
                      opacity: courseLapType === type ? 1 : 0.5,
                      fontSize: courseLapType === type ? "1.4rem" : "1rem",
                      lineHeight: courseLapType === type ? "1" : "1.2",
                    }}
                    href={`/videos?cid=${otherTypeCid}&mode=${mode}`}
                  >
                    {type}
                  </a>
                );
              })}
            </div>
            <div className="flex items-end gap-4">
              {["nonzzmt", "zzmt", "sc", "nolapskips"].map((modeOption) => (
                <a
                  key={modeOption}
                  className="text-xl hover:underline"
                  style={{
                    color: getModeColor(modeOption),
                    fontWeight: mode === modeOption ? "bold" : "normal",
                    opacity: mode === modeOption ? 1 : 0.5,
                    fontSize: mode === modeOption ? "1.4rem" : "1rem",
                    lineHeight: mode === modeOption ? "1" : "1.2",
                  }}
                  href={`/videos?cid=${cid}&mode=${modeOption}`}
                >
                  {modeOption}
                </a>
              ))}
            </div>
          </div>
          <img
            src={`/crs${subtractOneIfOdd(cid) / 2 + 1}.png`}
            alt={`thumbnail for ${getCourseName(cid)}`}
            className="w-40 h-30 overflow-hidden"
          />
          {deadLinksCount > 0 ? (
            <button
              onClick={() => setDisplayingDeadLinks((old) => !old)}
              className="w-max ml-2 border-blue-500 border-2 rounded-md p-2 hover:bg-blue-500 hover:text-white"
            >
              {displayingDeadLinks
                ? "Hide dead links"
                : `Display dead links (${deadLinksCount})`}
            </button>
          ) : null}

          <div className="border border-1 border-gray-700 rounded-md p-2">
            <a
              href={`https://mariokart64.com/mksc/course${
                mode === "sc" || mode === "nolapskips" ? "p" : "n"
              }.php?cid=${cid}`}
              target="_blank"
            >
              PP rankings ↗
            </a>
          </div>
          <div className="border border-1 border-gray-700 rounded-md p-2">
            <a
              href={`https://mkwrs.com/mksc/display.php?track=${getCourseName(
                cid
              ).replace(" ", "%20")}${cid % 2 === 0 ? "" : "&f=1"}`}
              target="_blank"
            >
              mkwrs ↗
            </a>
          </div>
        </div>
        <div className="h-full border-r shadow-md w-80 bg-gray-50 sm:rounded-lg">
          <table className="min-w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400"
                >
                  Time
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400"
                >
                  Player
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400"
                >
                  Standard
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400"
                >
                  Date
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400"
                >
                  YT
                </th>
                {displayingDeadLinks ? (
                  <th
                    scope="col"
                    className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-700 uppercase dark:text-gray-400"
                  >
                    Dead link?
                  </th>
                ) : null}
                {isAdmin ? (
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Edit</span>
                  </th>
                ) : null}
              </tr>
            </thead>
            <tbody>
              {videosList?.map((mkscvid) => {
                return (
                  <tr
                    key={mkscvid.link}
                    className="bg-white border-b dark:border-gray-700 dark:bg-gray-800"
                  >
                    <td
                      style={{ fontVariantNumeric: "tabular-nums" }}
                      className="text-right px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      {mkscvid.time ? (
                        <a
                          href={`https://youtu.be/${mkscvid.link}`}
                          className="hover:text-blue-600"
                          target="_blank"
                        >
                          {formatTime(Number(mkscvid.time))}
                        </a>
                      ) : (
                        ""
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap dark:text-white">
                      {mkscvid.player}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap dark:text-white">
                      {mkscvid.standard}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap dark:text-white">
                      {mkscvid.uploaded_at
                        ? format(new Date(mkscvid.uploaded_at), "yyyy MMM do")
                        : ""}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap dark:text-white underline">
                      <a
                        href={`https://youtu.be/${mkscvid.link}`}
                        target="_blank"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 28.57  20"
                          focusable="false"
                          className="brightness-90"
                        >
                          <svg
                            viewBox="0 0 28.57 20"
                            preserveAspectRatio="xMidYMid meet"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <g>
                              <path
                                d="M27.9727 3.12324C27.6435 1.89323 26.6768 0.926623 25.4468 0.597366C23.2197 2.24288e-07 14.285 0 14.285 0C14.285 0 5.35042 2.24288e-07 3.12323 0.597366C1.89323 0.926623 0.926623 1.89323 0.597366 3.12324C2.24288e-07 5.35042 0 10 0 10C0 10 2.24288e-07 14.6496 0.597366 16.8768C0.926623 18.1068 1.89323 19.0734 3.12323 19.4026C5.35042 20 14.285 20 14.285 20C14.285 20 23.2197 20 25.4468 19.4026C26.6768 19.0734 27.6435 18.1068 27.9727 16.8768C28.5701 14.6496 28.5701 10 28.5701 10C28.5701 10 28.5677 5.35042 27.9727 3.12324Z"
                                fill="#FF0000"
                              ></path>
                              <path
                                d="M11.4253 14.2854L18.8477 10.0004L11.4253 5.71533V14.2854Z"
                                fill="white"
                              ></path>
                            </g>
                          </svg>
                        </svg>
                      </a>
                    </td>
                    {displayingDeadLinks ? (
                      <td className="px-6 py-4 text-lg text-gray-500 whitespace-nowrap dark:text-white">
                        {mkscvid.is_alive ? "" : "💀"}
                      </td>
                    ) : null}
                    {isAdmin ? (
                      <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap dark:text-white hover:underline hover:cursor-pointer">
                        <Link to={`${mkscvid.id}/edit`}>{`✏️ Edit`}</Link>
                      </td>
                    ) : null}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
