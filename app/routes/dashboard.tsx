import { Form, Outlet } from "@remix-run/react";

export default function Component() {
  return (
    <>
      {" "}
      <main>
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

        <Outlet />
      </main>
    </>
  );
}
