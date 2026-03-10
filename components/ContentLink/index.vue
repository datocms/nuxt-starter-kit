<script setup lang="ts">
import { createController } from '@datocms/content-link';
import { onMounted, onUnmounted, watch } from 'vue';

const router = useRouter();
const route = useRoute();

let controller: ReturnType<typeof createController> | null = null;

onMounted(() => {
  controller = createController({
    onNavigateTo: (path) => {
      router.push(path);
    },
  });

  if (window.matchMedia('(hover: hover)').matches) {
    controller.enableClickToEdit();
  }
});

watch(
  () => route.path,
  (newPath) => {
    controller?.setCurrentPath(newPath);
  },
  { immediate: true },
);

onUnmounted(() => {
  controller?.dispose();
  controller = null;
});
</script>

<template>
  <div />
</template>
