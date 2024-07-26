<template>
  <component v-if="slug" :is="as" :id="slug" tabIndex="-1">
    <a :href="'#' + slug"><slot></slot> </a>
  </component>
  <component v-else :is="as"><slot></slot></component>
</template>

<script setup lang="ts">
/**
 * Renders a Structured Text heading node as an heading with anchor link.
 * https://www.datocms.com/docs/structured-text/dast#heading
 */

import { render as structuredTextToPlainText } from 'datocms-structured-text-to-plain-text';
import type { Heading } from 'datocms-structured-text-utils';

const { node } = defineProps<{
  node: Heading;
}>();

/**
 * Returns a slugified version of the string by converting the input to
 * lowercase, eliminating non-alphanumeric characters, and removing any hyphens
 * at the beginning or end of the string.
 */
const slugify = (str: string | null) =>
  str
    ? str
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '')
    : undefined;

const as = `h${node.level}` as const;

// Convert the node to plain text, and then slugify
const slug = slugify(structuredTextToPlainText(node));
</script>
