import { type Client, buildClient } from '@datocms/cma-client';
import { ensureHttpMethods, handleUnexpectedError } from '~/lib/api/utils';

/**
 * Install and configure the "Web Previews" plugin
 *
 * https://www.datocms.com/marketplace/plugins/i/datocms-plugin-web-previews
 */
async function installWebPreviewsPlugin(client: Client, baseUrl: string) {
  const config = useRuntimeConfig();

  const webPreviewsPlugin = await client.plugins.create({
    package_name: 'datocms-plugin-web-previews',
  });

  await client.plugins.update(webPreviewsPlugin, {
    parameters: {
      frontends: [
        {
          name: 'Production',
          previewWebhook: new URL(
            `/api/preview-links?token=${config.secretApiToken}`,
            baseUrl,
          ).toString(),
        },
      ],
      startOpen: true,
    },
  });
}

/**
 * Install and configure the "SEO/Readability Analysis" plugin
 *
 * https://www.datocms.com/marketplace/plugins/i/datocms-plugin-seo-readability-analysis
 */
async function installSEOAnalysisPlugin(client: Client, baseUrl: string) {
  const config = useRuntimeConfig();

  const seoPlugin = await client.plugins.create({
    package_name: 'datocms-plugin-seo-readability-analysis',
  });

  await client.plugins.update(seoPlugin.id, {
    parameters: {
      htmlGeneratorUrl: new URL(
        `/api/seo-analysis?token=${config.secretApiToken}`,
        baseUrl,
      ).toString(),
      autoApplyToFieldsWithApiKey: 'seo_analysis',
      setSeoReadabilityAnalysisFieldExtensionId: true,
    },
  });
}

export default eventHandler(async (event) => {
  try {
    ensureHttpMethods(event, 'OPTIONS', 'POST');

    if (event.method === 'OPTIONS') {
      return {};
    }

    const body = await readBody(event, { strict: true });

    const client = buildClient({ apiToken: body.datocmsApiToken });
    const baseUrl = body.frontendUrl as string;

    await Promise.all([
      installWebPreviewsPlugin(client, baseUrl),
      installSEOAnalysisPlugin(client, baseUrl),
    ]);

    return { success: true };
  } catch (error) {
    handleUnexpectedError(error);
  }
});
