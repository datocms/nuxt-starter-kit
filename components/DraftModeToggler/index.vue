<template>
  <button v-if="isDraftModeEnabled" type="button" @click="handleClick">Disable Draft Mode</button>

  <button v-else type="button" @click="handleClick">Enable Draft Mode</button>
</template>

<script setup lang="ts">
const isDraftModeEnabled = useDraftMode();
const { draftModeDemoPassword } = useRuntimeConfig().public;

async function handleClick() {
  let response: Response;

  if (isDraftModeEnabled) {
    response = await fetch('/api/draft-mode/disable');
  } else {
    const token = prompt(
      'To enter Draft Mode, you need to insert the NUXT_SECRET_API_TOKEN:',
      draftModeDemoPassword,
    );
    if (!token) {
      return;
    }

    response = await fetch(`/api/draft-mode/enable?token=${token}`);
  }

  if (!response.ok) {
    alert('Could not complete the operation!');
    return;
  }

  document.location.reload();
}
</script>
