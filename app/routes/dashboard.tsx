import { Form, Outlet } from "@remix-run/react";
import Navbar from "../components/navbar";

//import Filter from "../components/filter";

export default function Component() {
  return (
    <>
      <Navbar />{" "}
      <main className="">
        <div className="relative m-auto flex justify-center items-center ">
          <div className=" lg:w-1/2">
            <div className="md:w-[30rem]  m-auto pt-16  p-5 opacity-95  lg:p-12">
              <h2 className="font-customFont text-5xl ">
                Look for nearby pets today!
              </h2>
            </div>
          </div>
        </div>
        <div className="w-[30rem]  m-auto flex justify-center ">
          <Form
            method="get"
            action="/dashboard/search"
            className="w-full max-w-lg bg-white shadow-2xl rounded px-8 pt-6 pb-8 m-4 border-2  border-gray-500"
          >
            <div className="mb-4">
              <label
                htmlFor="zipcode"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Enter your zipcode
              </label>

              <input
                type="text"
                name="zipcode"
                placeholder="Enter Zipcode..."
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div>
              <span className=" block text-sm font-medium text-gray-700">
                Select a pet:{" "}
              </span>
              <div className="flex">
                <div className="m-4 ">
                  <input
                    type="radio"
                    id="dog"
                    name="pet"
                    value="dog"
                    className="radio focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                  />
                  <label htmlFor="dog" className="ml-2 text-sm text-gray-700">
                    Dogs
                  </label>
                </div>
                <div className="m-4 ml-10 ">
                  <input
                    type="radio"
                    name="pet"
                    value="cat"
                    id="cat"
                    className="radio focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                  />
                  <label htmlFor="cat" className="ml-2 text-sm text-gray-700">
                    Cats
                  </label>
                </div>
              </div>
            </div>
            {/* <Filter /> */}
            <div className="flex justify-center">
              <button
                type="submit"
                className="  bg-indigo-500 text-white px-4 py-2 btn btn-active btn-primary w-[20rem]"
              >
                Search
              </button>
            </div>
            <input type="hidden" name="page" value="3" />
          </Form>
        </div>

        <Outlet />
      </main>
    </>
  );
}
