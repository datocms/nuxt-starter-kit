import { ApiError } from '@datocms/cma-client';
import type { EventHandlerRequest, H3Event, HTTPMethod } from 'h3';
import { serializeError } from 'serialize-error';

/**
 * To be used on API routes: ensure that an incoming request method matches one
 * of the allowed methods.
 */
export function ensureHttpMethods(event: H3Event<EventHandlerRequest>, ...methods: HTTPMethod[]) {
  const normalizedMethods = Array.isArray(methods) ? methods : [methods];

  if (normalizedMethods.includes(event.method)) {
    return;
  }

  throw createError({
    statusCode: 401,
    message: `Invalid HTTP method, only the following methods are accepted: ${normalizedMethods.join(', ')}`,
  });
}

/**
 * To be used on API routes: handle any unexpected errors that may occur in an
 * API route, by returning a 500 status code and some relevant information.
 */
export function handleUnexpectedError(error: unknown) {
  try {
    throw error;
  } catch (e) {
    console.error(e);
  }

  if (error instanceof ApiError) {
    throw createError({
      statusCode: 500,
      message: error.message,
      data: {
        request: error.request,
        response: error.response,
      },
    });
  }

  const serialized = serializeError(error);

  /*
   * serializeError returns `unknown` when input is `unknown`.
   * We check if the result is an object and extract properties safely.
   */
  const isErrorObject = (value: unknown): value is Record<string, unknown> =>
    typeof value === 'object' && value !== null;

  if (isErrorObject(serialized)) {
    const { message, ...data } = serialized;
    const errorMessage = typeof message === 'string' ? message : 'An unexpected error occurred';

    throw createError({
      statusCode: 500,
      message: errorMessage,
      data,
    });
  }

  throw createError({
    statusCode: 500,
    message: 'An unexpected error occurred',
  });
}

export function isRelativeUrl(path: string): boolean {
  try {
    // Try to create a URL object — if it succeeds without a base, it's absolute
    new URL(path);
    return false;
  } catch {
    try {
      // Verify it can be parsed as a relative URL by providing a base
      new URL(path, 'http://example.com');
      return true;
    } catch {
      // If both attempts fail, it's not a valid URL at all
      return false;
    }
  }
}
