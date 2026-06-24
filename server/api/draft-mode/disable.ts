import { disableDraftMode } from '~/lib/api/draftMode';
import { ensureHttpMethods, isSafeRedirectUrl } from '~/lib/api/utils';

/*
 * This API route disables Draft Mode, by deleting the signed cookie.
 */
export default eventHandler(async (event) => {
  ensureHttpMethods(event, 'GET');

  // Parse query string parameters
  const query = getQuery<{ redirect?: string }>(event);
  const url = query.redirect || '/';

  // Avoid open redirect vulnerabilities
  if (!isSafeRedirectUrl(url, getRequestURL(event))) {
    throw createError({ status: 422, message: 'URL must be relative!' });
  }

  disableDraftMode(event);

  await sendRedirect(event, url);
});
