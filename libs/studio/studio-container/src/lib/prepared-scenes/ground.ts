import { effects, interfaceAnalyseResult, preparedSceneReturn } from '@three-js-studio/three-utils';
import * as THREE from 'three';

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

  plane.rotation.x = -Math.PI / 2;
  plane.position.z = 0; //-0.55;

  const createRectangularGrid = (
    width: number,
    height: number,
    divisionsX: number,
    divisionsZ: number,
  ): THREE.Group => {
    const gridGroup = new THREE.Group();

    // Material für die Gitterlinien
    const material = new THREE.LineBasicMaterial({ color: 0 });

    for (let i = 0; i <= divisionsZ; i++) {
      const z = (i / divisionsZ) * height - height / 2;
      const geometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-width / 2, 0, z),
        new THREE.Vector3(width / 2, 0, z),
      ]);
      const line = new THREE.Line(geometry, material);
      gridGroup.add(line);
    }

    for (let i = 0; i <= divisionsX; i++) {
      const x = (i / divisionsX) * width - width / 2;
      const geometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(x, 0, -height / 2),
        new THREE.Vector3(x, 0, height / 2),
      ]);
      const line = new THREE.Line(geometry, material);
      gridGroup.add(line);
    }

    return gridGroup;
  };
  let gridHelper = createRectangularGrid(1, 1, 10, 10);

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
    gridHelper.visible = vis;
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
    const gridSizeX = Math.ceil(dimensions.boundingBox.max.x - dimensions.boundingBox.min.x) + 0.5;
    const gridSizeZ = Math.ceil(dimensions.boundingBox.max.z - dimensions.boundingBox.min.z) + 0.5;
    console.log('reCalculateDimensions -- ', dimensions);

    gridHelper = createRectangularGrid(gridSizeX, gridSizeZ, gridSizeX * 10, gridSizeZ * 10);
    gridHelper.position.y = dimensions.boundingBox.min.y * 1.2;
    scene.add(gridHelper);
  };

  analyseScene();
  console.log('ground-Scene -- ');

  return {
    animate,
    visible,
    updateCameraWindowSize,
    reCalculateDimensions,
    boundingBox: undefined,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    handleEffectsSupport: effects(),
  };
};
