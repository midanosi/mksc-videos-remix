import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

import type { MetaFunction, LoaderFunction } from "@remix-run/node";
import globalStyles from "~/styles/global.css?url";
import { AdminContextProvider } from "./context/AdminContext";

// Import rootAuthLoader
import { rootAuthLoader } from "@clerk/remix/ssr.server";
// Import ClerkApp
import { ClerkApp } from "@clerk/remix";

export const meta: MetaFunction = () => [
  {
    charset: "utf-8",
    title: "MKSC Videos",
    viewport: "width=device-width,initial-scale=1",
  },
];
export const loader: LoaderFunction = (args) => rootAuthLoader(args);

export function links() {
  return [
    {
      rel: "stylesheet",
      href: "https://unpkg.com/modern-css-reset@1.4.0/dist/reset.min.css",
    },
    {
      rel: "stylesheet",
      href: globalStyles,
    },
  ];
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

function App() {
  return (
    <AdminContextProvider>
      <Outlet />
    </AdminContextProvider>
  );
}

export default ClerkApp(App);
