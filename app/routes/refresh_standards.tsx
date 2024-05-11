import { json } from "@remix-run/node"; // or cloudflare/deno
import { useLoaderData, useNavigation } from "@remix-run/react";
import { refresh_standards } from "~/.server/refresh_standards";

export const loader = async () => {
  return json(await refresh_standards());
};

export default function CheckForDead() {
  const navigation = useNavigation();

  const refresh_standards = useLoaderData<typeof loader>();
  if (navigation.state === "loading" || refresh_standards === undefined) {
    return <span>loading</span>;
  }
  return (
    <>
      <span>done</span>
    </>
  );
}
