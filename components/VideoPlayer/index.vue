<template>
  <DatoVideoPlayer v-bind="other" :data="unmaskedData.video" accentColor="var(--color-accent)" />
</template>

<script setup lang="ts">
/**
 * This component is a wrapper for the `<VideoPlayer />` component provided by
 * vue-datocms, optimized for use with graphql.tada. We define the necessary
 * GraphQL fragment for this component to function only once, then reuse it
 * wherever needed.
 */

import { VideoPlayer as DatoVideoPlayer } from 'vue-datocms';
import { type FragmentOf, readFragment } from '~/lib/datocms/graphql';
import { VideoPlayerFragment } from './fragments';

type DatoVideoPlayerProps = /* @vue-ignore */ ExtractPublicPropTypes<typeof DatoVideoPlayer>;

const props = defineProps<
  Omit<DatoVideoPlayerProps, 'data'> & {
    data: FragmentOf<typeof VideoPlayerFragment>;
  }
>();

const { data, ...other } = props;

const unmaskedData = readFragment(VideoPlayerFragment, data);
</script>
