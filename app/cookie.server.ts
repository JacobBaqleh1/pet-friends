import { createCookieSessionStorage } from "@remix-run/node"; // or cloudflare/deno

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage({
    // a Cookie from `createCookie` or the same CookieOptions to create one
    cookie: {
      name: "userInput",
      secrets: ["r3m1xr0ck5"],
      sameSite: "lax",
    },
  });
export { getSession, commitSession, destroySession };
