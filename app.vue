<template>
  <header>
    <h1>DatoCMS + Nuxt Starter Kit</h1>
    <nav>
      <a href="https://www.datocms.com/docs/nuxt"> 📚 Full Integration Guide </a>
    </nav>
    <DraftModeToggler />
  </header>
  <main><NuxtPage /></main>
  <!--
    Enable click-to-edit overlays in draft mode only.

    The ContentLink component provides two editing experiences:
    1. On the standalone website: Click any content to open DatoCMS editor in a new tab
    2. Inside Web Previews plugin Visual mode: Click content to instantly edit in the side panel

    Only rendered in draft mode since the required stega-encoded metadata
    is only included in draft content responses (see useQuery.ts).
  -->
  <ClientOnly>
    <ContentLink v-if="draftMode" />
  </ClientOnly>
</template>

<script setup lang="ts">
import { toHead } from 'vue-datocms';
import { TagFragment } from './lib/datocms/commonFragments';
import { graphql } from './lib/datocms/graphql';
import { DraftModeToggler } from '#components';

const draftMode = useDraftMode();

const query = graphql(
  /* GraphQL */ `
    query RootQuery {
      _site {
        faviconMetaTags {
          ...TagFragment
        }
      }
    }
  `,
  [TagFragment],
);

const data = await useQuery(query);

useHead(() => {
  return toHead(data.value?._site?.faviconMetaTags || []);
});
</script>
