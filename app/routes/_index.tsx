import { Link } from "@remix-run/react";
import { Mode, getModeColor } from "~/lib/getModeColor";
type ModeObj = {
  id: Mode;
  title: string;
  desc: string;
  desc2?: string;
};
const modes: Array<ModeObj> = [
  {
    id: "nonzzmt",
    title: "Non-ZZMT",
    desc: "PP Rules (Non-SC)",
    desc2: "ZZMTs banned",
  },
  {
    id: "zzmt",
    title: "ZZMT",
    desc: "PP Rules (Non-SC)",
    desc2: "ZZMTs allowed",
  },
  {
    id: "sc",
    title: "SC",
    desc: "PP Rules (SC)",
    desc2: "Ticking, lapskips, and all shortcuts are allowed",
  },
  {
    id: "nolapskips",
    title: "No Lapskips",
    desc: "SC, but no lapskips",
  },
];

function Index() {
  return (
    <main className="relative min-h-screen m-8 bg-white">
      <h1 className="text-4xl">MKSC Videos</h1>
      <div className="px-4 py-2 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex flex-col justify-center gap-8 mt-6">
          {modes.map((mode) => {
            const modeColor = getModeColor(mode.id);
            return (
              <Link
                key={mode.id}
                to={{
                  pathname: `/picktrack/${mode.id}`,
                  // query: { mode: mode.id }
                }}
                className={`p-2 transition border hover:bg-gray-200 max-w-60`}
              >
                <h3 style={{ color: modeColor }} className="text-2xl font-bold">
                  {mode.title}
                </h3>
                <div>{mode.desc}</div>
                {mode.desc2 ? (
                  <span className="opacity-50">{mode.desc2}</span>
                ) : null}
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}

export default Index;
