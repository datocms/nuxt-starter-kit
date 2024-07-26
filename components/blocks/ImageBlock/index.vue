<template>
  <figure>
    <!-- Display responsive image -->
    <ResponsiveImage :data="unmaskedData.asset.responsiveImage" />
    <!-- Display image title -->
    <figcaption>{{ unmaskedData.asset.title }}</figcaption>
  </figure>
</template>

<script setup lang="ts">
import { type FragmentOf, readFragment } from '~/lib/datocms/graphql';
import { ImageBlockFragment } from './fragments';

const props = defineProps<{
  data: FragmentOf<typeof ImageBlockFragment>;
}>();

const unmaskedData = readFragment(ImageBlockFragment, props.data);
</script>
