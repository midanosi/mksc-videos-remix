import { getStandardsArray } from "~/lib/getStandardsArray.server";
import { standardTitles } from "~/lib/standardTitles";
import { formatTime } from "~/lib/formatTime";
import { db } from "~/lib/db.server";
import { courses } from "~/lib/courses";
import { getModeColor } from "~/lib/getModeColor";
import type { LoaderFunctionArgs } from "@remix-run/node"; // or cloudflare/deno
import { json } from "@remix-run/node"; // or cloudflare/deno
import { useLoaderData } from "@remix-run/react";
import { format } from "date-fns/format";
import { useMemo, useState } from "react";

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
  console.log(`params.mode`, params.mode);
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
  const { mkscvids, mode, cid } = useLoaderData<typeof loader>();
  // const mkscvids = props.mkscvids;
  // const mode = props.params.mode;
  // const cid = Number(props.params.cid);

  const courseLapType = cid % 2 === 0 ? "Course" : "Flap";
  const otherTypeCid = courseLapType === "Course" ? cid + 1 : cid - 1;

  const [displayingDeadLinks, setDisplayingDeadLinks] = useState(false);
  const isAdmin = true;
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
          <a href="/"> Home</a>
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
                  href={`/videos?=${cid}&mode=${modeOption}`}
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
                  URL
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
                      {mkscvid.time ? formatTime(Number(mkscvid.time)) : ""}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap dark:text-white">
                      {mkscvid.player}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap dark:text-white">
                      {mkscvid.standard}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap dark:text-white">
                      {mkscvid.uploaded_at
                        ? format(new Date(mkscvid.uploaded_at), "do MMM yyyy")
                        : ""}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap dark:text-white underline">
                      <a href={`https://youtu.be/${mkscvid.link}`}>URL</a>
                    </td>
                    {displayingDeadLinks ? (
                      <td className="px-6 py-4 text-lg text-gray-500 whitespace-nowrap dark:text-white">
                        {mkscvid.is_alive ? "" : "💀"}
                      </td>
                    ) : null}
                    {isAdmin ? (
                      <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap dark:text-white hover:underline hover:cursor-pointer">
                        {`✏️ Edit`}
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
