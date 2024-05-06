import { ActionFunctionArgs, json } from "@remix-run/node";
import { Form, Link, useActionData, useNavigate } from "@remix-run/react";
import { sha512 } from "oslo/crypto";
import { encodeHex } from "oslo/encoding";
import { useContext, useEffect } from "react";
import { AdminContext } from "~/context/AdminContext";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const formDataEntries = Object.fromEntries(formData);
  const password = String(formDataEntries.password);

  if (password === undefined) {
    return json({ isAdmin: false });
  }
  const data = new TextEncoder().encode(password);
  const hash = await sha512(data);
  const hexHash = encodeHex(hash);
  console.log(`hash`, hash);
  console.log(`hexHash`, hexHash);

  if (hexHash === process.env.PASSWORD_HASH) {
    return json({ isAdmin: true });
  } else {
    return json({ error: "password is incorrect" });
  }
};

export default function Admin() {
  const actionData = useActionData<typeof action>();
  const { isAdmin, setIsAdmin } = useContext(AdminContext);
  //   const navigate = useNavigate();

  useEffect(() => {
    if (actionData?.isAdmin) {
      setIsAdmin(true);
      //   navigate(-1);
    }
  });

  return (
    <>
      {isAdmin ? (
        <>
          <p>Logged in as admin</p>
          <Link to="/" className="underline">
            Go home
          </Link>
        </>
      ) : (
        <Form method="post">
          <div className="mt-10 ml-2">
            <label htmlFor="password">Password</label>
            <input name="password"></input>
            <button type="submit">Submit</button>
          </div>
          <div className="h-2"></div>
          {actionData?.error && <p>{actionData.error}</p>}
        </Form>
      )}
    </>
  );
}
