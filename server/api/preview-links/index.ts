import type { SchemaTypes } from '@datocms/cma-client';
import { ensureHttpMethods, handleUnexpectedError } from '~/lib/api/utils';
import { recordToWebsiteRoute } from '~/lib/datocms/recordInfo';

type WebPreviewsRequestBody = {
  item: SchemaTypes.Item;
  itemType: SchemaTypes.ItemType;
  locale: string;
};

type PreviewLink = {
  label: string;
  url: string;
  reloadPreviewOnRecordUpdate?: boolean | { delayInMs: number };
};

type WebPreviewsResponse = {
  previewLinks: PreviewLink[];
};

/**
 * This API route implements the Previews webhook required for the "Web
 * Previews" plugin:
 *
 * https://www.datocms.com/marketplace/plugins/i/datocms-plugin-web-previews#the-previews-webhook
 */

export default eventHandler(async (event) => {
  try {
    ensureHttpMethods(event, 'OPTIONS', 'POST');

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
     * The plugin sends the record and model for which the user wants a preview,
     * along with information about which locale they are currently viewing in
     * the interface
     */
    const { item, itemType, locale } = await readBody<WebPreviewsRequestBody>(event, {
      strict: true,
    });

    // We can use this info to generate the frontend URL associated
    const url = await recordToWebsiteRoute(item, itemType.attributes.api_key, locale);

    const response: WebPreviewsResponse = { previewLinks: [] };

    if (url) {
      /**
       * If status is not published, it means that it has a current version that's
       * different from the published one, so it has a draft version!
       */
      if (item.meta.status !== 'published') {
        /**
         * Generate a URL that initially enters Next.js Draft Mode, and then
         * redirects to the desired URL
         */
        response.previewLinks.push({
          label: 'Draft version',
          url: new URL(
            /*
             * We generate the URL in a way that it first passes through the
             * endpoint that enables the Draft Mode.
             */
            `/api/draft-mode/enable?url=${url}&token=${token}`,
            getRequestURL(event),
          ).toString(),
        });
      }

      /** If status is not draft, it means that it has a published version! */
      if (item.meta.status !== 'draft') {
        /**
         * Generate a URL that first exits from Next.js Draft Mode, and then
         * redirects to the desired URL.
         */
        response.previewLinks.push({
          label: 'Published version',
          url: new URL(
            /*
             * We generate the URL in a way that it first passes through the
             * endpoint that disables the Draft Mode.
             */
            `/api/draft-mode/disable?url=${url}`,
            getRequestURL(event),
          ).toString(),
        });
      }
    }

    // Respond in the format expected by the plugin
    return response;
  } catch (error) {
    handleUnexpectedError(error);
  }
});
