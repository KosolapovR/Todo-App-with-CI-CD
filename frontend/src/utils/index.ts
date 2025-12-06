import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function isHttpError(
  err: SerializedError | FetchBaseQueryError
): err is FetchBaseQueryError {
  return 'status' in err;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
