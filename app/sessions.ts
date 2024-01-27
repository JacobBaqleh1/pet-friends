import { createCookieSessionStorage } from "@remix-run/node"; 

type SessionData = {
  userId: string;
  zipcode: number | null;
   pet: string | null;
};

type SessionFlashData = {
  error: string;
};

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage<SessionData, SessionFlashData>(
    {
        cookie: {
            name: "__session",
            
    
    } 
  })
    export { getSession, commitSession, destroySession };