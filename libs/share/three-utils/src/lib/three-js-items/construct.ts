import * as THREE from 'three';
import { cameraTypeEnum, createCamera } from './camera';
import { createLight, createLightReturn, lightTypeEnum } from './light';

export const defaultLightColor = 0xffffff;
export const defaultLightIntensity = 1;

/**
 * Construct a scene, camera, light, and renderer
 */
export interface constructReturn {
  scene: THREE.Scene;
  camera: THREE.Camera | undefined;
  light: createLightReturn;
}

/**
 * Construct a scene, camera, light, and renderer
 * @param width Width of the renderer
 * @param height Height of the renderer
 * @returns A scene, camera, light, and renderer
 */
export const construct = (width: number, height: number): constructReturn => {
  const scene = new THREE.Scene();
  const camera = createCamera({
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
