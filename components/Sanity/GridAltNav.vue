<template>
     <div class="" v-if="section">
        <div ref="sectionRef" class="content-inner my-3">
            <SanityRichText v-if="section._type == 'sectionRichText'" :content="section"  />
            <SanityCustomImage v-if="section._type == 'sectionImage'" :section="section" />
            <SanityVideo v-if="section._type == 'sectionVideo'" :section="section" />
            <SanityGallery v-if="section._type == 'sectionGallery'" :section="section" />
            <SanityAudio v-if="section._type == 'sectionAudio'" :section="section" />
            <SanityIframe v-if="section._type == 'sectionIframe'" :section="section"/>
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps<{
  section?: any,
}>()
</script>