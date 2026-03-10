<template>
  <ClientOnly>
    <ContentLink v-if="isDraftModeEnabled" />
  </ClientOnly>
  <header>
    <h1>DatoCMS + Nuxt Starter Kit</h1>
    <nav>
      <a href="https://www.datocms.com/docs/nuxt"> 📚 Full Integration Guide </a>
    </nav>
    <DraftModeToggler />
  </header>
  <main><NuxtPage /></main>
</template>

<script setup lang="ts">
import { toHead } from 'vue-datocms';
import { TagFragment } from './lib/datocms/commonFragments';
import { graphql } from './lib/datocms/graphql';
import { DraftModeToggler } from '#components';

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

const isDraftModeEnabled = useDraftMode();
const data = await useQuery(query);

useHead(() => {
  return toHead(data.value?._site?.faviconMetaTags || []);
});
</script>
