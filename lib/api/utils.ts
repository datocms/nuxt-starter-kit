import { ApiError } from '@datocms/cma-client';
import type { EventHandlerRequest, H3Event, HTTPMethod } from 'h3';
import { serializeError } from 'serialize-error';

const toError = (error: unknown) => (error instanceof Error ? error : new Error(String(error)));

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

  const { message, ...data } = serializeError(toError(error));

  throw createError({
    statusCode: 500,
    message: message ?? 'An unexpected error occurred',
    data,
  });
}

/**
 * Determine whether a user-supplied redirect target is safe to follow — i.e. it
 * points to the same host as the current request.
 *
 * This guards against open-redirect attacks. A naive `url.startsWith('http')`
 * check — and even a plain "is it a relative URL?" check — fails to catch
 * protocol-relative targets like `//evil.com` or backslash variants like
 * `/\evil.com`, both of which browsers happily send off-site.
 *
 * Instead, we resolve the candidate against the current request URL and require
 * the resulting hostname to match. Relative paths (`/foo`, `/a?b=1#c`) resolve
 * to the same host and pass; anything that escapes to another host — or fails to
 * parse — is rejected.
 */
export function isSafeRedirectUrl(candidate: string, requestUrl: URL): boolean {
  try {
    const target = new URL(candidate, requestUrl);
    return target.hostname === requestUrl.hostname;
  } catch {
    return false;
  }
}
