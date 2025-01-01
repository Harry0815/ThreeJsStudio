import * as THREE from 'three';
import { interfaceAnalyseResult, preparedSceneReturn } from 'three-utils';

/**
 * Initializes and configures a ground plane for a Three.js scene.
 * This function creates a plane mesh object with specific geometry and material, positions the plane,
 * and adds it to the specified Three.js scene. Additionally, it provides utility functions for
 * interacting with the ground plane, such as changing its visibility, setting its material, and analyzing
 * the scene context.
 *
 * @param {THREE.Scene} scene - The Three.js scene to which the ground plane will be added.
 * @returns {preparedSceneReturn} An object containing utility methods for interacting with
 * the ground plane and the scene, including:
 *  - `animate`: A function for managing the rendering loop.
 *  - `visible`: A function for toggling the visibility of the ground plane.
 *  - `updateCameraWindowSize`: A function for updating camera window dimensions.
 *  - `setMaterial`: A function for changing the material of the ground plane.
 *  - `analyseScene`: A function for analyzing and logging details of the current scene.
 *  - `analyseResult`: An object storing results about the analysis of the scene.
 */
export const ground = (scene: THREE.Scene): preparedSceneReturn => {
  const planeGeometry = new THREE.PlaneGeometry(1, 1);
  const planeMaterial = new THREE.MeshStandardMaterial({ color: 0x808088, side: THREE.DoubleSide });
  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  let gridHelper = new THREE.GridHelper(1, 10);

  plane.rotation.x = -Math.PI / 2;
  plane.position.z = 0; //-0.55;
  // gridHelper.rotation.x = -Math.PI / 2;
  // gridHelper.position.z = 0; //-0.55;

  const analyseResult = {
    boundingLength: 0,
    boundingBox: new THREE.Box3(),
  };

  /**
   * Updates the camera window size to the specified width and height.
   *
   * @param {number} newWidth - The new width for the camera window.
   * @param {number} newHeight - The new height for the camera window.
   * @returns {void}
   */
  const updateCameraWindowSize = (newWidth: number, newHeight: number): void => {
    console.log('updateCameraWindowSize -- ', newWidth, newHeight);
  };

  /**
   * A function that manages the rendering process for a 3D scene.
   *
   * @param {THREE.WebGLRenderer} _renderer - The WebGL renderer responsible for rendering the scene.
   * @param {THREE.Scene} _scene - The main scene to be rendered (unused in this function).
   * @param {THREE.Camera} _camera - The main camera for the scene (unused in this function).
   * @returns {void} This function does not return a value.
   */
  const animate = (_renderer: THREE.WebGLRenderer, _scene: THREE.Scene, _camera: THREE.Camera): void => {
    // nothing to do
  };

  /**
   * Updates the visibility of the plane object.
   *
   * @param {boolean} vis - A boolean value indicating the desired visibility state.
   * If true, the plane becomes visible; if false, the plane becomes hidden.
   * @returns {void}
   */
  const visible = (vis: boolean): void => {
    plane.visible = vis;
  };

  /**
   * Sets the material for an object.
   *
   * @param {THREE.Material} _material - The material to apply.
   * @returns {void}
   */
  const setMaterial = (_material: THREE.Material): void => {
    console.log('setMaterial -- ');
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
  };

  /**
   * Recalculates the given dimensions based on the provided analysis result.
   * This function processes and logs the recalculated dimensions for further use.
   *
   * @param {interfaceAnalyseResult} dimensions - The analysis result containing the dimensions to be recalculated.
   * @returns {void} This function does not return a value.
   */
  const reCalculateDimensions = (dimensions: interfaceAnalyseResult): void => {
    scene.remove(gridHelper);
    const gridSize = Math.ceil(
      Math.max(
        dimensions.boundingBox.max.x - dimensions.boundingBox.min.x,
        dimensions.boundingBox.max.z - dimensions.boundingBox.min.z,
      ),
    );
    console.log('reCalculateDimensions -- ', dimensions);
    gridHelper = new THREE.GridHelper(gridSize, gridSize * 10);
    gridHelper.position.y = dimensions.boundingBox.min.y * 1.05;
    scene.add(gridHelper);
  };

  const roundToNext10 = (num: number): number => {
    return Math.ceil(num);
  };

  analyseScene();
  console.log('ground-Scene -- ');

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
