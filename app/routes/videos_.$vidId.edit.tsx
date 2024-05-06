import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useLoaderData, useNavigate } from "@remix-run/react";
import { useMemo, useState } from "react";
import invariant from "tiny-invariant";
import { courses } from "~/lib/courses";
import { formatTime } from "~/lib/formatTime";

import { db } from "~/lib/db.server";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  invariant(params.vidId, "Missing vidId param");

  const mkscvid = await db.mkscvids.findFirst({
    where: { id: Number(params.vidId) },
  });
  if (!mkscvid) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ mkscvid });
};

export const action = async ({ params, request }: ActionFunctionArgs) => {
  invariant(params.vidId, "Missing vidId param");
  const formData = await request.formData();
  const updates = Object.fromEntries(formData);
  const { link, time, mode, cid, player } = updates;
  const youtubeId = String(link).split("v=")[1];

  const updatedvid = await db.mkscvids.update({
    where: { id: Number(params.vidId) },
    data: {
      link: youtubeId,
      mode: Number(mode),
      time: Number(time),
      cid: Number(cid),
      player: String(player),
    },
  });
  const modes = ["nonzzmt", "zzmt", "sc", "nolapskips"];

  return redirect(
    `/videos?cid=${updatedvid.cid}&mode=${modes[updatedvid.mode]}`
  );
};

export default function EditVideo() {
  const { mkscvid } = useLoaderData<typeof loader>();
  const [cid, setCid] = useState(mkscvid.cid);
  const navigate = useNavigate();
  const [formattedTime, setFormattedTime] = useState(
    formatTime(Number(mkscvid.time))
  );
  const [inputLink, setInputLink] = useState(mkscvid.link);
  const youtubeId = useMemo(() => inputLink.split("v=")[1], [inputLink]);

  return (
    <div className="flex flex-wrap">
      <Form
        key={mkscvid.id}
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
            defaultValue={mkscvid.link}
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
            defaultValue={mkscvid.mode}
          >
            <option value="0" selected={mkscvid.mode === 0}>
              NonZZMT
            </option>
            <option value="1" selected={mkscvid.mode === 1}>
              ZZMT
            </option>
            <option value="2" selected={mkscvid.mode === 2}>
              SC
            </option>
            <option value="3" selected={mkscvid.mode === 3}>
              No Lapskips
            </option>
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
              >
                {courses.map((course, idx) => {
                  const courseCid = idx * 2;
                  return (
                    <option
                      key={course}
                      value={course}
                      selected={cid === courseCid || cid === courseCid + 1}
                    >
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
              >
                <option
                  value="course"
                  selected={cid ? cid % 2 === 0 : true}
                  onChange={() =>
                    setCid((currentCid) =>
                      currentCid % 2 === 0 ? currentCid : currentCid - 1
                    )
                  }
                >
                  Course
                </option>
                <option
                  value="flap"
                  selected={cid ? cid % 2 === 1 : false}
                  onChange={() =>
                    setCid((currentCid) =>
                      currentCid % 2 === 1 ? currentCid : currentCid + 1
                    )
                  }
                >
                  Flap
                </option>
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
            defaultValue={mkscvid.time ?? 0}
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
          <input
            type="text"
            aria-label="player"
            name="player"
            defaultValue={mkscvid.player ?? ""}
          />
        </p>

        <div className="flex gap-2">
          <button type="submit">Save</button>
          <button type="button" onClick={() => navigate(-1)}>
            Cancel
          </button>
          <Form
            action="destroy"
            method="post"
            onSubmit={(event) => {
              const response = confirm(
                "Please confirm you want to delete this record."
              );
              if (!response) {
                event.preventDefault();
              }
            }}
          >
            <button type="submit" className="border-red-600">
              Delete
            </button>
          </Form>
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
