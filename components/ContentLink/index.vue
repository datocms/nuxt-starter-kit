<script setup lang="ts">
import { ContentLink } from 'vue-datocms';

/**
 * ContentLink component enables click-to-edit overlays for DatoCMS content.
 *
 * This component provides two powerful editing experiences:
 *
 * 1. **Standalone website editing**: When viewing your draft content on the website,
 *    editors can click on any content element to open the DatoCMS editor and modify
 *    that specific field. This works by detecting stega-encoded metadata in the content
 *    and creating interactive overlays.
 *
 * 2. **Web Previews plugin integration**: When your preview runs inside the Visual Editing
 *    mode of the DatoCMS Web Previews plugin, this component automatically establishes
 *    bidirectional communication with the plugin. This enables:
 *    - Clicking content to instantly open the correct field in the side panel
 *    - In-plugin navigation: users can navigate to different URLs within Visual mode
 *      (like a browser navigation bar), and the preview updates accordingly
 *    - Synchronized state between the preview and the DatoCMS interface
 *
 * The component handles client-side routing by:
 * - Listening to navigation requests from the Web Previews plugin via `onNavigateTo`
 * - Notifying the plugin when the URL changes via `currentPath`
 *
 * This integration is completely automatic when running inside the plugin's iframe,
 * with graceful fallback to opening edit URLs in a new tab when running standalone.
 *
 * @see https://www.datocms.com/marketplace/plugins/i/datocms-plugin-web-previews
 */

const router = useRouter();
const route = useRoute();
</script>

<template>
  <ContentLink
    :on-navigate-to="(path: string) => router.push(path)"
    :current-path="route.path"
    :enable-click-to-edit="true"
  />
</template>
