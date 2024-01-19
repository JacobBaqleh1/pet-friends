import { redirect, type ActionFunctionArgs, type LoaderFunctionArgs } from "@remix-run/node";
import { Form, Outlet } from "@remix-run/react";
import { json } from "@remix-run/node";
export async function action({request}: ActionFunctionArgs){
  let formData = await request.formData();
  let newUser = {
    zipcode: formData.get('zipcode'),
    pet: formData.get('pet')
  };

  
  //fetching api token
  // const response = await fetch("https://api.petfinder.com/v2/oauth2/token", {
  //   method: "POST",
  //   body: new URLSearchParams({
  //     grant_type: "client_credentials",
  //     client_id: "0b5CWcWxxaW3fXPw7Lh2p0qMX9fpaYpOctVBLwbT3V4q2ift7I",
  //     client_secret: "un5wi6EsUOmgy0qwvsfHTofWlXL7Pboo780HRHFS",
  //   }),
  // });
  // const tokenData = await response.json();
  // //fetching api data
  // const res = await fetch(
  //   `https://api.petfinder.com/v2/animals?location=${newUser.zipcode}`,
  //   {
  //     headers: {
  //       Authorization: `Bearer ${tokenData.access_token}`,
  //     },
  //   }
  // );
  // const animalData = await res.json();
  return  redirect(`/dashboard/zipcode=${newUser.zipcode}&pet=${newUser.pet}`);
}

// export async function loader({request,}: LoaderFunctionArgs) {

  
// }

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
          <input type="radio" name="pet" value='dog' />Dogs
          <input type="radio" name="pet" value='cat' />Cats
          <br />
          <button type="submit">Search</button>
        </fieldset>
      </Form>
      <Outlet />
    </main>
  );
}
