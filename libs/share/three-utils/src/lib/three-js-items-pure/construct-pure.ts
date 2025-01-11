import * as THREE from 'three';

const itemTypes = {
  construct: 0,
  renderer: 1,
  camera: 2,
  light: 3,
  scene: 4,
  material: 5,
} as const;

export interface studioItem {
  name: string;
  type: number;
  details: object;
}

export interface studioActionItem extends studioItem {
  active: boolean;
}

interface constructPure {
  name: string;
  canvasElement: HTMLCanvasElement | undefined;
  studioThreeItems: studioItem[]; // Array of studio items
  studioActionThreeItems: studioItem[]; // Array of studio items
}

export interface studioRoom extends constructPure {
  name: string;
  type: number;
  width: number;
  height: number;
  length: number;
}

export interface roomFunctions {
  init: () => void;
  reset: () => void;
  animate: () => void;
  updateCameraWindowSize: (newWidth: number, newHeight: number) => void;
}

export type studioRoomFunctions = studioRoom & roomFunctions;

type renderer<T> = {
  renderer: T | undefined;
};

type camera<T> = {
  fov: number;
  aspect: number;
  near: number;
  far: number;
  position: THREE.Vector3;
  cameraObject: T;
};

type light<T> = {
  color: number;
  intensity: number;
  position: THREE.Vector3;
  lightObject: T;
};

type scene<T> = {
  scene: T;
};

type material<T> = {
  color: number;
  materialObject: T;
};

export const createSystem = (
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

export const addFunctionToSystem = (system: studioRoom, functions: roomFunctions): studioRoomFunctions => {
  return {
    ...system,
    ...functions,
  };
};

export const addStudioItem = (system: studioRoom, item: studioItem): studioRoom => {
  return {
    ...system,
    studioThreeItems: [...system.studioThreeItems, item],
  };
};

export const addStudioActionItem = (system: studioRoom, item: studioActionItem): studioRoom => {
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
  type: itemTypes.renderer,
  details: {
    renderer: undefined,
  } as renderer<THREE.WebGLRenderer>,
} as studioItem);

construct = addStudioItem(construct, {
  name: 'scene 1',
  type: itemTypes.scene,
  details: {
    scene: new THREE.Scene(),
  } as scene<THREE.Scene>,
} as studioItem);

construct = addStudioItem(construct, {
  name: 'material 1',
  type: itemTypes.material,
  details: {
    color: 0xffffff,
    materialObject: new THREE.MeshPhysicalMaterial(),
  } as material<THREE.MeshPhysicalMaterial>,
} as studioItem);

// add (active items) camera, light
construct = addStudioActionItem(construct, {
  name: 'camera 1',
  active: false,
  type: itemTypes.camera,
  details: {
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
  type: itemTypes.light,
  details: {
    color: 0xffffff,
    intensity: 1,
    lightObject: new THREE.AmbientLight(0xffffff),
  } as light<THREE.AmbientLight>,
} as studioActionItem);

const functions = {
  init: () => {
    console.log('init');
    if (!construct.canvasElement) {
      throw new Error('Canvas element is not defined');
    }
    const renderer = construct.studioThreeItems.find((item) => item.type === itemTypes.renderer);
    if (renderer) {
      (renderer.details as renderer<THREE.WebGLRenderer>).renderer = new THREE.WebGLRenderer({
        canvas: construct.canvasElement,
      });
    }
  },
  reset: () => {
    console.log('reset');
  },
  animate: () => {
    console.log('animate');
  },
  updateCameraWindowSize: (newWidth: number, newHeight: number): void => {
    construct.height = newHeight;
    construct.width = newWidth;
    console.log('updateCameraWindowSize', newWidth, newHeight);
  },
} as roomFunctions;

construct = addFunctionToSystem(construct, functions);

console.log(construct);
functions.updateCameraWindowSize(100, 100);
console.log(construct);
