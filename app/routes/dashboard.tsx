import { Form } from "@remix-run/react";
import type { ActionFunctionArgs } from "@remix-run/node";

export let action: ActionFunctionArgs;

export default function Component() {
  return (
    <main>
      <Form method="post">
        <h2>Enter your zipcode to get started</h2>
        <fieldset>
          <input
            type="text"
            name="zipcode"
            placeholder="Enter Zipcode..."
            className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-2"
          />
          <button type="submit">Search</button>
        </fieldset>
      </Form>
    </main>
  );
}
