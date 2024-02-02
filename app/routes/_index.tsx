import type { MetaFunction } from "@remix-run/node";
import { Form } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Component() {
  return (
    <main className="bg-gray-800  min-h-screen">
      {" "}
      <div className="flex items-center">
        <section
          className="bg-cover bg-center py-32 max-w-7xl mx-auto"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1557495235-340eb888a9fb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZG9nJTIwYW5kJTIwaHVtYW58ZW58MHx8MHx8fDA%3D')",
          }}
        >
          <div className="container mx-auto text-left text-white">
            <div className="flex items-center">
              <div className="w-1/2  ">
                <h1 className="text-5xl font-medium mb-6">
                  Welcome to Pet friends
                </h1>
                <p className="text-xl mb-12"> Ready to adopt a pet?</p>
                <Form method="get" action="/dashboard">
                  <button className="bg-indigo-500 text-white py-4 px-12 rounded-full hover:bg-indigo-600">
                    Get Started
                  </button>
                </Form>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
