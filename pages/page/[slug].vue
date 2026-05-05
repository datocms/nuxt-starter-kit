<template>
  <div v-if="data?.page">
    <h1>{{ data.page.title }}</h1>

    <!--
      Structured Text is a JSON format similar to HTML, but with the advantage
      of a significantly reduced and tailored set of possible tags
      for editorial content, along with the capability to create hyperlinks
      to other DatoCMS records and embed custom DatoCMS blocks.

      <Text /> is the project-wide wrapper around <StructuredText /> from
      vue-datocms. It bakes in:
      - the data-datocms-content-link-group attribute (required by Visual
        Editing click-to-edit)
      - default custom node rules (e.g. lazy code blocks, headings with
        anchor links)

      Per-route concerns — renderBlock, renderInlineRecord, renderLinkToRecord,
      which depend on which models THIS specific structured-text field
      accepts — are still passed in here.
    -->

    <Text
      :data="data.page.structuredText"
      :renderInlineRecord="renderInlineRecord"
      :renderLinkToRecord="renderLinkToRecord"
      :renderBlock="renderBlock"
    />

    <footer>Published at {{ data.page._firstPublishedAt }}</footer>
  </div>
</template>

<script setup lang="ts">
import {
  BlocksImageBlock,
  BlocksImageGalleryBlock,
  InlineRecordsPageInline,
  LazyBlocksVideoBlock,
  LinkToRecordsPageLink,
} from '#components';
import type {
  RenderBlockContext,
  RenderInlineRecordContext,
  RenderRecordLinkContext,
} from 'vue-datocms';
import { toHead } from 'vue-datocms';
import { useQuery } from '~/composables/useQuery';
import { query, type StructuredTextBlock, type StructuredTextRecord } from './query';

const route = useRoute();
const slug = route.params.slug as string;

const data = await useQuery(query, { variables: { slug } });

if (!data.value?.page) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Page Not Found',
    fatal: true,
  });
}

/**
 * We use the `toHead()` helper provided by vue-datocms to automate the creation
 * of meta tags based on the `_seoMetaTags` present in a DatoCMS GraphQL query.
 */
useHead(() => {
  return toHead(data.value?.page?._seoMetaTags || []);
});

/*
 * If the structured text includes a reference to another DatoCMS record,
 * it's up to you to decide how to render them:
 */
const renderInlineRecord = ({ record }: RenderInlineRecordContext<StructuredTextRecord>) => {
  switch (record.__typename) {
    case 'PageRecord':
      return h(InlineRecordsPageInline, { record });
  }
};

/*
 * If the structured text includes a link to another DatoCMS record, it's
 * your decision to determine where the link should lead, or if you wish to
 * customize its appearance:
 */
const renderLinkToRecord = ({
  record,
  children,
  transformedMeta,
}: RenderRecordLinkContext<StructuredTextRecord>) => {
  switch (record.__typename) {
    case 'PageRecord':
      return h(LinkToRecordsPageLink, { record, transformedMeta }, () => children);
  }
};

/*
 * If the structured text embeds any blocks, it's up to you to decide how to
 * render them:
 */
const renderBlock = ({ record }: RenderBlockContext<StructuredTextBlock>) => {
  switch (record.__typename) {
    /*
     * The Lazy variant keeps the video player out of the page's initial JS
     * bundle — only fetched when actually needed.
     */
    case 'VideoBlockRecord':
      return h(LazyBlocksVideoBlock, { data: record });
    case 'ImageBlockRecord':
      return h(BlocksImageBlock, { data: record });
    case 'ImageGalleryBlockRecord':
      return h(BlocksImageGalleryBlock, { data: record });
  }
};
</script>
