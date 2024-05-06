import { LoaderFunctionArgs, json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { courses } from "~/lib/courses";
import { getModeColor } from "~/lib/getModeColor";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  invariant(params.mode, "Expected params.mode");
  return json(await getLoaderData(params.mode));
};

async function getLoaderData(mode: string) {
  return mode;
}

export default function PickTrack() {
  const mode = useLoaderData<typeof loader>();

  const modeColor = getModeColor(mode);

  return (
    <main className="relative min-h-screen m-8 bg-white">
      <h1 className="text-3xl">Pick Track</h1>
      <h3 className="text-xl font-bold" style={{ color: modeColor }}>
        {mode}
      </h3>
      <div className="py-2 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="grid grid-cols-5 mt-6 gap-y-2 gap-x-2">
          {courses.map((course, idx) => {
            const cid = idx * 2;
            return (
              <Link key={cid} to={`/videos?cid=${cid}&mode=${mode}`}>
                <div
                  className="relative w-16 h-10 overflow-hidden md:w-36 md:h-24 outline outline-2
                 outline-transparent hover:outline-blue-800 focus:outline-blue-800"
                >
                  <h3 className="absolute w-full text-xs text-center text-white transform -translate-x-1/2 -translate-y-1/2 bg-gray-800 bg-opacity-50 md:text-md md:whitespace-nowrap bg-black-700 top-4 md:top-6 left-1/2">
                    {course.replace("Retro", "R")}
                  </h3>
                  <img
                    src={`/crs${idx + 1}.png`}
                    alt={`thumbnail for ${course}`}
                    className="w-full h-full"
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
