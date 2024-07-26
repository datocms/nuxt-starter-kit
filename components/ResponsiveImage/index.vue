<template>
  <NakedImage v-bind="other" :data="unmaskedData" />
</template>

<script setup lang="ts">
/**
 * This component is a wrapper for the `<NakedImage />` component provided by
 * vue-datocms, optimized for use with graphql.tada. We define the necessary
 * GraphQL fragment for this component to function only once, then reuse it
 * wherever needed.
 */

import type { ExtractPublicPropTypes } from 'vue';
import { NakedImage } from 'vue-datocms';
import { type FragmentOf, readFragment } from '~/lib/datocms/graphql';
import { ResponsiveImageFragment } from './fragments';

type NakedImageProps = /* @vue-ignore */ ExtractPublicPropTypes<typeof NakedImage>;

const props = defineProps<
  Omit<NakedImageProps, 'data'> & {
    data: FragmentOf<typeof ResponsiveImageFragment>;
  }
>();

const { data, ...other } = props;

const unmaskedData = readFragment(ResponsiveImageFragment, data);
</script>
