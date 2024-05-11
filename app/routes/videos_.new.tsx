import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, useFetcher, useNavigate } from "@remix-run/react";
import { useContext, useEffect, useMemo, useState } from "react";
import { courses } from "~/lib/courses";
import { formatTime } from "~/lib/formatTime";

import { db } from "~/lib/db.server";
import { AdminContext } from "~/context/AdminContext";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const updates = Object.fromEntries(formData);
  const { link, time, mode, cid, player, uploaded_at } = updates;
  if (time === "0") {
    throw new Error("Time cannot be 0");
  }
  if (player === "") {
    throw new Error("Must provide player name");
  }
  const youtubeRegex = String(link).match(
    /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube(?:-nocookie)?\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|live\/|v\/)?)(?<videoId>[\w\-]+)(\S+)?$/
  );
  const youtubeId = youtubeRegex?.groups?.videoId ?? undefined;
  if (youtubeId === undefined) {
    throw new Error("invalid youtube url, can't find video id");
  }
  const newVid = await db.mkscvids.create({
    data: {
      link: youtubeId,
      mode: Number(mode),
      time: Number(time),
      cid: Number(cid),
      player: String(player),
      is_alive: true,
      uploaded_at: uploaded_at,
    },
  });
  const modes = ["nonzzmt", "zzmt", "sc", "nolapskips"];

  return redirect(`/videos?cid=${newVid.cid}&mode=${modes[newVid.mode]}`);
};

export default function CreateNew() {
  const { isAdmin } = useContext(AdminContext);

  const [cid, setCid] = useState(0);
  const navigate = useNavigate();
  const [formattedTime, setFormattedTime] = useState(formatTime(0));

  const [inputLink, setInputLink] = useState("");
  const youtubeId = useMemo(() => {
    const youtubeRegex = String(inputLink).match(
      /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube(?:-nocookie)?\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|live\/|v\/)?)(?<videoId>[\w\-]+)(\S+)?$/
    );
    const youtubeId = youtubeRegex?.groups?.videoId ?? undefined;
    return youtubeId;
  }, [inputLink]);
  const fetcher = useFetcher();

  useEffect(() => {
    if (youtubeId) {
      fetcher.load(`/query_youtube?yturl=${youtubeId}`);
    }
  }, [youtubeId]);

  useEffect(() => {
    if (!isAdmin && false) {
      navigate("/");
    }
  });

  return (
    <Form
      key="new"
      id="mkscvids-form"
      method="post"
      className="my-10 mx-8 flex flex-col gap-10 w-screen"
    >
      <div className="flex flex-wrap gap-8 w-full">
        <div className="flex flex-col gap-8">
          <div className="flex gap-2 items-center">
            <label>Youtube URL</label>
            <input
              type="text"
              onChange={(e) => setInputLink(e.currentTarget.value)}
              aria-label="link"
              name="link"
            />
            {youtubeId ? (
              <p className="pointer-events-none !m-0 text-gray-500">
                found id: {youtubeId}
              </p>
            ) : null}
          </div>

          <div className="flex gap-2 items-center">
            <label>Mode</label>
            <select
              aria-label="mode"
              name="mode"
              className="border border-gray-400 rounded-md p-1"
              defaultValue={0}
            >
              <option value="0">NonZZMT</option>
              <option value="1">ZZMT</option>
              <option value="2">SC</option>
              <option value="3">No Lapskips</option>
            </select>
          </div>

          <div>
            <div className="flex gap-2 items-center">
              <label htmlFor="cid">CID</label>

              <input
                type="number"
                name="cid"
                value={cid ?? 0}
                onChange={(e) => setCid(Number(e.currentTarget.value))}
              ></input>
            </div>
            <span className="text-gray-500 text-sm">
              Enter cid manually, or you can set it via these Course and Flap
              dropdowns
            </span>
            <div className="flex gap-2 items-center">
              <div>
                <label htmlFor="course">Course Name</label>
                <select
                  aria-label="course"
                  name="Course"
                  className="border border-gray-400 rounded-md p-1"
                  value={Math.floor(cid / 2)}
                  onChange={(e) => {
                    const courseIdx = Number(e.currentTarget.value);
                    setCid((currentCid) =>
                      currentCid % 2 === 0 ? courseIdx * 2 : courseIdx * 2 + 1
                    );
                  }}
                >
                  {courses.map((course, idx) => {
                    return (
                      <option key={course} value={idx}>
                        {course}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div>
                <label htmlFor="courseorflap">Course or Flap?</label>
                <select
                  aria-label="courseorflap"
                  name="courseorflap"
                  className="border border-gray-400 rounded-md p-1"
                  value={cid % 2}
                  onChange={(e) => {
                    const courseorflapvalue = Number(e.currentTarget.value);
                    setCid((currentCid) => {
                      if (courseorflapvalue === 0) {
                        // course
                        return currentCid % 2 === 0
                          ? currentCid
                          : currentCid - 1;
                      } else {
                        return currentCid % 2 === 1
                          ? currentCid
                          : currentCid + 1;
                      }
                    });
                  }}
                >
                  <option value="0">Course</option>
                  <option value="1">Flap</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex gap-2 items-center">
            <label htmlFor="time">Time</label>
            <br />
            <input
              type="number"
              name="time"
              aria-label="time"
              step="0.01"
              min={0}
              max={79}
              onChange={(e) =>
                setFormattedTime(formatTime(Number(e.currentTarget.value)))
              }
              className="w-32"
            />
            {formattedTime ? (
              <p className="pointer-events-none !m-0">
                formatted: {formattedTime}
              </p>
            ) : null}
          </div>

          <div className="flex gap-2 items-center">
            <label>Player Name</label>
            <input type="text" aria-label="player" name="player" />
          </div>

          <div className="flex gap-2 items-center">
            <label>Published At (readonly)</label>
            <input
              type="text"
              aria-label="uploaded_at"
              name="uploaded_at"
              value={fetcher.data?.youtubeMetadata?.snippet.publishedAt ?? ""}
              readOnly
            />
          </div>
        </div>

        <div className="min-w-60 max-w-100 border-dashed border-2 border-gray-700 rounded-md">
          <p>Info from Youtube</p>
          <QueriedFromYoutube youtubeMetadata={fetcher.data?.youtubeMetadata} />
        </div>
      </div>

      <div className="flex gap-2">
        <button type="submit">Submit video</button>
        <button type="button" onClick={() => navigate(-1)}>
          Cancel
        </button>
      </div>
    </Form>
  );
}
function QueriedFromYoutube({
  youtubeMetadata,
}: {
  youtubeMetadata: {
    id: string;
    snippet: {
      publishedAt: string;
      title: string;
      channelTitle: string;
      description: string;
      thumbnails: { high: { url: string } };
    };
  };
}) {
  if (!youtubeMetadata) return null;
  return (
    <div className="m-4">
      {youtubeMetadata.snippet ? (
        <>
          <a
            href={`https://www.youtube.com/watch?v=${youtubeMetadata.id}`}
            target="_blank"
          >
            <img
              src={youtubeMetadata.snippet.thumbnails.high.url}
              alt="yt thumbnail"
              className="max-w-70"
            />
          </a>
          <ul className="flex flex-col gap-8">
            <li>{youtubeMetadata.snippet.title}</li>
            <li>{youtubeMetadata.snippet.publishedAt}</li>
            <li>{youtubeMetadata.snippet.channelTitle}</li>
            <li>{youtubeMetadata.snippet.description}</li>
          </ul>
        </>
      ) : null}
    </div>
  );
}
