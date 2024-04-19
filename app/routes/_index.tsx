import type { MetaFunction } from "@remix-run/node";
import { Form } from "@remix-run/react";

import dogImage from "public/dog-image.jpg";
export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Component() {
  return (
    <main>
      {" "}
      <div className="flex flex-col justify-center items-center md:w-[30rem]  m-auto">
        <div className="container ">
          <div className="text-center">
            <div className="w-2/3 mx-auto">
              <h1 className="text-5xl font-medium mb-6 font-customFont  ">
                Adopt a <span className="text-purple-400">forever friend</span>{" "}
                today!
              </h1>
            </div>
            <p className="text-xl mb-12 ">
              {" "}
              Adopt a pet that you've always wanted from organizations in your
              area.
            </p>
            <Form method="get" action="/dashboard">
              <button className="bg-indigo-500 text-white py-4 px-12 rounded-full hover:bg-indigo-600 btn btn-active btn-primary">
                Get Started
              </button>
            </Form>
          </div>
        </div>
        <img alt="Logo" src={dogImage} />
      </div>
    </main>
  );
}
