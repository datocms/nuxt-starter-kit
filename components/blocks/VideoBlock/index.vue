<template>
  <figure>
    <!-- Render the video player component -->
    <VideoPlayer :data="unmaskedData.asset" />
    <!-- Display the title of the video asset below the video player -->
    <figcaption>{{ unmaskedData.asset.title }}</figcaption>
  </figure>
</template>

<script setup lang="ts">
import { type FragmentOf, readFragment } from '~/lib/datocms/graphql';
import { VideoPlayer } from '#components';
import { VideoBlockFragment } from './fragments';

const props = defineProps<{
  data: FragmentOf<typeof VideoBlockFragment>;
}>();

// Read unmasked data from fragment
const unmaskedData = readFragment(VideoBlockFragment, props.data);
</script>
