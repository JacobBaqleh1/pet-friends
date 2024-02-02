import { Await, Link, useLoaderData } from "@remix-run/react";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";

import { Suspense } from "react";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  let { searchParams } = new URL(request.url);
  let petType = searchParams.get("pet");
  let zipcode = searchParams.get("zipcode");
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
  const formattedDate = getFormattedDate();
  const res = await fetch(
    `https://api.petfinder.com/v2/animals?before=${formattedDate}&location=${zipcode}&pet=${petType}`,
    {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    }
  );
  const animalData = await res.json();

  return json({ animalData });
};

function getFormattedDate() {
  const oneDayAgo = new Date();
  oneDayAgo.setDate(oneDayAgo.getDate() - 1);
  return oneDayAgo.toISOString();
}

export default function Component() {
  const { animalData } = useLoaderData<typeof loader>();
  console.log(animalData);
  return (
    <div>
      <div className="max-w-7xl mx-auto">
        {" "}
        <Suspense fallback={<div>Loading...</div>}>
          <Await resolve={animalData}>
            {(animalData) => (
              <div>
                {animalData.animals
                  // Filter out animals without photos
                  .filter((animal) => animal.photos.length > 0)
                  .map((animal) => (
                    <div
                      key={animal.id}
                      className="flex flex-col overflow-hidden rounded-lg border bg-white"
                    >
                      <Link
                        className="group relative  h-48 overflow-hidden bg-gray-100 md:h-64"
                        prefetch="intent"
                        to={`/dashboard/${animal.id}`}
                      >
                        <img
                          src={animal.primary_photo_cropped.small}
                          alt="animal"
                          className="absolute inset-0  object-cover object-center transition duration-2ßß group-hover:scale-110"
                        />
                      </Link>
                      <div>
                        <h2 className="mb-2 text-lg font-semibold text-gray-800">
                          <Link
                            to={`/dashboard/${animal.id}`}
                            prefetch="intent"
                            className="transition duration-100 hover:text-indigo-500 active:text-indigo-600"
                          >
                            {animal.name}
                          </Link>
                        </h2>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </Await>
        </Suspense>
      </div>
    </div>
  );
}
