import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export async function loader({ request }: LoaderFunctionArgs) {
  const cookieHeader = request.headers.get("Set-Cookie");

  return json(cookieHeader);
}
export default function Component() {
  const cookie = useLoaderData<typeof loader>();
  console.log(cookie);
  return (
    <div>
      <h2>Animal ID PAGE!!</h2>
      <img
        src="https://images.unsplash.com/photo-1517849845537-4d257902454a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZG9nfGVufDB8fDB8fHww"
        alt="animal"
      />
    </div>
  );
}
