<template>
  <div v-if="data?.page">
    <h1>{{ data.page.title }}</h1>

    <!--
      Although the <StructuredText /> component knows how to convert all "standard"
      elements (headings, bullet lists, etc.) into HTML, it's possible to customize
      the rendering of each node.
    -->

    <StructuredText
      :data="data.page.structuredText"
      :customNodeRules="customNodeRules"
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
  HeadingWithAnchorLink,
  LazyBlocksVideoBlock,
  LazyCode,
  NuxtLink,
} from '#components';
import { isCode, isHeading } from 'datocms-structured-text-utils';
import {
  type RenderBlockContext,
  type RenderInlineRecordContext,
  type RenderRecordLinkContext,
  StructuredText,
  renderNodeRule,
  toHead,
} from 'vue-datocms';
import { useQuery } from '~/composables/useQuery';
import { query, type StructuredTextBlock, type StructuredTextRecord } from './query';

const data = await useQuery(query);

/**
 * We use the `toHead()` helper provided by vue-datocms to automate the creation
 * of meta tags based on the `_seoMetaTags` present in a DatoCMS GraphQL query.
 */
useHead(() => {
  return toHead(data.value?.page?._seoMetaTags || []);
});

const customNodeRules = [
  /*
   * By using the Lazy variant, the component will not be included in the page's
   * initial JavaScript bundle. It allows to defer loading of heavy components,
   * only fetching them when they're needed.
   */
  renderNodeRule(isCode, ({ node, key }) => h(LazyCode, { key, node })),
  renderNodeRule(isHeading, ({ node, key, children }) =>
    h(HeadingWithAnchorLink, { node, key }, () => children),
  ),
];

/*
 * If the structured text includes a reference to another DatoCMS record, it's
 * up to you to decide how to render them:
 */
const renderInlineRecord = ({ record }: RenderInlineRecordContext<StructuredTextRecord>) => {
  switch (record.__typename) {
    case 'PageRecord': {
      return h(NuxtLink, { href: '/', class: 'pill' }, () => record.title);
    }
  }
};

/*
 * If the structured text includes a link to another DatoCMS record,
 * it's your decision to determine where the link should lead, or if
 * you wish to customize its appearance:
 */
const renderLinkToRecord = ({
  record,
  children,
}: RenderRecordLinkContext<StructuredTextRecord>) => {
  switch (record.__typename) {
    case 'PageRecord': {
      return h(NuxtLink, { href: '/' }, () => children);
    }
  }
};

/*
 * If the structured text embeds any blocks, it's up to you to decide
 * how to render them:
 */
const renderBlock = ({ record }: RenderBlockContext<StructuredTextBlock>) => {
  switch (record.__typename) {
    case 'VideoBlockRecord': {
      /*
       * By using the Lazy variant, the component will not be included in the
       * page's initial JavaScript bundle. It allows to defer loading of heavy
       * components, only fetching them when they're needed.
       */
      return h(LazyBlocksVideoBlock, { data: record });
    }
    case 'ImageBlockRecord': {
      return h(BlocksImageBlock, { data: record });
    }
    case 'ImageGalleryBlockRecord': {
      return h(BlocksImageGalleryBlock, { data: record });
    }
  }
};
</script>
