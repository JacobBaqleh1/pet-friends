import { LoaderFunctionArgs, json } from "@remix-run/node";
import { Await, useLoaderData } from "@remix-run/react";
import { Suspense } from "react";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  let id = params.slug;
  //fetching api token from the petfinder website
  const response = await fetch("https://api.petfinder.com/v2/oauth2/token", {
    method: "POST",
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: "0b5CWcWxxaW3fXPw7Lh2p0qMX9fpaYpOctVBLwbT3V4q2ift7I",
      client_secret: "un5wi6EsUOmgy0qwvsfHTofWlXL7Pboo780HRHFS",
    }),
  });
  const tokenData = await response.json();
  //fetching api data using the params and the api token

  const res = await fetch(`https://api.petfinder.com/v2/animals/${id}}`, {
    headers: {
      Authorization: `Bearer ${tokenData.access_token}`,
    },
  });
  const animalId = await res.json();

  return json({ animalId });
};
export default function Component() {
  const { animalId } = useLoaderData<typeof loader>();
  console.log(animalId);
  return (
    <main>
      <div>ProfilePage</div>
      <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={animalId}>
          <img src={animalId.animal.primary_photo_cropped.small} />
          <h2>Meet {animalId.animal.name}</h2>
        </Await>
      </Suspense>
    </main>
  );
}
