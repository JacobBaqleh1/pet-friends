import { LoaderFunctionArgs, json } from "@remix-run/node";
import { Await, useLoaderData } from "@remix-run/react";
import { Suspense } from "react";
import checkMark from "public/checkMark.svg";
import pawPrint from "public/pawPrint.svg";

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
      <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={animalId}>
          <main>
            <div className="max-w-7xl mx-auto">
              <div className="relative m-5 mt-20 border border-red-500">
                <div className="flex justify-center -top-16 ">
                  <img
                    src={
                      animalId.animal.primary_photo_cropped
                        ? animalId.animal.primary_photo_cropped.small
                        : ""
                    }
                    alt="animal"
                    className="rounded-full w-32 h-32 mx-auto "
                  />
                </div>
                {/* Content for animal */}
                <div className="mt-[1rem]">
                  {/* About me and Gallery div */}
                  <div className="flex flex-row justify-center">
                    <div
                      id="aboutMe"
                      className="cursor-pointer"
                      onClick={() => {
                        document
                          .getElementById("aboutMeDiv")
                          .classList.remove("hidden");
                        document
                          .getElementById("galleryDiv")
                          .classList.add("hidden");
                      }}
                    >
                      About Me /
                    </div>
                    <div
                      id="gallery"
                      className=" cursor-pointer"
                      onClick={() => {
                        document
                          .getElementById("aboutMeDiv")
                          .classList.add("hidden");
                        document
                          .getElementById("galleryDiv")
                          .classList.remove("hidden");
                      }}
                    >
                      Gallery
                    </div>
                  </div>
                  <div id="aboutMeDiv">
                    {/* About Me Content */}
                    <div className="overflow-x-auto">
                      <h2 className="font-bold">{animalId.animal.name}</h2>
                      <h3 className="flex items-center">
                        <img src={pawPrint} alt="paw" className="w-4 h-4" />
                        {animalId.animal.breeds.primary}
                      </h3>
                      {animalId.animal.attributes.shots_current ? (
                        <div className="flex items-center">
                          <img
                            src={checkMark}
                            alt="check mark"
                            className="w-6 h-6"
                          />
                          <p className="ml-2">Vaccinated</p>
                        </div>
                      ) : (
                        ""
                      )}
                      {animalId.animal.attributes.spayed_neutered ? (
                        <div className="flex items-center">
                          <img
                            src={checkMark}
                            alt="check mark"
                            className="w-6 h-6"
                          />
                          <p className="ml-2">Spayed</p>
                        </div>
                      ) : (
                        ""
                      )}
                      {animalId.animal.attributes.house_trained ? (
                        <div className="flex items-center">
                          <img
                            src={checkMark}
                            alt="check mark"
                            className="w-6 h-6"
                          />
                          <p className="ml-2">House Trained</p>
                        </div>
                      ) : (
                        ""
                      )}
                      {animalId.animal.attributes.special_needs ? (
                        <div className="flex items-center">
                          <img
                            src={checkMark}
                            alt="check mark"
                            className="w-6 h-6"
                          />
                          <p className="ml-2">Special Needs</p>
                        </div>
                      ) : (
                        ""
                      )}

                      <div className="border inline-block p-2">
                        <p>Age</p>
                        <p className="font-bold">{animalId.animal.age}</p>
                      </div>
                    </div>
                  </div>

                  <div id="galleryDiv" className="hidden">
                    Gallery Content
                  </div>
                </div>
              </div>
            </div>
          </main>
        </Await>
      </Suspense>
    </main>
  );
}
