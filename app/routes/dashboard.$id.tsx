import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useRouteLoaderData } from "@remix-run/react";
import { useEffect } from "react";



export default function Component() {
   const { user } = useRouteLoaderData("root");
  useEffect(() => {
  //fetching api data using the url params and the api token
  const res = await fetch(
    `https://api.petfinder.com/v2/animals?location=${}`,
    {
      headers: {
        Authorization: `Bearer ${user.access_token}`,
      },
    }
  );
  const animalData = await res.json();
},[])
  return (
    <div>
      <h2>Animal ID PAGE!!</h2>
      <img
        src="https://images.unsplash.com/photo-1517849845537-4d257902454a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZG9nfGVufDB8fDB8fHww"
        alt="animal"
      />
    </div>
  );
}
