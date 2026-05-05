<template>
  <NuxtLink v-bind="transformedMeta" :href="buildUrlForPage(unmaskedRecord)">
    <slot />
  </NuxtLink>
</template>

<script setup lang="ts">
/*
 * Link-to-record components own their visual representation; the URL is
 * built by the per-model URL builder. Renderer-provided meta (e.g. target,
 * rel) is honored via v-bind="transformedMeta". Note: no
 * `data-datocms-content-link-boundary` on link-to-record components — the
 * renderer handles those boundaries.
 */

import type { TransformedMeta } from 'datocms-structured-text-generic-html-renderer';
import { buildUrlForPage } from '~/lib/datocms/gqlUrlBuilder/page';
import { type FragmentOf, readFragment } from '~/lib/datocms/graphql';
import { PageLinkFragment } from './fragments';

const props = defineProps<{
  record: FragmentOf<typeof PageLinkFragment>;
  transformedMeta: TransformedMeta;
}>();

const unmaskedRecord = readFragment(PageLinkFragment, props.record);
</script>
