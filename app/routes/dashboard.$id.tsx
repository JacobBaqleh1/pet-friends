import { json } from "@remix-run/node";
import { useParams } from "@remix-run/react";




export default async function Component() {
    const token = await Token();
    const access_token = token.access_token;
  console.log('Access Token:', access_token);
//     const params = useParams();
//     const queryParams = new URLSearchParams(params.id);

//   // Get individual parameter values
//   const zipcode = queryParams.get('zipcode');
//   const pet = queryParams.get('pet');

  
 


    return(
        
        <main>
            <h2>List of animals</h2>
        </main>
    )
}

async function Token(){
 //fetching api token
  const response = await fetch("https://api.petfinder.com/v2/oauth2/token", {
    method: "POST",
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: "0b5CWcWxxaW3fXPw7Lh2p0qMX9fpaYpOctVBLwbT3V4q2ift7I",
      client_secret: "un5wi6EsUOmgy0qwvsfHTofWlXL7Pboo780HRHFS",
    }),
  });
  
  return response.json();
 
}

async function AnimalData(){
    const token = Token();
     //fetching api data
  const res = await fetch(
    `https://api.petfinder.com/v2/animals?location=${94546}`,
    {
      headers: {
        Authorization: `Bearer ${token.access_token}`,
      },
    }
  );
  const animalData = await res.json();
  return json({ animalData });
}