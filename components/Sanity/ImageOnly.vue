<template>
    <div v-if="section" class="my-3">
        <SanityImage v-if="section" :asset-id="section._ref"/>
        <img v-else src="https://www2.tuhh.de/zll/wp-content/uploads/placeholder.png" alt="image">
    </div>
</template>

<script setup lang="ts">
defineProps<{
  section: any
}>()
</script>