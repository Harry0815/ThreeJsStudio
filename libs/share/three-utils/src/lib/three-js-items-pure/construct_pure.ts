import * as THREE from 'three';

const itemTypes = {
  construct: 0,
  renderer: 1,
  camera: 2,
  light: 3,
  scene: 4,
  material: 5,
} as const;

interface studioItem {
  name: string;
}

interface studioActionItem extends studioItem {
  active: boolean;
}

interface constructPure {
  name: string;
  canvasElement: HTMLCanvasElement | undefined;
  studioThreeItems: studioItem[]; // Array of studio items
  studioActionThreeItems: studioItem[]; // Array of studio items
}

interface studioRoom extends constructPure {
  name: string;
  type: number;
  width: number;
  height: number;
  length: number;
}

type renderer<T> = {
  type: number;
  renderer: T | undefined;
};

type camera<T> = {
  type: number;
  fov: number;
  aspect: number;
  near: number;
  far: number;
  position: THREE.Vector3;
  cameraObject: T;
};

type light<T> = {
  type: number;
  color: number;
  intensity: number;
  position: THREE.Vector3;
  lightObject: T;
};

type scene<T> = {
  type: number;
  scene: T;
};

type material<T> = {
  type: number;
  color: number;
  materialObject: T;
};

const createSystem = (
  name: string,
  width: number,
  height: number,
  length: number,
  canvasElement: HTMLCanvasElement | undefined,
): studioRoom => {
  return {
    canvasElement,
    name,
    type: itemTypes.construct,
    width,
    height,
    length,
    studioThreeItems: new Array<studioItem>(),
    studioActionThreeItems: new Array<studioItem>(),
  };
};

const addStudioItem = (system: studioRoom, item: studioItem): studioRoom => {
  return {
    ...system,
    studioThreeItems: [...system.studioThreeItems, item],
  };
};

const addStudioActionItem = (system: studioRoom, item: studioActionItem): studioRoom => {
  return {
    ...system,
    studioActionThreeItems: [...system.studioActionThreeItems, item],
  };
};

// create the room
let construct = createSystem('ThreeJS', 800, 600, 800, undefined);

// add (passive items) renderer, scene, material
construct = addStudioItem(construct, {
  name: 'Renderer',
  details: {
    type: itemTypes.renderer,
    renderer: undefined,
  } as renderer<THREE.WebGLRenderer>,
} as studioItem);

construct = addStudioItem(construct, {
  name: 'scene 1',
  details: {
    type: itemTypes.scene,
    scene: new THREE.Scene(),
  } as scene<THREE.Scene>,
} as studioItem);

construct = addStudioItem(construct, {
  name: 'material 1',
  details: {
    type: itemTypes.material,
    color: 0xffffff,
    materialObject: new THREE.MeshPhysicalMaterial(),
  } as material<THREE.MeshPhysicalMaterial>,
} as studioItem);

// add (active items) camera, light
construct = addStudioActionItem(construct, {
  name: 'camera 1',
  active: false,
  details: {
    type: itemTypes.camera,
    fov: 75,
    aspect: construct.width / construct.height,
    near: 0.1,
    far: 1000,
    position: new THREE.Vector3(0, 0, 0),
    cameraObject: new THREE.PerspectiveCamera(75, construct.width / construct.height, 0.1, 1000),
  } as camera<THREE.PerspectiveCamera>,
} as studioActionItem);

construct = addStudioActionItem(construct, {
  name: 'light 1',
  active: false,
  details: {
    type: itemTypes.light,
    color: 0xffffff,
    intensity: 1,
    lightObject: new THREE.AmbientLight(0xffffff),
  } as light<THREE.AmbientLight>,
} as studioActionItem);

console.log(construct);
