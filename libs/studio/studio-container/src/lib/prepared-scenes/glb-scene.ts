import {
  calculateBoundingBox,
  glbLoader,
  interfaceAnalyseResult,
  preparedSceneReturn,
  traverseGroup,
} from '@three-js-studio/three-utils';
import * as THREE from 'three';
import { GLTF } from 'three-stdlib';

export const glbScene = async (path: string): Promise<preparedSceneReturn> => {
  const glbContainer: THREE.Group = new THREE.Group();
  const name = path;
  let analyseResult: interfaceAnalyseResult | undefined = undefined;

  const glb = async (): Promise<void> => {
    await glbLoader(undefined, path).then((gltf: GLTF | undefined) => {
      if (gltf?.scene) {
        glbContainer.add(gltf.scene);
        glbContainer.name = name;
      }
    });
  };

  /**
   * Updates the dimensions of the camera's viewport and adjusts the renderer size.
   *
   * @param {number} _newWidth - nothing to do.
   * @param {number} _newHeight - nothing to do.
   * @returns {void}
   */
  const updateCameraWindowSize = (_newWidth: number, _newHeight: number): void => {
    //
  };

  /**
   * A function that manages the rendering process for a 3D scene.
   *
   * @param {THREE.WebGLRenderer} _renderer - The WebGL renderer responsible for rendering the scene.
   * @param {THREE.Scene} scene - The main scene to be rendered (unused in this function).
   * @param {THREE.Camera} _camera - The main camera for the scene (unused in this function).
   * @returns {void} This function does not return a value.
   */
  const animate = (_renderer: THREE.WebGLRenderer, scene: THREE.Scene, _camera: THREE.Camera): void => {
    addContent(scene);
  };

  /**
   * Adds a cube to the given THREE.Scene if it is not already present.
   *
   * @param {THREE.Scene} scene - The scene to which the cube will be added.
   * @returns {void}
   */
  const addContent = (scene: THREE.Scene): void => {
    let found = false;
    scene.traverse((child) => {
      if (child.name === glbContainer.name) {
        found = true;
        return;
      }
    });
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!found) {
      scene.add(glbContainer);
    }
  };

  const visible = (vis: boolean): void => {
    glbContainer.visible = vis;
  };

  /**
   * Sets the material for an object.
   *
   * @param {THREE.Material} material - The material to apply.
   * @returns {void}
   */
  const setMaterial = (material: THREE.Material): void => {
    traverseGroup(glbContainer, (child) => {
      if (child instanceof THREE.Mesh) {
        const m = child as THREE.Mesh;
        m.material = material.clone();
      }
    });
  };

  /**
   * Analyzes the current scene or context of the application.
   * This function executes the necessary logic to evaluate and log details about the scene.
   *
   * The function does not return any value and operates entirely through side effects,
   * such as logging information to the console.
   */
  const analyseScene = (): void => {
    console.log('analyseScene -- ');
    analyseResult = calculateBoundingBox(glbContainer);
    console.log('analyseScene -- boundingBox', analyseResult);
  };

  /**
   * Recalculates the given dimensions based on the provided analysis result.
   * This function processes and logs the recalculated dimensions for further use.
   *
   * @param {interfaceAnalyseResult} dimensions - The analysis result containing the dimensions to be recalculated.
   * @returns {void} This function does not return a value.
   */
  const reCalculateDimensions = (dimensions: interfaceAnalyseResult): void => {
    console.log('reCalculateDimensions -- ', dimensions);
  };

  await glb();
  analyseScene();

  console.log('glbContainer-Scene -- ', glbContainer);

  return {
    animate,
    visible,
    updateCameraWindowSize,
    setMaterial,
    analyseScene,
    analyseResult: analyseResult,
    reCalculateDimensions,
  };
};
