<template>
  <div class="gallery">
    <div>
      <figure :key="asset.id" v-for="asset in unmaskedData.assets">
        <!-- Display responsive image for each asset -->
        <ResponsiveImage :data="asset.responsiveImage" :imgStyle="{ width: 'auto' }" />
        <!-- Display title for each asset -->
        <figcaption>{{ asset.title }}</figcaption>
      </figure>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type FragmentOf, readFragment } from '~/lib/datocms/graphql';
import { ResponsiveImage } from '#components';
import { ImageGalleryBlockFragment } from './fragments';

const props = defineProps<{
  data: FragmentOf<typeof ImageGalleryBlockFragment>;
}>();

// Read unmasked data from fragment
const unmaskedData = readFragment(ImageGalleryBlockFragment, props.data);
</script>
