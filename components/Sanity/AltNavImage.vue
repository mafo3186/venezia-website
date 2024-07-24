<template>
    <div v-if="url">
        test inside
        <SanityImage v-if="url.image.image.asset" :asset-id="url.image.image.asset._ref"/>
        <img v-else src="https://www2.tuhh.de/zll/wp-content/uploads/placeholder.png" alt="image">
        <br/>
        <span v-if="url.image?.caption" class="caption">{{url.image.caption}}</span>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    url: any
}>()
</script>