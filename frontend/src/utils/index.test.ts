import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { isHttpError } from './index';
import { SerializedError } from '@reduxjs/toolkit';

describe('isHttpError', () => {
  test('return true when status is string', () => {
    const error: FetchBaseQueryError = {
      status: 'FETCH_ERROR',
      error: '',
    };
    expect(isHttpError(error)).toBe(true);
  });
  test('return true when status is number', () => {
    const error: FetchBaseQueryError = {
      status: 0,
      data: {},
    };
    expect(isHttpError(error)).toBe(true);
  });
  test('return false when status is missed', () => {
    const error: SerializedError = {};
    expect(isHttpError(error)).toBe(false);
  });
});
