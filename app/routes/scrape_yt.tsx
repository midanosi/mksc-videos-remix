import { json } from "@remix-run/node"; // or cloudflare/deno
import { useLoaderData, useNavigation } from "@remix-run/react";
import { scrape_yt } from "~/.server/scrape_yt";

export const loader = async () => {
  return json(await scrape_yt());
};

export default function ScrapeYT() {
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
