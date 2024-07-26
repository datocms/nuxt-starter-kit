import type { EventHandlerRequest, H3Event } from 'h3';
import jwt, { type JwtPayload } from 'jsonwebtoken';

/**
 * Generates a JSON Web Token containing a DatoCMS token capable of
 * making requests to the DatoCMS Content Delivery API in Draft Mode.
 */
function jwtToken() {
  const config = useRuntimeConfig();
  return jwt.sign(
    { datocmsDraftContentCdaToken: config.datocmsDraftContentCdaToken },
    config.signedCookieJwtSecret,
  );
}

/**
 * To be used on API routes: sets the signed cookie required to enter Draft
 * Mode.
 */
export function enableDraftMode(event: H3Event<EventHandlerRequest>) {
  const config = useRuntimeConfig();

  setCookie(event, config.public.draftModeCookieName, jwtToken(), {
    partitioned: true,
    secure: true,
    sameSite: 'none',
  });
}

/**
 * To be used on API routes: disables Draft Mode by deleting the cookie.
 */
export function disableDraftMode(event: H3Event<EventHandlerRequest>) {
  const config = useRuntimeConfig();

  deleteCookie(event, config.public.draftModeCookieName);
}

/**
 * To be used on API routes: checks if Draft Mode is enabled for a given
 * request. It retrieves the cookie and verifies its JWT token.
 */
export function isDraftModeEnabled(event: H3Event<EventHandlerRequest>) {
  const config = useRuntimeConfig();
  const cookie = getCookie(event, config.public.draftModeCookieName);

  if (!cookie) {
    return false;
  }

  try {
    const payload = jwt.verify(cookie, config.signedCookieJwtSecret) as JwtPayload;

    return payload.enabled;
  } catch (e) {
    return false;
  }
}

/**
 * To be used on API routes: returns the HTTP headers needed to enable Draft Mode.
 */
export function draftModeHeaders(): HeadersInit {
  const config = useRuntimeConfig();

  return {
    Cookie: `${config.public.draftModeCookieName}=${jwtToken()};`,
  };
}
