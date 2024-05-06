import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, useNavigate } from "@remix-run/react";
import { useMemo, useState } from "react";
import { courses } from "~/lib/courses";
import { formatTime } from "~/lib/formatTime";

import { db } from "~/lib/db.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const updates = Object.fromEntries(formData);
  const { link, time, mode, cid, player } = updates;
  if (time === "0") {
    throw new Error("Time cannot be 0");
  }
  if (player === "") {
    throw new Error("Must provide player name");
  }
  const youtubeId = String(link).split("v=")[1];
  if (youtubeId === "") {
    throw new Error("Youtube ID not found in provided URL");
  }
  const newVid = await db.mkscvids.create({
    data: {
      link: youtubeId,
      mode: Number(mode),
      time: Number(time),
      cid: Number(cid),
      player: String(player),
      is_alive: true,
    },
  });
  const modes = ["nonzzmt", "zzmt", "sc", "nolapskips"];

  return redirect(`/videos?cid=${newVid.cid}&mode=${modes[newVid.mode]}`);
};

export default function CreateNew() {
  const [cid, setCid] = useState(0);
  const navigate = useNavigate();
  const [formattedTime, setFormattedTime] = useState(formatTime(0));
  const [inputLink, setInputLink] = useState("");
  const youtubeId = useMemo(() => inputLink.split("v=")[1], [inputLink]);

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

        <div className="flex gap-2">
          <button type="submit">Create</button>
          <button type="button" onClick={() => navigate(-1)}>
            Cancel
          </button>
        </div>
      </Form>
      <LinkPreview link={inputLink} />
    </div>
  );
}
function LinkPreview({ link }: { link: string }) {
  return (
    <div className="m-4">
      <p>Link Preview</p>
      {link}
    </div>
  );
}
