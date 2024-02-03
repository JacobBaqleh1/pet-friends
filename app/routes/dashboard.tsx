import { Form, Outlet } from "@remix-run/react";
//import Filter from "../components/filter";
export default function Component() {
  return (
    <>
      {" "}
      <main>
        <div className="relative mx-auto bg-white bg-opacity-20 bg-cover bg-center md:max-w-screen-lg ">
          <img
            alt="background"
            className="absolute h-full w-full object-cover"
            src="https://images.unsplash.com/photo-1509205477838-a534e43a849f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzB8fGNhdCUyMG9uJTIwcmlnaHR8ZW58MHx8MHx8fDA%3D"
          />
          <div className="text-white lg:w-1/2">
            <div className="pt-16  p-5 opacity-95  lg:p-12">
              <h2 className="font-serif text-5xl font-bold">
                Checkout nearby pets today!
              </h2>
            </div>
          </div>
        </div>

        <Form
          method="get"
          action="/dashboard/search"
          className=" max-w-7xl mx-auto"
        >
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
          <div className="">
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
          {/* <Filter /> */}

          <button
            type="submit"
            className="bg-indigo-500 text-white px-4 py-2 rounded-md"
          >
            Search
          </button>
        </Form>

        <Outlet />
      </main>
    </>
  );
}
