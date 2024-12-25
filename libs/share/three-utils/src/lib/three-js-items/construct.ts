import * as THREE from 'three';
import { Camera, cameraTypeEnum } from './camera';
import { createLight, createLightReturn, lightTypeEnum } from './light';

export const defaultLightColor = 0xffffff;
export const defaultLightIntensity = 1;

/**
 * Construct a scene, camera, light, and renderer
 */
export interface constructReturn {
  scene: THREE.Scene;
  camera: Camera;
  light: createLightReturn;
}

export interface preparedConstructReturn {
  basicControls: constructReturn;
  renderer: THREE.WebGLRenderer;
}

/**
 * Construct a scene, camera, light, and renderer
 * @param width Width of the renderer
 * @param height Height of the renderer
 * @returns A scene, camera, light, and renderer
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

  const light = createLight({
    type: lightTypeEnum.Ambient,
    color: defaultLightColor,
    intensity: defaultLightIntensity,
    position: [0, 0, 0],
  });

  return { scene, camera, light };
};

export const prepareConstruct = (
  construct: constructReturn,
  canvasElement: HTMLCanvasElement | undefined,
): preparedConstructReturn | undefined => {
  if (canvasElement) {
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(canvasElement.width, canvasElement.height);
    canvasElement.appendChild(renderer.domElement);

    construct.scene.add(construct.light ?? new THREE.AmbientLight(defaultLightColor, defaultLightIntensity));

    return {
      basicControls: construct,
      renderer,
    };
  }
  return undefined;
};
