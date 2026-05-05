<template>
  <div data-datocms-content-link-group>
    <DatoStructuredText v-bind="$attrs" :customNodeRules="mergedCustomNodeRules as any" />
  </div>
</template>

<script setup lang="ts">
/**
 * Project-wide wrapper around `<StructuredText />` from `vue-datocms`,
 * exposed as `<Text />` to distinguish it from the upstream component.
 *
 * Always render structured text through this component instead of importing
 * `vue-datocms` directly. Two reasons:
 *
 * 1. Every render needs `data-datocms-content-link-group` around it for
 *    Visual Editing to resolve clickable areas correctly. Centralizing the
 *    wrapper means no page can forget it.
 *
 * 2. Project-wide concerns — default node rules for headings and code
 *    blocks — are baked in here, so every structured-text field renders
 *    consistently without each caller restating them.
 *
 * Caller-supplied `customNodeRules` are *prepended* before the project
 * defaults: in `customNodeRules` earlier rules win, so caller rules must come
 * first to give them precedence and let callers opt out of any default.
 *
 * Implementation note: instead of declaring runtime props that mirror the
 * upstream component, we set `inheritAttrs: false` and forward `$attrs`
 * directly. Vue's `defineProps` with a borrowed type alias can't generate
 * runtime prop descriptors, so any prop that isn't explicitly listed would
 * silently turn into `undefined` at runtime — the bug that previously caused
 * `:data` not to reach the inner component. Using `$attrs` sidesteps the
 * runtime registration entirely.
 */

import { isCode, isHeading } from 'datocms-structured-text-utils';
import { StructuredText as DatoStructuredText, renderNodeRule } from 'vue-datocms';
import { HeadingWithAnchorLink, LazyCode } from '#components';

defineOptions({ inheritAttrs: false });

const attrs = useAttrs() as { customNodeRules?: unknown[] };

const projectDefaultNodeRules = [
  // Lazy variant keeps Code out of the page's initial JS bundle.
  renderNodeRule(isCode, ({ node, key }) => h(LazyCode, { key, node })),
  renderNodeRule(isHeading, ({ node, key, children }) =>
    h(HeadingWithAnchorLink, { node, key }, () => children),
  ),
];

const mergedCustomNodeRules = computed(() => [
  ...(attrs.customNodeRules ?? []),
  ...projectDefaultNodeRules,
]);
</script>
