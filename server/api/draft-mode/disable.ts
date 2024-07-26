import { disableDraftMode } from '~/lib/api/draftMode';
import { ensureHttpMethods } from '~/lib/api/utils';

/*
 * This API route disables Draft Mode, by deleting the signed cookie.
 */
export default eventHandler(async (event) => {
  ensureHttpMethods(event, 'GET');

  // Parse query string parameters
  const query = getQuery<{ url?: string }>(event);
  const url = query.url || '/';

  // Avoid open redirect vulnerabilities
  if (url.startsWith('http://') || url.startsWith('https://')) {
    throw createError({ status: 422, message: 'URL must be relative!' });
  }

  disableDraftMode(event);

  await sendRedirect(event, url);
});
