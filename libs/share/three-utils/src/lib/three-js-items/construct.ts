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
  animate: (pfkt: () => void) => void;
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
    type: lightTypeEnum.Point,
    color: defaultLightColor,
    intensity: defaultLightIntensity,
    position: [-1.5, 1.5, 1.5],
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
    return {
      basicControls: construct,
      renderer,
      animate,
    };
  }
  return undefined;
};
