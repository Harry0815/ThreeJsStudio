import * as THREE from 'three';
import { Camera, cameraTypeEnum } from './camera';
import { Light, lightTypeEnum } from './light';

export const defaultLightColor = 0xffffff;
export const defaultLightIntensity = 1;

/**
 * Construct a scene, camera, light, and renderer
 */
export interface constructReturn {
  scene: THREE.Scene;
  camera: Camera;
  lights: Map<string, Light>;
}

export interface preparedConstructReturn {
  basicControls: constructReturn;
  renderer: THREE.WebGLRenderer;
  animate: (pfkt: () => void) => void;
  addLight: (key: string, light: Light) => void;
  deleteLight: (key: string) => void;
}

/**
 * Construct a scene, camera, light, and renderer
 * @param width Width of the renderer
 * @param height Height of the renderer
 * @returns A scene, camera, lights, and renderer
 */
export const construct = (width: number, height: number): constructReturn => {
  const scene = new THREE.Scene();
  const camera = new Camera({
    type: cameraTypeEnum.PERSPECTIVE,
    fov: undefined,
    height: height,
    width: width,
    far: undefined,
    near: undefined,
  });

  const lights = new Map<string, Light>();
  const standardLight = new Light({
    type: lightTypeEnum.Ambient,
    color: 0x7f7e80,
    skyColor: 0x7f7e80,
    groundColor: 0xffffff,
    intensity: 0.2,
    position: [0, 10, 10],
    width: 0.2,
    height: 0.2,
  });
  standardLight.setLightPosition(new THREE.Vector3(0, 2, 2));
  lights.set('standard', standardLight);

  return { scene, camera, lights };
};

/**
 * Prepares a 3D construct for rendering within a given canvas element. This function initializes a WebGL renderer,
 * attaches it to the canvas, and provides utility methods for managing lights and animation within the scene.
 *
 * @param {constructReturn} construct - The construct object containing the scene, camera, and lights setup.
 * @param {HTMLCanvasElement | undefined} canvasElement - The HTML canvas element where the construct will be rendered.
 * If undefined, the function will return `undefined`.
 * @returns {preparedConstructReturn | undefined} Returns an object containing the prepared construct, renderer,
 * utility methods for light management and animations, or `undefined` if the canvas element is not provided.
 */
export const prepareConstruct = (
  construct: constructReturn,
  canvasElement: HTMLCanvasElement | undefined,
): preparedConstructReturn | undefined => {
  if (!canvasElement) {
    return undefined;
  }

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(canvasElement.width, canvasElement.height);
  canvasElement.appendChild(renderer.domElement);

  if (canvasElement instanceof HTMLCanvasElement) {
  }

  for (const l of construct.lights.values()) {
    if (l.getLight()) {
      construct.scene.add(l.getLight() as THREE.Light);
    }
  }

  const animate = (pfkt: () => void): void => {
    const anim = (): void => {
      requestAnimationFrame(anim);
      pfkt();
      if (construct.camera.camera) {
        renderer.render(construct.scene, construct.camera.camera);
      }
    };
    anim();
  };

  const addLight = (key: string, light: Light): void => {
    construct.lights.set(key, light);
    construct.scene.add(light.getLight() ?? new THREE.AmbientLight(defaultLightColor, defaultLightIntensity));
  };

  const deleteLight = (key: string): void => {
    const light = construct.lights.get(key);
    if (light?.getLight()) {
      construct.lights.delete(key);
      construct.scene.remove(light.getLight() as THREE.Light);
    }
  };

  return {
    basicControls: construct,
    renderer,
    addLight,
    deleteLight,
    animate,
  };
};
