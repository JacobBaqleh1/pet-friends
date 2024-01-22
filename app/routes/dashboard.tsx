import {  type ActionFunctionArgs } from "@remix-run/node";
import { Form, Link, Outlet, useActionData } from "@remix-run/react";
import { json } from "@remix-run/node";
export async function action({request}: ActionFunctionArgs){
  //getting the form data
  let formData = await request.formData();
  let newUser = {
    zipcode: formData.get('zipcode'),
    pet: formData.get('pet')
  };
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
   //fetching api data using the form data and the api token
   const res = await fetch(
     `https://api.petfinder.com/v2/animals?location=${newUser.zipcode}&type=${newUser.pet}`,
     {
       headers: {
         Authorization: `Bearer ${tokenData.access_token}`,
       },
     }
   );
   const animalData = await res.json();
   
   return json(animalData)
}


export default function Component() {
  //retrieve action function data
  const data = useActionData<typeof action>();
  console.log(data?.animals)
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
      
      <div className="grid gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-8">
        
        {data?.animals ? (
        data?.animals.map((animal): any => (
          <div key={animal.id} className="flex flex-col overflow-hidden rounded-lg border bg-white">
          <Link prefetch='intent' className="group relative block h-48 overflow-hidden bg-gray-100 md:h-64"
           to={`/dashboard/${animal.id}`}>
          <img alt="animal" src='https://images.unsplash.com/photo-1517849845537-4d257902454a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZG9nfGVufDB8fDB8fHww'></img>
          </Link>
          </div>
        ))
        ) :( <p></p>
      )
      }
        
      </div>
      <Outlet />
    </main>
  );
}

{/* <form className="w-full max-w-lg">
  <div className="flex flex-wrap -mx-3 mb-6">
    <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
      <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-first-name">
        First Name
      </label>
      <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-first-name" type="text" placeholder="Jane" />
      <p className="text-red-500 text-xs italic">Please fill out this field.</p>
    </div>
    <div className="w-full md:w-1/2 px-3">
      <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-last-name">
        Last Name
      </label>
      <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-last-name" type="text" placeholder="Doe" />
    </div>
  </div>
  <div className="flex flex-wrap -mx-3 mb-6">
    <div className="w-full px-3">
      <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-password">
        Password
      </label>
      <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-password" type="password" placeholder="******************" />
      <p className="text-gray-600 text-xs italic">Make it as long and as crazy as you'd like</p>
    </div>
  </div>
  <div className="flex flex-wrap -mx-3 mb-2">
    <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
      <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-city">
        City
      </label>
      <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-city" type="text" placeholder="Albuquerque" />
    </div>
    <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
      <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-state">
        State
      </label>
      <div className="relative">
        <select className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-state">
          <option>New Mexico</option>
          <option>Missouri</option>
          <option>Texas</option>
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
        </div>
      </div>
    </div>
    <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
      <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-zip">
        Zip
      </label>
      <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-zip" type="text" placeholder="90210" />
    </div>
  </div>
</form> */}
