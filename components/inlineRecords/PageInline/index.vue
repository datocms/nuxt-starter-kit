<template>
  <NuxtLink :href="buildUrlForPage(unmaskedRecord)" class="pill" data-datocms-content-link-boundary>
    {{ unmaskedRecord.title }}
  </NuxtLink>
</template>

<script setup lang="ts">
/*
 * If a structured text includes a reference to another DatoCMS record, it's
 * up to you to decide how to render them. The visual representation lives
 * here; the URL is owned by the per-model URL builder, composed via the URL
 * fragment.
 */

import { buildUrlForPage } from '~/lib/datocms/gqlUrlBuilder/page';
import { type FragmentOf, readFragment } from '~/lib/datocms/graphql';
import { PageInlineFragment } from './fragments';

const props = defineProps<{
  record: FragmentOf<typeof PageInlineFragment>;
}>();

const unmaskedRecord = readFragment(PageInlineFragment, props.record);
</script>
