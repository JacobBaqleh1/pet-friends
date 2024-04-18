import { type LinksFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  NavLink,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
} from "@remix-run/react";

import styles from "./tailwind.css";
import { PageTransitionProgressBar } from "./components/progress";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles },
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossorigin: "anonymous",
  },
  {
    href: "https://fonts.googleapis.com/css2?family=Protest+Riot&display=swap",
    rel: "stylesheet",
  },
];

export default function App() {
  return (
    <Document>
      <Outlet />
    </Document>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  let errorMessage = error instanceof Error ? error.message : null;
  return (
    <Document>
      <section className="m-5 lg:m-20 flex flex-col gap-5">
        <h1>Unexpected Error</h1>
        <p>
          We are very sorry. An unexpected error occurred. Please try again or
          contact us if the problem persists.
        </p>
        {errorMessage && (
          <div className="border-4 border-red-500 p-10">
            <p>Error message: {errorMessage}</p>
          </div>
        )}
        <NavLink to="/">Back to homepage</NavLink>
      </section>
    </Document>
  );
}

function Document({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-
 width,initial-scale=1"
        />
        <Meta />
        <Links />
      </head>
      <body
        className="bg-background dark:bg-darkBackground
 text-lg text-text dark:text-darkText"
      >
        <PageTransitionProgressBar />
        {children}
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
