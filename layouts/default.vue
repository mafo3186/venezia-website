<template>
  <div>
    <div
      class="navigation"
      v-if="data && data[0] && data[0]._type == 'siteSettings'"
    >
      <div
        class="logo"
        @click="detailView ? null : (overlay = !overlay)"
        :class="[
          overlay ? 'header backdrop-blur-2xl xs:backdrop-blur-0' : '',
          detailView ? '!cursor-default' : '',
        ]"
      >
        <div class="wordmark p-2">
          <strong>{{ data[0]?.title }}</strong>
          <div>{{ data[0]?.subtitle }}</div>
        </div>
        <img
          class="mobile-nav"
          v-if="!overlay"
          src="~/public/bars.svg"
          alt=""
        />
        <img
          class="mobile-nav"
          v-else
          src="~/public/close.svg"
          alt=""
        />
      </div>
      <div
        v-if="!detailView"
        class="switch"
        @click="useDifferentNavi()"
      >
        <button
          class="fixed cursor-pointer top-4 right-4 flex justify-center items-center w-16 h-16 hover:scale-110 transition-all rounded-full bg-gray-200 bg-opacity-30 backdrop-blur-md"
        >
          <SanityImage
            v-if="isExplorative"
            :asset-id="data[0].imageAlternativeNavigation.asset._ref"
          />
          <SanityImage
            v-if="!isExplorative"
            :asset-id="data[0].imageExplorativeNavigation.asset._ref"
          />
        </button>
        <span class="fixed top-28 right-4 w-32 text-right text-xs"
          >Hier geht es zur
          {{ isExplorative ? "alternativen" : "explorativen" }} Navigation</span
        >
      </div>
      <div
        class="credits"
        v-if="overlay"
      >
        <!-- Image Selection -->
        <section class="bg-graphic-selection">
          <div
            class="graphic"
            v-for="name in getAllImageNames"
            :key="name"
          >
            <img
              :src="`/${name}.png`"
              :alt="name"
              class="w-16 h-16 rounded-full object-cover cursor-pointer hover:scale-110 transition-all"
              :class="currentImage == name ? 'border-2 border-black' : ''"
              @click="changeBgGraphic(name)"
            />
            <span class="description"> {{ getDescription(name) }}</span>
          </div>

          <!-- Navigation -->
          <div class="navigation">
            <div class="description">
              <SanityContent :blocks="data[0].description" />
              {{ data[0].credentials }}
            </div>
          </div>
        </section>
      </div>
    </div>
    <slot />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { getPageData } from "~/queries/pagedata";
import type { SiteSettings } from "~/types/types";
import { useRouter } from "vue-router";
import { useRoute } from "vue-router";

const router = useRouter();
const { data } = useSanityQuery<SiteSettings>(getPageData);
const overlay = ref(false);
const isExplorative = ref(true);
const route = useRoute();
const { detailView } = useDetailView();

if (route.path == "/sanity") {
  isExplorative.value = false;
} else if (route.path == "/") {
  isExplorative.value = true;
}

function useDifferentNavi() {
  isExplorative.value = !isExplorative.value;
  overlay.value = false;

  if (isExplorative.value) {
    router.push("/");
  } else {
    router.push("/sidemap");
  }
}

const {
  currentImage,
  getAllImageNames,
  setCurrentImageTo,
  getBackgroundDescription,
  currentDescription,
  getDescription,
} = usePoints();

function toggleNav() {
  overlay.value = false;
}

function changeBgGraphic(name: string) {
  if (!isExplorative.value) {
    setCurrentImageTo(name);
    router.push("/");
  }
  setCurrentImageTo(name);
  overlay.value = false;
}
</script>

<style>
html {
  --max-width: 1200px;
  --gap: 12px;
  --padding: 120px;
}

.change-view {
  position: absolute;
  top: 20px;
  right: 20px;
}
.credits {
  background: rgba(219, 219, 219, 0.3);
  backdrop-filter: blur(25px);
  position: absolute;
  top: 0;
  right: 0;
  height: 100vh;
  width: 100vw;
  z-index: 2;
  overflow-x: hidden;
}

.credits section.bg-graphic-selection {
  display: flex;
  position: relative;
  max-width: var(--max-width);
  margin: 0 auto;
  top: 20%;
  gap: 40px var(--gap);
  flex-wrap: wrap;
  flex-direction: row;
  padding: var(--padding);
  padding-left: 200px !important;
  padding-right: 0 !important;
  width: 100%;
  overflow: auto;
}

.credits section.bg-graphic-selection .graphic {
  width: calc(((var(--max-width) - 2 * var(--padding)) - 2 * var(--gap)) / 3);
  display: flex;
  gap: 12px;
  flex-direction: column;
}

@media screen and (max-width: 36rem) {
  .credits section.bg-graphic-selection {
    padding: 120px 16px !important;
  }
  .credits section.bg-graphic-selection .graphic {
    width: calc(100% - 2 * var(--gap));
  }
}

.credits .navigation .image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.navigation .logo {
  background-color: none;
  padding: 16px;
  text-align: left;
  position: absolute;
  top: 30%;
  transform: translateY(-30%);
  max-width: 120px;
  font-weight: 500;
  z-index: 9999;
  cursor: pointer;
  display: flex;
}
.navigation .logo .mobile-nav {
  display: none;
}

.switch {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 9999;
}

.switch img {
  max-width: 100%;
  height: auto;
  aspect-ratio: 1 / 1;
  object-fit: cover;
  border-radius: 100px;
}

.switch span {
  display: none;
}

.switch button:hover + span {
  display: block;
}

@media screen and (max-width: 36rem) {
  .navigation .logo.header {
    background: #dbdbdb76;
    width: 100%;
    position: fixed;
  }
  .navigation .logo {
    top: 0px;
    max-width: 100%;
    font-weight: 500;
    z-index: 9999;
    cursor: pointer;
    transform: translateY(0px);
    gap: 16px;
  }
  .navigation .logo .mobile-nav {
    display: none;
  }
  .credits {
    height: auto;
  }
  .credits .navigation {
    grid-template-columns: repeat(6, 1fr);
  }
  .credits .navigation .image {
    grid-column: 2 / 7;
    grid-row: 1;
    height: 60vh;
    margin-top: calc(10vh + 80px);
  }
  .credits .navigation .description {
    grid-column: 2 / 7;
    grid-row: 2;
    padding: 0px;
    height: calc(100% - 45%);
  }
}

.navigation {
  @apply mt-24;
}
</style>
