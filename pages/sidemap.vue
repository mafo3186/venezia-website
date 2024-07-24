<template>
    <side-map-mobile v-if="isMobileScreen" />
    <side-map v-else />
</template>


<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';

const isMobileScreen = ref(false); 
const checkWindowSize = () => {
    isMobileScreen.value = window.innerWidth <= 36 * 16;
};

onMounted(() => {
    checkWindowSize();
    window.addEventListener('resize', checkWindowSize);
});

onBeforeUnmount(() => {
    window.removeEventListener('resize', checkWindowSize);
});
</script>
