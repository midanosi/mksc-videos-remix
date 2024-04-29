import Link from "next/link";
import { courses } from "../../courses";
import { getModeColor } from "../../utils";

export async function getStaticPaths() {
  const modes = ["nonzzmt", "zzmt", "sc", "nolapskips"];

  const paths = [];
  modes.forEach((mode) => {
    paths.push({
      params: { mode },
    });
  });

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  return {
    props: {
      params,
    },
  };
}

export default function PickTrack({ params }) {
  const mode = params.mode;
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
              <Link
                key={cid}
                href={{
                  pathname: `/videos?cid=${cid}&mode=${mode}`,
                  //   query: { cid, mode }
                }}
              >
                <a className="relative w-16 h-10 overflow-hidden md:w-36 md:h-24">
                  <h3 className="absolute w-full text-xs text-center text-white transform -translate-x-1/2 -translate-y-1/2 bg-gray-800 bg-opacity-50 md:text-md md:whitespace-nowrap bg-black-700 top-4 md:top-6 left-1/2">
                    {course.replace("Retro", "R")}
                  </h3>
                  <img
                    src={`/crs${idx + 1}.png`}
                    alt={`thumbnail for ${course}`}
                    className="w-full h-full"
                  />
                </a>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
