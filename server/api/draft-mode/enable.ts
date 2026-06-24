import { enableDraftMode } from '~/lib/api/draftMode';
import { ensureHttpMethods, isSafeRedirectUrl } from '~/lib/api/utils';

/*
 * This API route enables Draft Mode. If the token is correct, it writes the API
 * Token into a signed cookie that allows access to DatoCMS draft content.
 */
export default eventHandler(async (event) => {
  ensureHttpMethods(event, 'GET');

  const config = useRuntimeConfig();

  // Parse query string parameters
  const query = getQuery<{ redirect?: string; token?: string }>(event);
  const url = query.redirect || '/';

  // Ensure that the request is coming from a trusted source
  if (query.token !== config.secretApiToken) {
    throw createError({
      statusCode: 401,
      message: 'Invalid token',
    });
  }

  // Avoid open redirect vulnerabilities
  if (!isSafeRedirectUrl(url, getRequestURL(event))) {
    throw createError({ status: 422, message: 'URL must be relative!' });
  }

  enableDraftMode(event);

  await sendRedirect(event, url);
});
