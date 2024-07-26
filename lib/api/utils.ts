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

  const { message, ...data } = serializeError(error);

  throw createError({
    statusCode: 500,
    message: message ?? 'An unexpected error occurred',
    data,
  });
}
