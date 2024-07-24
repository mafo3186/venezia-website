<template>
    <div :if="data">
        
        <!-- Project Details for getProjectById('fdc12128-95f4-41f6-a27c-b4719e27abed') -->
        <h1 v-if="data[0]?.title">{{ data[0].title }}</h1>
        <h2 v-if="data[0]?.author">{{ data[0].author }}</h2>
        <NuxtLink v-if="data[0]?.slug" :to="data[0].slug">Go to project</NuxtLink>
        <div class="" v-if="data[0]?.sections">
            <SanityGrid v-for="section in data[0]?.sections" :key="section.id" :section="section" />
        </div>

        <!-- All Projects -->
        <!-- <div class="all-projects" v-for="project in data" :key="project._id">
            <div class="project" v-if="project._type == 'projects'">
                <span>{{project._id}}</span>
                <h3> {{project.author}}</h3>
                <h2>{{project.title}}</h2>
                <NuxtLink v-if="data[0]?.slug" :to="project.slug">Go to project</NuxtLink>
            </div>
            <br>
        </div> -->
    </div>
</template>

<script setup lang="ts">
// import { getProjectById } from '~/queries/project'
// const { data } = useSanityQuery(getProjectById('566dd08d-7e95-4397-98d2-71353096cc6e'));

import { getAllProjectsMetaData } from '~/queries/project'
const { data } = useSanityQuery(getAllProjectsMetaData);




// import { getPageData } from '~/queries/pagedata'
// import type { SiteSettings } from '~/types/types';
// const { data } = useSanityQuery<SiteSettings>(getPageData);


</script>

<style lang="scss" scoped>

</style>