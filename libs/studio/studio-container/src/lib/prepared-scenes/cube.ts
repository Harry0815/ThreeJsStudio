import * as THREE from 'three';
import { GLTF } from 'three-stdlib';
import {
  calculateBoundingBox,
  glbLoader,
  interfaceAnalyseResult,
  preparedSceneReturn,
  traverseGroup,
} from 'three-utils';

/**
 * Constructs and prepares a cube with a 3D scene, camera, lighting, and interaction methods.
 *
 * This function creates a 3D model of a cube which can be rendered in a specific scene.
 * It implements necessary utilities, including lighting, camera setup, and the ability to animate,
 * update the viewport, and toggle visibility of the cube.
 *
 * @returns {preparedSceneReturn} An object containing methods for animating the cube,
 * changing its visibility, and updating the camera window size:
 * - `animate`: A method to synchronize the camera's orientation with the cube.
 * - `visible`: A method to set the visibility of the cube.
 * - `updateCameraWindowSize`: A method to adjust the camera's dimensions based on given viewport parameters.
 */
export const cube = async (): Promise<preparedSceneReturn> => {
  const cube: THREE.Group = new THREE.Group();
  const name = 'cube_scene';
  let analyseResult: interfaceAnalyseResult | undefined = undefined;

  /**
   * A function responsible for loading and attaching a GLB (GL Transmission Format Binary) file to a predefined 3D scene setup.
   *
   * The function utilizes the `glbLoader` utility to asynchronously load a GLB file. Upon successful loading,
   * the resulting scene from the GLB file is extracted and added to a hierarchy of 3D objects consisting of `cube`,
   * `groupCube`, and `cubeScene`. This ensures that the loaded 3D model integrates properly into the larger
   * 3D environment represented by `cubeScene`.
   *
   * It is important to ensure that the related dependencies, such as `glbLoader`, `cube`, `groupCube`,
   * and `cubeScene`, are defined and initialized before calling this function.
   *
   * Note that this function does not return any value.
   */
  const glb = async (): Promise<void> => {
    await glbLoader(undefined, 'lotus.glb').then((gltf: GLTF | undefined) => {
      if (gltf?.scene) {
        cube.add(gltf.scene);
        cube.name = name;

        // setMaterial(new THREE.MeshStandardMaterial({ color: 0x00ff00, roughness: 0.5, metalness: 0.5 }));
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
      if (child.name === cube.name) {
        found = true;
        return;
      }
    });
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!found) {
      scene.add(cube);
    }
  };

  /**
   * Sets the visibility of the rotation cube.
   *
   * @param {boolean} vis - A boolean value indicating whether the cube should be visible (`true`) or hidden (`false`).
   * @returns {void} This function does not return any value.
   */
  const visible = (vis: boolean): void => {
    cube.visible = vis;
  };

  /**
   * Sets the material for an object.
   *
   * @param {THREE.Material} material - The material to apply.
   * @returns {void}
   */
  const setMaterial = (material: THREE.Material): void => {
    traverseGroup(cube, (child) => {
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
    analyseResult = calculateBoundingBox(cube);
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

  console.log('cube-Scene -- ', cube);

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
