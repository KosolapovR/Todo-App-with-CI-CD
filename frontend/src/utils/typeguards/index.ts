import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

export function isHttpError(
  err: SerializedError | FetchBaseQueryError
): err is FetchBaseQueryError {
  return "status" in err;
}
