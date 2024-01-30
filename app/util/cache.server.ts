import { singleton } from "./singleton.server";

/* Until a server restart, this will be kept in memory and shared by all clients that connect to the server.
Because we use the singleton utility, the data also won't get lost in development due to HDR) */

type AnimalResult = { query: string; result: string };

export const animalResultsCache = singleton(
  "animalResultsCache",
  (): AnimalResult[] => []
);
