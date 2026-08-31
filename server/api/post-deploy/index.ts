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
          previewWebhook: new URL('/api/preview-links', baseUrl).toString(),
          customHeaders: [{ name: 'Authorization', value: `Bearer ${config.secretApiToken}` }],
          visualEditing: {
            enableDraftModeUrl: new URL(
              `/api/draft-mode/enable?token=${config.secretApiToken}`,
              baseUrl,
            ).toString(),
            initialPath: '/',
          },
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
      htmlGeneratorUrl: new URL('/api/seo-analysis', baseUrl).toString(),
      customHeaders: [{ name: 'Authorization', value: `Bearer ${config.secretApiToken}` }],
      autoApplyToFieldsWithApiKey: 'seo_analysis',
      setSeoReadabilityAnalysisFieldExtensionId: true,
    },
  });
}

/**
 * The DatoCMS API token arrives in the request body, so without this check the
 * endpoint would happily write our SECRET_API_TOKEN into any project a caller
 * names, and the caller could then read it back from their own project.
 */
async function ensureSameProject(client: Client, ourApiToken: string) {
  const ourClient = buildClient({ apiToken: ourApiToken });

  const [callerProject, ourProject] = await Promise.all([
    client.site.find(),
    ourClient.site.find(),
  ]);

  return callerProject.id === ourProject.id;
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

    if (!(await ensureSameProject(client, useRuntimeConfig().datocmsCmaToken))) {
      throw createError({ message: 'Invalid token', status: 401 });
    }

    await Promise.all([
      installWebPreviewsPlugin(client, baseUrl),
      installSEOAnalysisPlugin(client, baseUrl),
    ]);

    return { success: true };
  } catch (error) {
    handleUnexpectedError(error);
  }
});
