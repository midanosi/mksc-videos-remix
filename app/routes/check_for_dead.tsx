import { json } from "@remix-run/node"; // or cloudflare/deno
import { useLoaderData, useNavigation } from "@remix-run/react";
import { check_for_dead } from "~/.server/check_for_dead";

export const loader = async () => {
  return json(await check_for_dead());
};

export default function CheckForDead() {
  const navigation = useNavigation();

  const scrapingDetails = useLoaderData<typeof loader>();
  if (navigation.state === "loading") {
    return <span>loading</span>;
  }
  const { recordsMissingData, recordsUpdated } = scrapingDetails;
  return (
    <>
      <span>records missing data: {recordsMissingData}</span>
      <span>updated records: {recordsUpdated}</span>
    </>
  );
}
