import {
  type BaseQueryFn,
  type FetchArgs,
  fetchBaseQuery,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { Mutex } from "async-mutex";

// Create a mutex to handle concurrent requests
const mutex = new Mutex();

const baseQuery = fetchBaseQuery({ baseUrl: "http://localhost:3003/" });

export const baseQueryWithRetry: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  // Wait until the mutex is available
  await mutex.waitForUnlock();

  let retryCount = 0;
  const maxRetries = 3;
  const initialDelay = 300; // 300ms initial delay

  while (true) {
    try {
      const result = await baseQuery(args, api, extraOptions);

      // If no error, return the result
      if (!result.error) return { data: result.data, meta: result.meta };

      // Only retry on specific status codes
      if (result.error.status !== 503 && result.error.status !== 504) {
        return result;
      }

      if (retryCount >= maxRetries) {
        return result;
      }

      retryCount++;
      const delay = initialDelay * 2 ** (retryCount - 1) + Math.random() * 100;
      await new Promise((resolve) => setTimeout(resolve, delay));
    } catch (error) {
      // Handle unexpected errors
      if (retryCount >= maxRetries) {
        return { error: error as FetchBaseQueryError, data: undefined };
      }
      retryCount++;
      const delay = initialDelay * 2 ** (retryCount - 1) + Math.random() * 100;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
};
