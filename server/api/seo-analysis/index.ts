import { buildClient } from '@datocms/cma-client';
import { JSDOM } from 'jsdom';
import { draftModeHeaders } from '~/lib/api/draftMode';
import { ensureHttpMethods, handleUnexpectedError } from '~/lib/api/utils';
import { recordToSlug, recordToWebsiteRoute } from '~/lib/datocms/recordInfo';

type SeoAnalysisQuery = {
  itemId: string;
  itemTypeApiKey: string;
  itemTypeId: string;
  locale: string;
  sandboxEnvironmentId: string;
};

type SeoAnalysis = {
  locale: string;
  slug: string | 'unknown';
  permalink: string;
  title: string | null;
  description: string | null;
  content: string;
};

/**
 * This API route implements the Frontend metadata endpoint required for the
 * "SEO/Readability Analysis" plugin:
 *
 * https://www.datocms.com/marketplace/plugins/i/datocms-plugin-seo-readability-analysis#the-frontend-metadata-endpoint
 */

export default eventHandler(async (event) => {
  try {
    ensureHttpMethods(event, 'OPTIONS', 'GET');

    if (event.method === 'OPTIONS') {
      return {};
    }

    const config = useRuntimeConfig();

    // Parse query string parameters
    const { token } = getQuery(event);

    // Ensure that the request is coming from a trusted source
    if (token !== config.secretApiToken) {
      throw createError({ message: 'Invalid token', status: 401 });
    }

    /**
     * The plugin sends the record and model for which the user wants to perform
     * a SEO/Readability analysis, along with information about which locale
     * they are currently viewing in the interface
     */
    const { itemId, itemTypeId, itemTypeApiKey, locale, sandboxEnvironmentId } =
      getQuery<SeoAnalysisQuery>(event);

    if (!itemId || !itemTypeApiKey || !itemTypeId || !locale || !sandboxEnvironmentId) {
      throw createError({
        message: 'Missing required parameters',
        status: 422,
      });
    }

    const client = buildClient({
      apiToken: config.datocmsCmaToken,
      environment: sandboxEnvironmentId,
    });

    const { data: item } = await client.items.rawFind(itemId);

    // We can use this info to generate the frontend URL, and the page slug
    const websitePath = await recordToWebsiteRoute(item, itemTypeApiKey, locale);

    const slug = await recordToSlug(item, itemTypeApiKey, locale);

    if (!websitePath) {
      throw createError({
        message: `Don\'t know which route corresponds to record #${itemId} (model: ${itemTypeApiKey})!`,
        status: 404,
      });
    }

    /*
     * We need to retrieve the page from the frontend, in its draft version. To
     * do this, we set the cookies that are obtained by temporarily enabling
     * Draft Mode.
     */
    const pageRequest = await fetch(new URL(websitePath, getRequestURL(event)).toString(), {
      headers: draftModeHeaders(),
    });

    if (!pageRequest.ok) {
      throw createError({
        message: `Invalid status for ${websitePath}: ${pageRequest.status}`,
        status: 422,
      });
    }

    // Parse the HTML response into a DOM tree
    const { document } = new JSDOM(await pageRequest.text()).window;

    /*
     * To get only the page content without the header/footer, use a specific
     * selector on the page instead of taking everything from the body.
     */
    const contentEl = document.querySelector('body');

    if (!contentEl) {
      throw createError({
        message: 'No content found',
        status: 422,
      });
    }

    // Build the response in the format expected by the plugin
    const response: SeoAnalysis = {
      locale: document.querySelector('html')?.getAttribute('lang') || 'en',
      slug: slug ?? 'unknown',
      permalink: websitePath,
      title: document.querySelector('title')?.textContent ?? null,
      description:
        document.querySelector('meta[name="description"]')?.getAttribute('content') ?? null,
      content: contentEl.innerHTML,
    };

    return response;
  } catch (error) {
    handleUnexpectedError(error);
  }
});
