import { Link } from "@remix-run/react";
import { Mode, getModeColor } from "~/lib/getModeColor";
import { SignOutButton, SignedIn, SignedOut, UserButton } from "@clerk/remix";
import { ShowIfAdmin, ShowIfNotAdmin } from "~/components/ShowIfAdmin";
import Spacer from "~/components/Spacer";

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
      <div className="flex justify-between w-full max-h-20">
        <h1 className="text-4xl">MKSC Videos</h1>
        <SignedIn>
          <div className="bg-gray-50 p-2 rounded-md">
            <div className="flex gap-8">
              <div className="flex items-center gap-2">
                <p>Signed in</p>
                <UserButton />
              </div>
              <div>
                <SignOutButton />
              </div>
            </div>
            <ShowIfNotAdmin>
              <Spacer size={10} />
              <div className="bg-red-50 rounded-md p-2">
                <div className="text-red-700">
                  You aren't an admin. Request admin access by sending a Discord
                  DM to Nosey. Being signed in changes nothing about the website
                  if you're aren't an admin, so feel free to sign out if you
                  wish.
                </div>
              </div>
            </ShowIfNotAdmin>
            {/* <ShowIfAdmin>
              <Spacer size={10} />
              <div className="bg-red-50 rounded-md p-2">
                <div className="text-red-700 max-w-60">
                  You aren't an admin. Request admin access by sending a Discord
                  DM to Nosey. Being signed in changes nothing about the website
                  if you're aren't an admin, so feel free to sign out if you
                  wish.
                </div>
              </div>
            </ShowIfAdmin> */}
          </div>
        </SignedIn>
        <SignedOut>
          <div className="bg-gray-50 flex p-2 gap-8 rounded-md">
            <p>You are signed out</p>
            <div>
              <Link to="/sign-in" className="underline">
                Sign in
              </Link>
            </div>
            <div>
              <Link to="/sign-up" className="underline">
                Sign up
              </Link>
            </div>
          </div>
        </SignedOut>
      </div>
      <div className="px-4 py-2 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex flex-col justify-center gap-4 mt-2">
          {modes.map((mode) => {
            const modeColor = getModeColor(mode.id);
            return (
              <Link
                key={mode.id}
                to={{
                  pathname: `/picktrack/${mode.id}`,
                  // query: { mode: mode.id }
                }}
                className={`p-2 transition border bg-gray-50 hover:bg-gray-100 max-w-60 rounded-md`}
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

          <ShowIfAdmin>
            <div className="mt-4 p-1 border border-green-600 bg-green-200 px-2 max-w-60 rounded-md text-2xl text-center hover:bg-green-300">
              <Link to="/videos/new">Add a new video!</Link>
            </div>
          </ShowIfAdmin>
        </div>
      </div>
    </main>
  );
}

export default Index;
