import type { MetaFunction, LinksFunction } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { Image } from "@unpic/react";
import dogImage from "public/dog-image.jpg";
export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossorigin: "anonymous",
  },
  {
    href: "https://fonts.googleapis.com/css2?family=Protest+Riot&display=swap",
    rel: "stylesheet",
  },
];

export default function Component() {
  return (
    <main>
      {" "}
      <div>
        <div className="container ">
          <div className="flex justify-center  ">
            <div className="w-full text-center">
              <div className="w-2/3 mx-auto">
                <h1
                  style={{ fontFamily: "Protest Riot" }}
                  className="text-5xl font-medium mb-6 "
                >
                  Make Your New Friend
                </h1>
              </div>
              <p className="text-xl mb-12 ">
                {" "}
                We have the cutest pets available. All waiting to make you their
                new best friend.
              </p>
              <Form method="get" action="/dashboard">
                <button className="bg-indigo-500 text-white py-4 px-12 rounded-full hover:bg-indigo-600 btn btn-active btn-primary">
                  Get Started
                </button>
              </Form>
            </div>
          </div>
        </div>
        <Image alt="Logo" src={dogImage} layout="constrained" />
      </div>
    </main>
  );
}
