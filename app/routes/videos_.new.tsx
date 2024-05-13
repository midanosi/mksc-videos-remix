import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, useFetcher, useLoaderData, useNavigate } from "@remix-run/react";
import { useContext, useEffect, useMemo, useState } from "react";
import { courses, coursesAcronyms } from "~/lib/courses";
import { formatTime } from "~/lib/formatTime";

import { db } from "~/lib/db.server";
import { AdminContext } from "~/context/AdminContext";
import { Mode } from "~/lib/getModeColor";
import { openStandardCSV } from "~/lib/openStandardsCSV";

const modes = ["nonzzmt", "zzmt", "sc", "nolapskips"];

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

  return redirect(`/videos?cid=${newVid.cid}&mode=${modes[newVid.mode]}`);
};

export const loader = async () => {
  const standardFiles = {
    nonzzmt: await openStandardCSV("nonzzmt"),
    zzmt: await openStandardCSV("zzmt"),
    sc: await openStandardCSV("sc"),
  };
  return { standardFiles };
};

export default function CreateNew() {
  const { isAdmin } = useContext(AdminContext);
  const { standardFiles } = useLoaderData<typeof loader>();

  const [mode, setMode] = useState<number | undefined>(undefined);
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

  // fetch youtube metadata when Link input changes
  useEffect(() => {
    if (youtubeId) {
      fetcher.load(`/query_youtube?yturl=${youtubeId}`);
    }
  }, [youtubeId]);

  // redirect if not admin
  useEffect(() => {
    if (!isAdmin && false) {
      navigate("/");
    }
  });

  // if fetch youtube metadata, try scrape fields, and update them
  useEffect(() => {
    const metadata = fetcher.data?.youtubeMetadata ?? undefined;
    const title = metadata?.snippet?.title;

    // includesminute e.g. 0'12"91 or 1'12"91
    const includes_minute_time_match = title?.match(
      /((?<minute>\d{1})(?:"|')(?<seconds>\d{1,2})(?:"|')(?<hundredths>\d{2}))/
    );
    const includes_minute_time_as_number = includes_minute_time_match
      ? Number(includes_minute_time_match.groups.minute * 60) +
        Number(includes_minute_time_match.groups.seconds) +
        Number(includes_minute_time_match.groups.hundredths / 100)
      : undefined;
    console.log(
      `includes_minute_time_as_number`,
      includes_minute_time_as_number
    );

    // no_minute e.g. 12'91 or 12"91
    const no_minute_time_match = title?.match(
      /(?<seconds>\d{1,2})(?:"|')(?<hundredths>\d{2})/
    );
    console.log(`no_minute_time_match`, no_minute_time_match);
    const no_minute_time_as_number = no_minute_time_match
      ? Number(no_minute_time_match.groups.seconds) +
        Number(no_minute_time_match.groups.hundredths / 100)
      : undefined;
    console.log(`no_minute_time_as_number`, no_minute_time_as_number);

    const timeFromTitle =
      includes_minute_time_as_number ?? no_minute_time_as_number;

    const courseString =
      title?.match(
        `${[...courses.slice().reverse(), ...coursesAcronyms.slice().reverse()]
          .map((course) => course)
          .join("|")}`
      )?.[0] ?? undefined;
    console.log(`courseString`, courseString);

    const courseNameIndex = courses.indexOf(courseString);
    const courseAcronymIndex = coursesAcronyms.indexOf(courseString);
    const courseIndex =
      courseNameIndex !== -1
        ? courseNameIndex
        : courseAcronymIndex !== -1
        ? courseAcronymIndex
        : undefined;
    console.log(`courseIndex`, courseIndex);

    const isDefinitelyFlapFromTitle = title?.match(/flap/i)?.[0] !== undefined;
    let isFlap = isDefinitelyFlapFromTitle ?? false;

    // TODO fetch godtime in loader from CSV file
    if (
      mode !== undefined &&
      standardFiles !== undefined &&
      !isDefinitelyFlapFromTitle &&
      courseIndex !== undefined &&
      timeFromTitle !== undefined
    ) {
      // if time is less than god time for course, then set as flap
      const courseCid = courseIndex * 2;
      const standardsCSV =
        standardFiles?.[modes[mode] as Exclude<Mode, "nolapskips">] ??
        undefined;
      console.log(`standardsCSV`, standardsCSV);
      if (standardsCSV !== undefined) {
        const lines = standardsCSV.split("\n");
        const standardRow = lines[courseCid].split(",").slice(1); // slice 1 to ignore the cid at the start
        console.log(`standardRow`, standardRow);
        const godTime = standardRow[0];
        const isTimeLessThanHalfOfGodTime = timeFromTitle < Number(godTime) / 2;
        if (isTimeLessThanHalfOfGodTime) {
          isFlap = true;
        }
      }
    }
    if (courseIndex !== undefined) {
      const courseNameInput = document.querySelector<HTMLInputElement>(
        'select[name="Course"]'
      );
      if (courseNameInput) {
        courseNameInput.value = String(courseIndex);
      }
      const courseOrFlapInput = document.querySelector<HTMLInputElement>(
        'select[name="courseorflap"]'
      );
      if (courseOrFlapInput) {
        courseOrFlapInput.value = isFlap ? "1" : "0";
      }

      const cid = isFlap ? courseIndex * 2 + 1 : courseIndex * 2;
      const cidInput =
        document.querySelector<HTMLInputElement>('input[name="cid"]');
      if (cidInput) {
        cidInput.value = String(cid);
      }
    }

    if (timeFromTitle) {
      const timeInput =
        document.querySelector<HTMLInputElement>('input[name="time"]');
      if (timeInput) {
        timeInput.value = String(timeFromTitle);
      }
    }
  }, [fetcher.data?.youtubeMetadata]);

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
            <label>Mode</label>
            <select
              aria-label="mode"
              name="mode"
              className="border border-gray-400 rounded-md p-1"
              defaultValue={""}
              onChange={(event) => {
                setMode(Number(event.currentTarget.value));
              }}
            >
              <option value="">--Select the mode first--</option>
              <option value="0">NonZZMT</option>
              <option value="1">ZZMT</option>
              <option value="2">SC</option>
              <option value="3">No Lapskips</option>
            </select>
          </div>

          {/* {mode !== undefined ?
          <> */}
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
            {formattedTime !== '00"00' ? (
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

          {/* </>

: null} */}

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
