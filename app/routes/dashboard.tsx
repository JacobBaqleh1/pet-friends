import { redirect, type ActionFunctionArgs } from "@remix-run/node";
import { Form, Link, Outlet, useActionData } from "@remix-run/react";
import { commitSession, getSession } from "../cookie.server";

export async function action({ request }: ActionFunctionArgs) {
  //getting the form data
  let formData = await request.formData();
  let userInput = {
    zipcode: formData.get("zipcode"),
    pet: formData.get("pet"),
  };

  const session = await getSession(request.headers.get("Cookie"));
  session.set("userInput", userInput);
  const cookie = await commitSession(session);
  return redirect("/dashboard/q", {
    headers: {
      "Set-Cookie": cookie,
    },
  });
}

export default function Component() {
  //retrieve action function data
  const data = useActionData<typeof action>();
  console.log(data?.animals);
  return (
    <>
      {" "}
      <main>
        <Form method="post" className="w-full max-w-lg">
          <div className="mb-4">
            <label
              htmlFor="zipcode"
              className="block text-sm font-medium text-gray-700"
            >
              Enter your zipcode
            </label>

            <input
              type="text"
              name="zipcode"
              placeholder="Enter Zipcode..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-2"
            />
          </div>
          <div>
            <span className="block text-sm font-medium text-gray-700">
              Select a pet:{" "}
            </span>
            <div className="mt-2">
              <input
                type="radio"
                id="dog"
                name="pet"
                value="dog"
                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
              />
              <label htmlFor="dog" className="ml-2 text-sm text-gray-700">
                Dogs
              </label>
            </div>
            <div className="mt-2">
              <input
                type="radio"
                name="pet"
                value="cat"
                id="cat"
                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
              />
              <label htmlFor="cat" className="ml-2 text-sm text-gray-700">
                Cats
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="bg-indigo-500 text-white px-4 py-2 rounded-md"
          >
            Search
          </button>
        </Form>

        <div className="grid gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-8">
          {data?.animals ? (
            data?.animals.map((animal): any => (
              <div
                key={animal.id}
                className="flex flex-col overflow-hidden rounded-lg border bg-white"
              >
                <Link
                  prefetch="intent"
                  className="group relative block h-48 overflow-hidden bg-gray-100 md:h-64"
                  to={`/dashboard/${animal.id}`}
                >
                  <img
                    alt="animal"
                    src="https://images.unsplash.com/photo-1517849845537-4d257902454a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZG9nfGVufDB8fDB8fHww"
                  ></img>
                </Link>
              </div>
            ))
          ) : (
            <p></p>
          )}
        </div>
        <Outlet />
      </main>
    </>
  );
}

// //fetching api token from the petfinder website
// const response = await fetch("https://api.petfinder.com/v2/oauth2/token", {
//   method: "POST",
//   body: new URLSearchParams({
//     grant_type: "client_credentials",
//     client_id: "0b5CWcWxxaW3fXPw7Lh2p0qMX9fpaYpOctVBLwbT3V4q2ift7I",
//     client_secret: "un5wi6EsUOmgy0qwvsfHTofWlXL7Pboo780HRHFS",
//   }),
// });
// const tokenData = await response.json();
// //fetching api data using the form data and the api token
// const res = await fetch(
//   `https://api.petfinder.com/v2/animals?location=${newUser.zipcode}&type=${newUser.pet}`,
//   {
//     headers: {
//       Authorization: `Bearer ${tokenData.access_token}`,
//     },
//   }
// );
// const animalData = await res.json();
