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
    if (!isAdmin) {
      navigate("/");
    }
  });

  return (
    <div className="flex flex-wrap">
      <Form
        key="new"
        id="mkscvid-form"
        method="post"
        className="my-10 mx-8 flex flex-col gap-10"
      >
        <p>
          <span>Youtube URL</span>
          <br />
          <input
            type="text"
            onChange={(e) => setInputLink(e.currentTarget.value)}
            aria-label="link"
            name="link"
          />
          <p className="pointer-events-none">(youtube vid id: {youtubeId})</p>
        </p>

        <p>
          <span>Mode</span>
          <br />
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
        </p>

        <div>
          <label htmlFor="cid">
            CID (enter manually if you know it, or via the course and flap
            dropdowns)
          </label>

          <div className="flex">
            <input
              type="number"
              name="cid"
              value={cid ?? 0}
              onChange={(e) => setCid(Number(e.currentTarget.value))}
            ></input>
          </div>
          <div className="h-2" />
          <div className="flex gap- 2">
            <div>
              <label htmlFor="course">Course Name</label>
              <br />
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
              <br />
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
                      return currentCid % 2 === 0 ? currentCid : currentCid - 1;
                    } else {
                      return currentCid % 2 === 1 ? currentCid : currentCid + 1;
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

        <div>
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
          <p className="pointer-events-none">(formatted: {formattedTime})</p>
        </div>

        <p>
          <span>Player Name</span>
          <br />
          <input type="text" aria-label="player" name="player" />
        </p>

        <QueriedFromYoutube youtubeMetadata={fetcher.data?.youtubeMetadata} />

        <p>
          <span>Published At</span>
          <br />
          <input
            type="text"
            aria-label="uploaded_at"
            name="uploaded_at"
            value={fetcher.data?.youtubeMetadata?.snippet.publishedAt ?? ""}
            readOnly
          />
        </p>

        <div className="flex gap-2">
          <button type="submit">Create</button>
          <button type="button" onClick={() => navigate(-1)}>
            Cancel
          </button>
        </div>
      </Form>
    </div>
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
      <p>Queried from youtube (enter a valid youtube URL)</p>
      {youtubeMetadata.snippet ? (
        <>
          <img
            src={youtubeMetadata.snippet.thumbnails.high.url}
            alt="yt thumbnail"
          />
          <ul>
            <li>Title: {youtubeMetadata.snippet.title}</li>
            <li>Published At: {youtubeMetadata.snippet.publishedAt}</li>
            <li>Channel Title: {youtubeMetadata.snippet.channelTitle}</li>
            <li>Description: {youtubeMetadata.snippet.description}</li>
          </ul>
        </>
      ) : null}
    </div>
  );
}
