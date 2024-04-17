import { Await, Link, useLoaderData, useSearchParams } from "@remix-run/react";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Suspense } from "react";
interface Animal {
  id: number;
  name: string;
  photos: string[];
  primary_photo_cropped: {
    small: string;
  };
  breeds: {
    primary: string;
  };
  age: string;
  size: string;
}

export async function loader({ request }: LoaderFunctionArgs) {
  let { searchParams } = new URL(request.url);
  let petType = searchParams.get("pet");
  let zipcode = searchParams.get("zipcode");
  let pageNumber = searchParams.get("page");

  // Fetch the API token
  const tokenResponse = await fetch(
    "https://api.petfinder.com/v2/oauth2/token",
    {
      method: "POST",
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: "0b5CWcWxxaW3fXPw7Lh2p0qMX9fpaYpOctVBLwbT3V4q2ift7I", // Use environment variables
        client_secret: "un5wi6EsUOmgy0qwvsfHTofWlXL7Pboo780HRHFS",
      }),
    }
  );
  const tokenData = await tokenResponse.json();

  // Fetch animals data
  const formattedDate = getFormattedDate();
  const urls = [
    `https://api.petfinder.com/v2/animals?before=${formattedDate}&location=${zipcode}&type=${petType}&page=${pageNumber}`,
    `https://api.petfinder.com/v2/animals?before=${formattedDate}&location=${zipcode}&type=${petType}&page=${
      pageNumber !== null ? pageNumber + 1 : 1
    }`,
  ];

  const fetchPromises = urls.map((url) =>
    fetch(url, {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    })
  );
  const responses = await Promise.all(fetchPromises);
  const animalsPages = await Promise.all(
    responses.map((response) => response.json())
  );

  // Combine and return animal data
  const combinedAnimals = animalsPages.flatMap((page) => page.animals);

  return json(combinedAnimals);
}

function getFormattedDate() {
  const threeDaysAgo = new Date();
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
  return threeDaysAgo.toISOString();
}

export default function Component() {
  const animals = useLoaderData<Animal[]>();
  const [searchParams, setSearchParams] = useSearchParams();
  const pageNumber = parseInt(searchParams.get("page") || "1");

  const nextPage = () => {
    setSearchParams({
      ...Object.fromEntries(searchParams),
      page: (pageNumber + 1).toString(),
    });
  };
  const prevPage = () => {
    setSearchParams({
      ...Object.fromEntries(searchParams),
      page: (pageNumber - 1).toString(),
    });
  };
  console.log(animals);
  return (
    <div className="lg:w-[65rem] m-auto">
      <div className="">
        {" "}
        <Suspense fallback={<div>Loading...</div>}>
          <Await resolve={animals}>
            {(animals) => (
              <div className="grid grid-cols-2 sm:grid sm:grid-cols-2 md:grid-cols-3 gap-4  ">
                {animals
                  // Filter out animals without photos
                  .filter(
                    (animal: Animal) =>
                      animal.photos.length > 0 && animal.primary_photo_cropped
                  )
                  .map((animal: Animal) => (
                    <div
                      key={animal.id}
                      className=" h-[30rem] p-2 mb-20 flex justify-space-between justify-center 
                      
                      items-center   "
                    >
                      <div className="max-w-sm rounded overflow-hidden shadow-lg ">
                        <Link
                          className=""
                          prefetch="intent"
                          to={`/dashboard/${animal.id}`}
                        >
                          <img
                            src={
                              animal.primary_photo_cropped
                                ? animal.primary_photo_cropped.small
                                : ""
                            }
                            alt="animal"
                            className="w-full h-[15rem] rounded-full"
                          />
                        </Link>
                        <div className="px-3 py-2">
                          <h2 className="font-bold text-xl mb-2">
                            <Link
                              to={`/dashboard/${animal.id}`}
                              prefetch="intent"
                              className=""
                            >
                              {animal.name}
                            </Link>
                          </h2>
                        </div>
                        <div className="px-6 pt-4 pb-2">
                          <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                            {animal.breeds.primary}
                          </span>
                          <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                            {animal.age}
                          </span>
                          <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                            {animal.size}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </Await>
        </Suspense>
        <div className="join flex justify-center">
          {/* <button
            className="join-item btn"
            onClick={() => (pageNumber > 1 ? pageNumber - 1 : 1)}
          >
            «
          </button>
          <button className="join-item btn">Page {pageNumber}</button> */}
          <button
            className="join-item btn"
            disabled={pageNumber <= 1}
            onClick={prevPage}
          >
            «
          </button>
          <button className="join-item btn">Page {pageNumber}</button>
          <button
            className="join-item btn"
            disabled={pageNumber >= 5}
            onClick={nextPage}
          >
            »
          </button>
        </div>
      </div>
    </div>
  );
}
