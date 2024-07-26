<template>
  <pre :class="`language-${node.language}`"><code ref="codeRef">{{node.code}}</code></pre>
</template>

<script setup lang="ts">
import type { Code } from 'datocms-structured-text-utils';
import hljs from 'highlight.js';

const { node } = defineProps<{
  node: Code;
}>();

const codeRef = ref<HTMLElement>();

watchEffect(() => {
  if (!codeRef.value || codeRef.value.dataset.highlighted) {
    return;
  }

  hljs.highlightElement(codeRef.value);
});
</script>
