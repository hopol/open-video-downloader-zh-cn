<template>
  <router-view/>
  <the-toaster/>
</template>

<script setup lang="ts">
import TheToaster from './components/TheToaster.vue';
import { useBinariesStore } from './stores/binaries';
import { useRouter } from 'vue-router';
import { useStrongholdStore } from './stores/stronghold';
import { useDragDrop } from './composables/useDragDrop.ts';

const router = useRouter();
const binariesStore = useBinariesStore();
const strongholdStore = useStrongholdStore();

useDragDrop();

const checkTools = async () => {
  const toolsToEnsure = await binariesStore.check();
  if (toolsToEnsure.length > 0) {
    await router.push('/install');
  }
};

try {
  void checkTools();
} catch (e) {
  console.error(e);
}

try {
  void strongholdStore.loadStatus();
} catch (e) {
  console.error(e);
}
</script>
