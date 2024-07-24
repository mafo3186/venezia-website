<template>
  <div v-if="data">
    <div
      ref="canvasContainer"
      :class="useCursorPointer ? 'cursor-pointer' : ''"
      @mousedown="onMouseDown"
      @mousemove="onMouseMove"
      @mouseup="onMouseUp"
      @wheel.prevent="onWheel"
      @touchstart="onTouchStart"
      @touchmove.prevent="onTouchMove"
    />

    <div
      v-if="hoveredDots.length > 0 && !detailView"
      class="fixed p-4 bg-gray-500 bg-opacity-30 backdrop-blur-xl pointer-events-none"
      :style="`top: ${pointer.y + TOOLTIP_OFFSET}px; left: ${
        pointer.x + TOOLTIP_OFFSET
      }px;`"
    >
      <strong>
        {{ currentProjectMetaData?.title }}
      </strong>
      <p>
        {{ currentProjectMetaData?.author }}
      </p>
    </div>
    <div
      v-if="GENERATE_NEW_POINTS"
      class="fixed top-0 left-0 w-20 h-20 bg-green-300"
    >
      {{ points }}
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  Group,
  Mesh,
  PerspectiveCamera,
  Scene,
  Vector3,
  WebGLRenderer,
  Vector2,
  Raycaster,
  MeshBasicMaterial,
  TextureLoader,
  SRGBColorSpace,
  NoToneMapping,
  Color,
  SpriteMaterial,
  Sprite,
  MeshStandardMaterial,
  PlaneGeometry,
  BackSide,
  Object3D,
  type Object3DEventMap,
} from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { BokehPass } from "three/examples/jsm/postprocessing/BokehPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
// import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
// import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader';
import { getPoints } from "@/util/getPoints";
import gsap from "gsap";
import Stats from "stats.js";
import { getAllProjectsMetaData } from "~/queries/project";
import type { ProjectMetaData } from "~/types/types";
import { getProjectById } from "~/queries/project";

// TODO: URL navigation
// TODO: mobile drag fix

const GENERATE_NEW_POINTS = false;

let scene: Scene,
  camera: PerspectiveCamera,
  cameraWrapper: Group,
  dotWrapper: Group,
  renderer: WebGLRenderer,
  raycaster: Raycaster;
// background: Mesh;

const canvasContainer = shallowRef<HTMLElement>();

const { detailView, currentDotIndex, setCurrentProject } = useDetailView();
const { width, height } = useWindowSize();
const { mousePos } = useMousePos();
const router = useRouter();

const { currentPoints, currentImage } = usePoints();
const currentProjectMetaData = ref<ProjectMetaData>();

const state = reactive({
  clearColor: "gray",
  shadows: false,
  alpha: false,
  SRGBColorSpace: SRGBColorSpace,
  toneMapping: NoToneMapping,
  pixelRatio: 0.2,
  antialiasing: true,
  depth: true,
});

const cameraState = reactive({
  viewAngle: 70,
  nearDistance: 0.1,
  farDistance: 5000,
  lookAt: new Vector3(0, 0, 0),
});

const BASE_SCALE = 50;
const SCALE_FACTOR = 3;

const postprocessing: any = {};

const useCursorPointer = ref(false);
const { isInStandBy, resetStandByTimer } = usestandBy();
let standByAnimation: gsap.core.Tween;
let resetAnimation: gsap.core.Tween;

const STAND_BY_ANIMATION_DURATION = 30;
const RESET_ANIMATION_DURATION = 1;
const ZOOM_ANIMATION_DURATION = 1;
const ZOOM_OFFSET = new Vector3(-30, -20, -150); // based on screen size

const CAMERA_START_POSITION = new Vector3(0, 0, -2000);
const MOVE_STRENGTH = 1.5;
const MOVE_STRENGTHDetailView = 0.00002;

const MAIN_DOT_COLOR = "rgb(252, 228, 167)";
const MAIN_DOT_COLOR_SELECTION = "rgb(224, 174, 34)";

let points: { x: number; y: number; z: number; name: string; group: string }[];
let mainDots: Mesh[] = [];

// Data
const { data } = (await useSanityQuery(getAllProjectsMetaData)) as {
  data: Ref<ProjectMetaData[]>;
};
const projectData = ref();
const TOOLTIP_OFFSET = 20;

// Stats
let stats: Stats;

onMounted(async () => {
  window.addEventListener("keydown", handleKeyDown);
  window.addEventListener("keyup", handleKeyUp);
  requestAnimationFrame(updatePosition);

  await init();
  render();

  const projectSlug = router.currentRoute.value.query.project as string;
  if (projectSlug) {
    currentProjectMetaData.value = data.value.find(
      (project) => project.slug == projectSlug
    );

    setTimeout(async () => {
      if (currentProjectMetaData && currentProjectMetaData.value) {
        projectData.value = await fetchProjectByID(
          currentProjectMetaData.value._id
        );
        setCurrentProject(projectData.value);
        detailView.value = true;
        currentDotIndex.value = 0;
        console.log("slgu");
        zoomToDot();
        updateVisuals(POST_PROCESSING_STATE_ALT);
      }
    }, 1000);
  }

  isInStandBy.value = true;
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeyDown);
  window.removeEventListener("keyup", handleKeyUp);
});

// #################### Initialization ####################
/**
 * The main initialization, which creates all needed parts:
 * - scene
 * - renderer
 * - camera
 * - light
 * - raycaster
 * - elements
 * - post processing
 */
async function init() {
  // Scene
  scene = new Scene();

  // Renderer
  renderer = new WebGLRenderer({
    antialias: state.antialiasing,
    alpha: state.alpha,
    depth: state.depth,
    logarithmicDepthBuffer: true,
  });
  renderer.setSize(width.value, height.value);
  renderer.setClearColor(state.clearColor);
  renderer.outputColorSpace = state.SRGBColorSpace;
  renderer.toneMapping = state.toneMapping;
  renderer.shadowMap.enabled = state.shadows;
  renderer.setPixelRatio(0.5);
  canvasContainer.value?.appendChild(renderer.domElement);

  // Camera
  cameraWrapper = new Group();
  cameraWrapper.name = "cameraWrapper";
  cameraWrapper.position.set(0, 0, 0);
  camera = new PerspectiveCamera(
    cameraState.viewAngle,
    width.value / height.value,
    cameraState.nearDistance,
    cameraState.farDistance
  );
  cameraWrapper.add(camera);
  camera.position.set(
    CAMERA_START_POSITION.x,
    CAMERA_START_POSITION.y,
    CAMERA_START_POSITION.z
  );
  camera.lookAt(cameraState.lookAt);

  // Dots
  createDots();

  // Background
  // const geometry = new PlaneGeometry(window.innerWidth, window.innerHeight);
  // const material = new MeshBasicMaterial({ color: "white", side: BackSide });
  // const plane = new Mesh(geometry, material);
  // plane.scale.set(100, 100, 100);
  // plane.position.z = 2000;
  // plane.visible = false;
  // background = plane;
  // cameraWrapper.add(plane);

  // Raycaster
  raycaster = new Raycaster();

  // Animations
  standByAnimation = gsap.to(cameraWrapper.rotation, {
    delay: 1,
    duration: STAND_BY_ANIMATION_DURATION,
    repeat: Infinity,
    y: 6.25,
    ease: "none",
    paused: false,
  });

  resetAnimation = gsap.to(cameraWrapper.rotation, {
    delay: 0,
    duration: RESET_ANIMATION_DURATION,
    y: 0,
    ease: "power1",
    paused: true,
  });

  // Post Processing
  initPostprocessing();

  // Add elements to scene
  scene.add(cameraWrapper);
}

/**
 * Initializing of the post processing parts.
 * Currently disabled, because it creates a black background, what is unwanted.
 */
const POST_PROCESSING_STATE = reactive({
  color: new Color(255, 255, 255),
  // default value
  alpha: 1, // low value frenzy edges 0.5- | high value hard edges 10+
  bokeh: {
    focus: 1.0, // 1400
    aperture: 0.025, // 100
    maxblur: 0.0001, // 0.005
  },
});
const POST_PROCESSING_STATE_ALT = reactive({
  color: new Color(255, 255, 255),
  // default value
  alpha: 0.1, // low value frenzy edges 0.5- | high value hard edges 10+
  bokeh: {
    focus: 1.0, // 1400
    aperture: 0.025, // 100
    maxblur: 0.05, // 0.005
  },
});
const POST_PROCESSING_STATE_STANDBY = reactive({
  color: new Color(255, 255, 255),
  // default value
  alpha: 0.1, // low value frenzy edges 0.5- | high value hard edges 10+
  bokeh: {
    focus: 1000, // 1400
    aperture: 0.0025, // 100
    maxblur: 0.0, // 0.005
  },
});

async function createDots() {
  dotWrapper = new Group();
  dotWrapper.name = "dotWrapper";
  dotWrapper.position.set(0, 0, 0);
  points = currentPoints.value as typeof points;
  mainDots = [];

  if (GENERATE_NEW_POINTS) {
    points = (await getPoints("/horse.png")) as typeof points;
  }

  // Create dots
  const map = new TextureLoader().load("/dot_sprite.png");

  points.forEach((point, index) => {
    const material = new SpriteMaterial({ map });
    material.color.set("black");
    const dot = new Sprite(material);
    const random = randomNumber(0.25, 1.5);
    dot.scale.set(BASE_SCALE * random, BASE_SCALE * random, 1);

    dot.name = "dot#" + index;
    dot.position.set(point.x * 40, point.y * 30, point.z * 1000);
    dot.frustumCulled = true;

    dotWrapper.add(dot);
  });

  // Set Main Dots
  for (let i = 0; i < data.value.length; i++) {
    const dot = dotWrapper.children[
      +randomNumber(dotWrapper.children.length, 0).toFixed(0)
    ] as Mesh;
    if (dot) mainDots.push(dot);

    dot.scale.set(100, 100, 1);
    (dot.material as SpriteMaterial).color.set(MAIN_DOT_COLOR);
  }

  scene.add(dotWrapper);
}

function reorganizeDots() {
  const dotWrapper = scene.getObjectByName("dotWrapper");
  if (dotWrapper) {
    scene.remove(dotWrapper);

    // Dispose of the geometry, material and texture to free up memory
    dotWrapper.traverse(function (node) {
      if (node instanceof Mesh) {
        if (node.material) {
          node.material.dispose();
        }
        if (node.geometry) {
          node.geometry.dispose();
        }
        if (node.texture) {
          node.texture.dispose();
        }
      }
    });
  }

  createDots();
}

function initPostprocessing(state = POST_PROCESSING_STATE) {
  const renderPass = new RenderPass(scene, camera);
  renderPass.clearColor = state.color;
  renderPass.clearAlpha = state.alpha;

  const bokehPass = new BokehPass(scene, camera, {
    focus: state.bokeh.focus,
    aperture: state.bokeh.aperture,
    maxblur: state.bokeh.maxblur,
  });

  // const fxaaPass = new ShaderPass(FXAAShader);
  //     fxaaPass.uniforms.resolution.value.set( 1 / window.innerWidth, 1 / window.innerHeight );
  //     fxaaPass.renderToScreen = true;
  //     fxaaPass.material.transparent = true;

  const outputPass = new OutputPass();
  const composer = new EffectComposer(renderer);

  composer.addPass(renderPass);
  composer.addPass(bokehPass);
  composer.addPass(outputPass);
  // composer.addPass(fxaaPass);

  postprocessing.composer = composer;
  postprocessing.bokeh = bokehPass;
}

// #################### Render ####################
function render() {
  // stats.begin();
  requestAnimationFrame(render);

  postprocessing.composer.render(0.1);
  // stats.end();
}

function updateVisuals(newState: typeof POST_PROCESSING_STATE) {
  initPostprocessing(newState);
}

// #################### Watcher ####################
let originalPositions: { x: number; y: number; z: number }[] = [];

watch(isInStandBy, () => {
  dotWrapper.position.set(0, 0, 0);

  // standBy motiond
  if (isInStandBy.value && camera && cameraWrapper) {
    if (!standByAnimation.isActive()) {
      standByAnimation.restart();
    }

    // background.visible = true;

    // Stop the pulsating animation
    mainDots.forEach((dot) => {
      (dot.material as MeshStandardMaterial).color.set("black");
      if (dot.animation) {
        gsap.killTweensOf(dot.scale);
      }
    });

    // dotsDiagonalWaveMotion();
    // dotsRoundWaveMotionCenter();
    // dotsRoundWaveMotionDiagonal();

    updateVisuals(POST_PROCESSING_STATE_STANDBY);
  }

  // Reset to start
  else if (!isInStandBy.value && camera && cameraWrapper) {
    if (!resetAnimation.isActive()) {
      resetAnimation = gsap.to(cameraWrapper?.rotation, {
        delay: 0,
        duration: RESET_ANIMATION_DURATION,
        y: 0,
        ease: "power1",
        paused: true,
      });
      standByAnimation.paused(true);
      resetAnimation.paused(false);
    }

    // background.visible = false;

    mainDots.forEach((dot) => {
      (dot.material as MeshStandardMaterial).color.set(MAIN_DOT_COLOR);
    });

    // Return the dots to their original positions
    dotWrapper.children.forEach((dot, index) => {
      if (originalPositions[index]) {
        gsap.to(dot.position, {
          x: originalPositions[index].x,
          y: originalPositions[index].y,
          z: originalPositions[index].z,
          duration: 2, // Adjust this to change the animation speed
        });
      }
    });

    resetWaveAnimation();

    startPulsatingMainDots();
    updateVisuals(POST_PROCESSING_STATE);
  }
});

watch([width, height], () => {
  onResize();
});

/**
 * Watches changes of detailView.
 * In DetailView.vue -> is set to false.
 */
watch(detailView, () => {
  if (!detailView.value) {
    zoomToPosition(
      new Vector3(
        CAMERA_START_POSITION.x,
        CAMERA_START_POSITION.y,
        CAMERA_START_POSITION.z
      )
    );
    updateVisuals(POST_PROCESSING_STATE);

    // background.visible = false;

    const map = new TextureLoader().load("/dot_sprite.png");

    dotWrapper.children.forEach((dot) => {
      const material = new SpriteMaterial({ map });

      const foundMainDot = mainDots.find(
        (mainDot) => mainDot.name == dot.name
      ) as Mesh;
      material.color.set(foundMainDot ? MAIN_DOT_COLOR : "black");

      (dot as Mesh).material = material;
      dot.scale.set(BASE_SCALE, BASE_SCALE, BASE_SCALE);
    });

    hoveredDots.forEach((hoveredDot) => {
      const dot = dotWrapper.children.find(
        (dot) => dot.name == hoveredDot
      ) as Mesh;
      if (!dot) return;
    });

    hoveredDots = [];

    router.push({ path: "/", query: {} });
  } else {
    // background.visible = false;
  }
});

/**
 * Detailview block mouse input -> useMousePos composable
 */
watch(
  () => [mousePos.value.x, mousePos.value.y],
  () => {
    if (detailView.value) {
      dotWrapper.rotation.x = -mousePos.value.y * MOVE_STRENGTHDetailView;
      dotWrapper.rotation.y = -mousePos.value.x * MOVE_STRENGTHDetailView;
    }
  }
);

watch(currentDotIndex, () => {
  if (currentDotIndex.value == 0) return;

  zoomToDot();
});

let timelines: gsap.core.Timeline[] = [];

function dotsRoundWaveMotionCenter() {
  dotWrapper.children.forEach((dot, index) => {
    originalPositions[index] = {
      x: dot.position.x,
      y: dot.position.y,
      z: dot.position.z,
    };

    const gridSize = Math.ceil(Math.sqrt(dotWrapper.children.length));
    const totalGridWidth = gridSize * 50; // Total width of the grid
    const totalGridHeight = gridSize * 50; // Total height of the grid

    const row = Math.floor(index / gridSize);
    const col = index % gridSize;

    // Calculate the distance from the center of the grid
    const distanceFromCenter = Math.sqrt(
      Math.pow(row - gridSize / 2, 2) + Math.pow(col - gridSize / 2, 2)
    );

    // Set the initial position of the dot
    gsap.to(dot.position, {
      x: col * 50 - totalGridWidth / 2, // Adjust x position to center the grid
      y: row * 50 - totalGridHeight / 2, // Adjust y position to center the grid
      z:
        500 *
        Math.sin(distanceFromCenter / 5) *
        Math.cos(distanceFromCenter / 10), // Create rounded waves that increase in size
      duration: 2, // Adjust this to change the animation speed
    });

    // Create a new timeline for the dot
    const tl = gsap.timeline({ repeat: -1, yoyo: true });
    timelines.push(tl);

    // Add a wavy motion to the timeline
    tl.to(dot.position, {
      z: "+=100", // Increase the z position
      duration: 1, // Adjust this to change the animation speed
      delay: distanceFromCenter * 0.05, // Add a delay based on the distance from the center of the grid
    }).to(dot.position, {
      z: "-=100", // Decrease the z position
      duration: 1, // Adjust this to change the animation speed
    });
  });
}

function dotsRoundWaveMotionDiagonal() {
  dotWrapper.children.forEach((dot, index) => {
    originalPositions[index] = {
      x: dot.position.x,
      y: dot.position.y,
      z: dot.position.z,
    };

    const gridSize = Math.ceil(Math.sqrt(dotWrapper.children.length));
    const totalGridWidth = gridSize * 50; // Total width of the grid
    const totalGridHeight = gridSize * 50; // Total height of the grid

    const row = Math.floor(index / gridSize);
    const col = index % gridSize;

    // Calculate the distance from the top left corner of the grid
    const distanceFromTopLeft = Math.sqrt(Math.pow(row, 2) + Math.pow(col, 2));

    // Set the initial position of the dot
    gsap.to(dot.position, {
      x: col * 50 - totalGridWidth / 2, // Adjust x position to center the grid
      y: row * 50 - totalGridHeight / 2, // Adjust y position to center the grid
      z:
        500 *
        Math.sin(distanceFromTopLeft / 5) *
        Math.cos(distanceFromTopLeft / 10), // Create rounded waves that increase in size
      duration: 2, // Adjust this to change the animation speed
    });

    // Create a new timeline for the dot
    const tl = gsap.timeline({ repeat: -1, yoyo: true });
    timelines.push(tl);

    // Add a wavy motion to the timeline
    tl.to(dot.position, {
      z: "+=100", // Increase the z position
      duration: 1, // Adjust this to change the animation speed
      delay: distanceFromTopLeft * 0.05, // Add a delay based on the distance from the top left corner of the grid
    }).to(dot.position, {
      z: "-=100", // Decrease the z position
      duration: 1, // Adjust this to change the animation speed
    });
  });
}

function dotsDiagonalWaveMotion() {
  dotWrapper.children.forEach((dot, index) => {
    originalPositions[index] = {
      x: dot.position.x,
      y: dot.position.y,
      z: dot.position.z,
    };

    const gridSize = Math.ceil(Math.sqrt(dotWrapper.children.length));
    const totalGridWidth = gridSize * 50; // Total width of the grid
    const totalGridHeight = gridSize * 50; // Total height of the grid

    const row = Math.floor(index / gridSize);
    const col = index % gridSize;

    // Set the initial position of the dot
    gsap.to(dot.position, {
      x: col * 50 - totalGridWidth / 2, // Adjust x position to center the grid
      y: row * 50 - totalGridHeight / 2, // Adjust y position to center the grid
      z: 500 * Math.sin((col + row) / 5) * Math.cos((col + row) / 10), // Create rounded waves that increase in size
      duration: 2, // Adjust this to change the animation speed
    });

    // Create a new timeline for the dot
    const tl = gsap.timeline({ repeat: -1, yoyo: true });
    timelines.push(tl);

    // Add a wavy motion to the timeline
    tl.to(dot.position, {
      z: "+=100", // Increase the z position
      duration: 1, // Adjust this to change the animation speed
      delay: (row + col) * 0.05, // Add a delay based on the dot's position in the grid
    }).to(dot.position, {
      z: "-=100", // Decrease the z position
      duration: 1, // Adjust this to change the animation speed
    });
  });
}

function resetWaveAnimation() {
  // Kill all the timelines
  timelines.forEach((tl) => {
    tl.kill();
  });

  // Clear the timelines array
  timelines = [];

  // Return the dots to their original positions
  dotWrapper.children.forEach((dot, index) => {
    if (originalPositions[index]) {
      gsap.to(dot.position, {
        x: originalPositions[index].x,
        y: originalPositions[index].y,
        z: originalPositions[index].z,
        duration: 2, // Adjust this to change the animation speed
      });
    }
  });
}

watch(currentImage, () => {
  reorganizeDots();
});

// #################### Events ####################

const isDragging = ref(false);
function onMouseDown() {
  pointerUp = false;
  dragStartTime = Date.now();

  delayDrag();
}

function onTouchStart() {
  pointerUp = false;
  dragStartTime = Date.now();

  resetStandByTimer();
  delayDrag();
}

function onMouseUp() {
  if (!isDragging.value) {
    onClick();
  }

  isDragging.value = false;
  first = true;
  pointerUp = true;
}

// TODO: Needs to be tested after deployment
// let touchCounter = 0;
// function onTouchEnd() {
//   if (!isDragging.value) {
//     onClick();
//     touchCounter++;

//     if (touchCounter >= 0) {
//       touchCounter = 0;
//     }
//   }

//   isDragging.value = false;
//   first = true;
//   pointerUp = true;
// }

function onMouseMove(event: MouseEvent) {
  handlePointerInteraction(event.clientX, event.clientY);
}

function onTouchMove(event: TouchEvent) {
  handlePointerInteraction(event.touches[0].clientX, event.touches[0].clientY);
}

let hoveredDots: string[] = [];
let hoveredMainDot: Mesh;
let lastHoveredMainDot: Mesh;
let lastPointerPos = { x: 0, y: 0 };
const pointer = ref({ x: 0, y: 0 });
let first = true;
async function handlePointerInteraction(x: number, y: number) {
  // Check for new hovered objects
  const pointerX = (x / width.value) * 2 - 1;
  const pointerY = -(y / height.value) * 2 + 1;
  pointer.value = { x, y };

  // Dragging
  useDragging(pointerX, pointerY);

  // Hover interaction if object hovered
  if (!raycaster) return;
  raycaster.setFromCamera(new Vector2(pointerX, pointerY), camera);
  const intersects = raycaster.intersectObjects(dotWrapper.children);

  if (intersects && intersects[0]) {
    const hoveredDot = dotWrapper.children.find(
      (element) => element.name == intersects[0].object.name
    )!;

    setHoverState(hoveredDot);
  } else {
    removeHoverState();
  }
  resetStandByTimer();
}

function setHoverState(hoveredDot: Object3D<Object3DEventMap>) {
  hoveredMainDot = mainDots.find((dot) => dot.name == hoveredDot.name) as Mesh;

  if (!hoveredMainDot) {
    removeHoverState();
    return;
  }

  removeHoverState(); // Reset the color of lastHoveredMainDot

  currentProjectMetaData.value = getProjectByMainDot(hoveredDot as Mesh);
  hoveredDots = getDotsInRangeOfHover(hoveredDot as Mesh, 250);
  hoveredDots.push(hoveredMainDot.name);

  hoveredDots.forEach((entry) => {
    const dot = dotWrapper.children.find((dot) => dot.name == entry) as Mesh;
    if (!dot) return;

    (dot.material as MeshBasicMaterial).color.set(MAIN_DOT_COLOR_SELECTION);
  });

  lastHoveredMainDot = hoveredMainDot;
  useCursorPointer.value = true;
}

function removeHoverState() {
  hoveredDots.forEach((entry) => {
    const dot = dotWrapper.children.find((dot) => dot.name == entry) as Mesh;
    if (!dot || mainDots.find((mainDot) => mainDot.name == dot.name)) return;

    (dot.material as MeshBasicMaterial).color.set("black"); // Change color back to black
  });

  if (lastHoveredMainDot) {
    const dot = dotWrapper.children.find(
      (dot) => dot.name == lastHoveredMainDot.name
    ) as Mesh;
    if (dot) {
      (dot.material as MeshBasicMaterial).color.set(MAIN_DOT_COLOR);
    }
  }

  hoveredDots = [];
  useCursorPointer.value = false;
}

let dragStartTime: number = 0;
let pointerUp = false;
const dragDelay = 150;
function delayDrag() {
  setTimeout(() => {
    if (!pointerUp && Date.now() - dragStartTime >= dragDelay) {
      isDragging.value = true;
    }
  }, dragDelay);
}

function useDragging(pointerX: number, pointerY: number) {
  if (dotWrapper && isDragging.value) {
    // Rotate camera on drag
    if (!first) {
      dotWrapper.rotation.y += (pointerX - lastPointerPos.x) * MOVE_STRENGTH;
      dotWrapper.rotation.x += (pointerY - lastPointerPos.y) * MOVE_STRENGTH;
    }
    lastPointerPos.x = pointerX;
    lastPointerPos.y = pointerY;
    first = false;
  }
}

let moveDirection = { x: 0, y: 0 };
const MOVE_AMOUNT = 20;
function handleKeyDown(event: KeyboardEvent) {
  isInStandBy.value = false;

  switch (event.key) {
    case "w":
      moveDirection.y = -MOVE_AMOUNT;
      break;
    case "a":
      moveDirection.x = -MOVE_AMOUNT;
      break;
    case "s":
      moveDirection.y = MOVE_AMOUNT;
      break;
    case "d":
      moveDirection.x = MOVE_AMOUNT;
      break;
  }
}

function handleKeyUp(event: KeyboardEvent) {
  switch (event.key) {
    case "w":
    case "s":
      moveDirection.y = 0;
      break;
    case "a":
    case "d":
      moveDirection.x = 0;
      break;
  }
}

function updatePosition() {
  dotWrapper.position.x += moveDirection.x;
  dotWrapper.position.y += moveDirection.y;

  // Request the next frame
  requestAnimationFrame(updatePosition);
}

function getDotsInRangeOfHover(hoveredDot: Mesh, range: number): string[] {
  if (!currentProjectMetaData.value) return [];
  const dotsAmount = currentProjectMetaData.value.sections_amount + 1;

  const dotsInRange = dotWrapper.children
    .filter((dot) => {
      const distance = hoveredDot.position.distanceTo(dot.position);
      return distance < range && !mainDots.includes(dot as Mesh);
    })
    .map((dot) => dot.name);

  if (dotsInRange.length < dotsAmount) {
    return getDotsInRangeOfHover(hoveredDot, range + 50);
  }

  return dotsInRange.slice(0, dotsAmount);
}

async function fetchProjectByID(id?: string) {
  if (!id) return;

  const { data } = await useSanityQuery(getProjectById(id));
  return (data.value as Array<any>)[0];
}

function getProjectByMainDot(mainDot: Mesh) {
  return data.value[mainDots.indexOf(mainDot)];
}

async function onClick() {
  if (hoveredDots.length == 0) return;

  let map = new TextureLoader().load("/dot_close.png");

  dotWrapper.children.forEach((dot) => {
    const material = new SpriteMaterial({ map });
    material.color.set("black");
    (dot as Mesh).material = material;
  });

  map = new TextureLoader().load("/dot_close.png");

  hoveredDots.forEach((point) => {
    const dot = dotWrapper.children.find((dot) => dot.name == point);
    if (!dot) return;

    const material = new SpriteMaterial({ map });
    material.color.set("black");
    (dot as Mesh).material = material;
    dot.scale.set(
      BASE_SCALE * SCALE_FACTOR,
      BASE_SCALE * SCALE_FACTOR,
      BASE_SCALE * SCALE_FACTOR
    );
  });

  if (!detailView.value) {
    projectData.value = await fetchProjectByID(
      currentProjectMetaData.value?._id
    );

    setCurrentProject(projectData.value);
    detailView.value = true;
    currentDotIndex.value = 0;
    zoomToDot();
    updateVisuals(POST_PROCESSING_STATE_ALT);

    router.push({
      path: "/",
      query: { project: currentProjectMetaData.value?.slug },
    });
  }
}

const MAX_ZOOM = 0;
const MIN_ZOOM = -2000;
function onWheel(event: WheelEvent) {
  if (!camera) return;

  const zoomStrength = 0.3;
  const newZoom = camera.position.z + event.deltaY * zoomStrength;

  if (newZoom >= MAX_ZOOM || newZoom <= MIN_ZOOM) return;

  camera.position.z = newZoom;
}

function onResize() {
  if (!camera) return;

  camera.aspect = width.value / height.value;
  camera.updateProjectionMatrix();
  renderer.setSize(width.value, height.value);
  postprocessing.composer.setSize(width.value, height.value);
}

function zoomToPosition(position: Vector3, offset = new Vector3(0, 0, 0)) {
  if (!camera) return;

  gsap.to(camera?.position, {
    delay: 0,
    duration: ZOOM_ANIMATION_DURATION,
    x: position.x - width.value * 0.05,
    y: position.y - height.value * 0.05,
    z: position.z + offset.z,
    ease: "power1",
  });
}

function zoomToDot() {
  let foundDot = dotWrapper.children.find(
    (dot) => dot.name == hoveredDots[currentDotIndex.value]
  );

  if (!foundDot) {
    foundDot =
      dotWrapper.children[
        +randomNumber(dotWrapper.children.length - 1, 0).toFixed(0)
      ];
  }

  zoomToPosition(
    new Vector3(foundDot.position.x, foundDot.position.y, foundDot.position.z),
    ZOOM_OFFSET
  );
}

function startPulsatingMainDots() {
  mainDots.forEach((dot) => {
    dot.animation = gsap.to(dot.scale, {
      duration: 1 + randomNumber(0.5, 1.5), // Duration of one pulse
      x: 120, // Scale values for the pulse
      y: 120,
      z: 1,
      repeat: -1, // Repeat indefinitely
      yoyo: true, // Make the animation reverse on each alternate repeat
      ease: "power3.in", // Smooth easing function
    });
  });
}

function randomNumber(max = 30, min = -30) {
  return Math.random() * (max - min) + min;
}
</script>
