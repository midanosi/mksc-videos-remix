import type { LoaderFunctionArgs } from "@remix-run/node"; // or cloudflare/deno
import { json } from "@remix-run/node"; // or cloudflare/deno
import { useLoaderData } from "@remix-run/react";

import { db } from "~/lib/db.server";

async function getLoaderData() {
  const product = await db.mkscvids.findMany({
    take: 5,
  });

  return product;
}

export const loader = async ({ params }: LoaderFunctionArgs) => {
  return json(await getLoaderData());
};

export default function Product() {
  const vids = useLoaderData<typeof loader>();
  return (
    <>
      <div>
        <h1>vids</h1>
      </div>
      <ul>
        {vids.map((vid) => (
          <li key={vid.link}>
            <h1>{vid.link}</h1>
            <p>{vid.time}</p>
          </li>
        ))}
      </ul>
    </>
  );
}

// import { useLoaderData } from "remix";
// import { db } from "~/lib/db.server";

// export const loader = async () => {
//   const data = {
//     vids: await db.mkscvids.findMany({ take: 5 }),
//   };
//   return data;
// };

// export default function Index() {
//   const { vids } = useLoaderData();

//   return (
//     <>
//       <div>
//         <h1>vids</h1>
//       </div>
//       <ul>
//         {vids.map((vid) => (
//           <li key={vid.id}>
//             <h1>{vid.link}</h1>
//             <p>{vid.time}</p>
//           </li>
//         ))}
//       </ul>
//     </>
//   );
// }
