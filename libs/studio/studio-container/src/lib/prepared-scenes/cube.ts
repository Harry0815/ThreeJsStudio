import * as THREE from 'three';
import { GLTF } from 'three-stdlib';
import { glbLoader, preparedSceneReturn } from 'three-utils';

/**
 * Constructs and prepares a cube with a 3D scene, camera, lighting, and interaction methods.
 *
 * This function creates a 3D model of a cube which can be rendered in a specific scene.
 * It implements necessary utilities, including lighting, camera setup, and the ability to animate,
 * update the viewport, and toggle visibility of the cube.
 *
 * @param material - The material to apply to the cube.
 * @param scene
 * @returns {preparedSceneReturn} An object containing methods for animating the cube,
 * changing its visibility, and updating the camera window size:
 * - `animate`: A method to synchronize the camera's orientation with the cube.
 * - `visible`: A method to set the visibility of the cube.
 * - `updateCameraWindowSize`: A method to adjust the camera's dimensions based on given viewport parameters.
 */
export const cube = (material: THREE.MeshStandardMaterial, scene: THREE.Scene | undefined): preparedSceneReturn => {
  const cube: THREE.Group = new THREE.Group();
  const cubeScene: THREE.Scene = scene?.clone() ?? new THREE.Scene();

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
  const glb = (): void => {
    void glbLoader(undefined, 'cube/viewCube.glb').then((gltf: GLTF | undefined) => {
      if (gltf?.scene) {
        gltf.scene.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            const m = child as THREE.Mesh;
            m.material = new THREE.MeshStandardMaterial({
              color: material.color,
              roughness: material.roughness,
              metalness: material.metalness,
            });
          }
        });
        cube.add(gltf.scene);
        cubeScene.add(cube);
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
   * @param {THREE.WebGLRenderer} renderer - The WebGL renderer responsible for rendering the scene.
   * @param {THREE.Scene} _scene - The main scene to be rendered (unused in this function).
   * @param {THREE.Camera} camera - The main camera for the scene (unused in this function).
   * @returns {void} This function does not return a value.
   */
  const animate = (renderer: THREE.WebGLRenderer, _scene: THREE.Scene, camera: THREE.Camera): void => {
    renderer.render(cubeScene, camera);
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
  const setMaterial = (material: THREE.MeshStandardMaterial): void => {
    console.log('setMaterial -- ', cube);
    cube.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const m = child as THREE.Mesh;
        m.material = new THREE.MeshStandardMaterial({
          color: material.color,
          roughness: material.roughness,
          metalness: material.metalness,
        });
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
  const anylyseScene = (): void => {
    console.log('anylyseScene -- ');
  };

  glb();

  console.log('cube-Scene -- ', cube, cubeScene);
  return {
    animate,
    visible,
    updateCameraWindowSize,
    setMaterial,
    anylyseScene,
  };
};
