import { redirect } from "@remix-run/node";
import type { LoaderFunctionArgs } from "@remix-run/node";

/** Pet detail pages now live on Petfinder.com — send users back to search. */
export function loader({ request }: LoaderFunctionArgs) {
  const referer = request.headers.get("Referer");
  if (referer) {
    try {
      const url = new URL(referer);
      if (url.pathname.startsWith("/search")) {
        return redirect(`${url.pathname}${url.search}`);
      }
    } catch {
      // fall through
    }
  }
  return redirect("/dashboard");
}
