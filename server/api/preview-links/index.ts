import { type ApiTypes, buildClient, type RawApiTypes } from '@datocms/cma-client';
import { ensureHttpMethods, handleUnexpectedError } from '~/lib/api/utils';
import type { AnyModel } from '~/lib/datocms/cma-types';
import { recordToWebsiteRoute } from '~/lib/datocms/recordInfo';

type WebPreviewsRequestBody = {
  item: RawApiTypes.Item<AnyModel>;
  itemType: ApiTypes.ItemType;
  environmentId: string;
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

    // The token is sent by the plugin as a request header (see /api/post-deploy)
    const token = getHeader(event, 'authorization')?.replace(/^Bearer /, '');

    // Ensure that the request is coming from a trusted source
    if (!token || token !== config.secretApiToken) {
      throw createError({ message: 'Invalid token', status: 401 });
    }

    /**
     * The plugin sends the record and model for which the user wants a preview,
     * along with information about which locale they are currently viewing in
     * the interface
     */
    const { item, locale, environmentId } = await readBody<WebPreviewsRequestBody>(event, {
      strict: true,
    });

    // We can use this info to generate the frontend URL associated
    const url = await recordToWebsiteRoute(item, locale);

    /**
     * The plugin only sends the current (draft) version of the record. If it has
     * unpublished changes (e.g. a modified slug), the published URL might differ,
     * so we compute it from the published version.
     *
     * See "How the preview links are built" in the README.
     */
    let publishedUrl = url;

    if (url && item.meta.status === 'updated') {
      try {
        const client = buildClient({
          apiToken: config.datocmsCmaToken,
          environment: environmentId,
        });

        const { data: publishedItem } = await client.items.rawFind<AnyModel>(item.id, {
          version: 'published',
        });

        publishedUrl = await recordToWebsiteRoute(publishedItem, locale);
      } catch (error) {
        /**
         * If the published version can't be fetched (e.g. missing CMA token),
         * fall back to the current URL instead of losing every preview link.
         */
        console.error(error);
      }
    }

    const response: WebPreviewsResponse = { previewLinks: [] };

    if (url) {
      /**
       * If status is not published, it means that it has a current version that's
       * different from the published one, so it has a draft version!
       */
      if (item.meta.status !== 'published') {
        /**
         * Generate a URL that initially enters Draft Mode, and then
         * redirects to the desired URL
         */
        response.previewLinks.push({
          label: 'Draft version',
          url: new URL(
            /*
             * We generate the URL in a way that it first passes through the
             * endpoint that enables the Draft Mode.
             */
            `/api/draft-mode/enable?redirect=${url}&token=${token}`,
            getRequestURL(event),
          ).toString(),
        });
      }

      /** If status is not draft, it means that it has a published version! */
      if (publishedUrl && item.meta.status !== 'draft') {
        /**
         * Generate a URL that first exits from Draft Mode, and then
         * redirects to the desired URL.
         */
        response.previewLinks.push({
          label: 'Published version',
          url: new URL(
            /*
             * We generate the URL in a way that it first passes through the
             * endpoint that disables the Draft Mode.
             */
            `/api/draft-mode/disable?redirect=${publishedUrl}`,
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
