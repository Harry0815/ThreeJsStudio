import {
  analyse,
  calculateBoundingBox,
  effects,
  glbLoader,
  handleEffectsSupport,
  handleMouseSupport,
  interfaceAnalyseResult,
  mouseSupport,
  preparedConstructReturn,
  preparedSceneReturnWithMaterialAndAnalysisWithMouseSupport,
  traverseGroup,
} from '@three-js-studio/three-utils';
import * as THREE from 'three';
import { GLTF } from 'three-stdlib';

/**
 * Asynchronously loads and prepares a 3D scene from a GLB (Binary glTF) file.
 *
 * This function takes the path to a GLB file, optionally applies a material to the loaded meshes,
 * and sets up various functionalities to be used with the loaded scene. It returns an object
 * containing methods for interacting with the scene, such as animation, visibility control,
 * material setting, and scene analysis.
 *
 * The function internally loads the GLB file, builds the scene with the provided material
 * (if available), and processes the scene's bounding box for further interaction.
 *
 * @param {string} path - The file path to the GLB file to be loaded and processed.
 * @param {THREE.MeshPhysicalMaterial | undefined} [material=undefined] - An optional custom material
 *        to override the default materials in the loaded scene.
 * @param {preparedConstructReturn} construct - The prepared construct object containing the renderer,
 * @returns {Promise<preparedSceneReturn>} A promise that resolves to an object with utility functions
 *          and properties for managing and interacting with the loaded 3D scene.
 */
export const glbScene = async (
  path: string,
  material: THREE.MeshPhysicalMaterial | undefined = undefined,
  construct: preparedConstructReturn | undefined = undefined,
): Promise<preparedSceneReturnWithMaterialAndAnalysisWithMouseSupport> => {
  const glbContainer: THREE.Group = new THREE.Group();
  const name = path;
  let analyseBoundingBoxResult: interfaceAnalyseResult | undefined = undefined;
  let actualMaterial: THREE.MeshPhysicalMaterial | undefined = undefined;
  const mouseHandler: handleMouseSupport = mouseSupport(construct);
  const effectsHandler: handleEffectsSupport = effects();

  /**
   * Asynchronously loads a GLB (Binary glTF) file and adds it to a designated container.
   *
   * The function utilizes a loader to fetch and decode the GLB file. Once loaded,
   * the corresponding scene is appended to a container object, and the container's
   * name is set to a pre-defined value.
   *
   * The function does not return any value but relies on side effects to modify
   * the `glbContainer` object with the loaded scene. It ensures that the loader
   * properly handles undefined values or missing scenes within the GLB file.
   *
   * @async
   * @function
   * @returns {Promise<void>} A promise that resolves when the GLB file is loaded and processed.
   */
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
   * @param {THREE.Scene} _scene - The main scene to be rendered (unused in this function).
   * @param {THREE.Camera} _camera - The main camera for the scene (unused in this function).
   * @returns {void} This function does not return a value.
   */
  const animate = (_renderer: THREE.WebGLRenderer, _scene: THREE.Scene, _camera: THREE.Camera): void => {
    // nothing to do
  };

  /**
   * Updates the visibility state of the global container.
   *
   * @param {boolean} vis - A boolean value determining whether the container should be visible (true) or hidden (false).
   */
  const visible = (vis: boolean): void => {
    glbContainer.visible = vis;
    if (!vis) {
      if (construct?.contentSupport.contentGroup) construct.contentSupport.contentGroup.remove(glbContainer);
    } else {
      if (construct?.contentSupport.contentGroup) construct.contentSupport.contentGroup.add(glbContainer);
    }
  };

  /**
   * Sets the material for an object.
   *
   * @param {THREE.Material} material - The material to apply.
   * @returns {void}
   */
  const setMaterial = (material: THREE.MeshPhysicalMaterial): void => {
    if (!actualMaterial) {
      actualMaterial = material.clone();
      traverseGroup(glbContainer, (child) => {
        if ((child as unknown) instanceof THREE.Mesh) {
          const m = child as THREE.Mesh;
          if (actualMaterial) {
            m.material = actualMaterial;
          }
        }
      });
      return;
    }

    effectsHandler.tweenChangeMaterial(actualMaterial, material, 1000);
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
    analyseBoundingBoxResult = calculateBoundingBox(glbContainer);
    console.log('analyseScene -- boundingBox', analyseBoundingBoxResult);
  };

  /**
   * Recalculates and processes the provided dimension data.
   *
   * This function accepts a `dimension` parameter, which contains the
   * dimension analysis result, and performs necessary computations
   * or modifications based on the provided data.
   *
   * The function logs the operation to the console for debugging purposes.
   *
   * @param {interfaceAnalyseResult} dimension - The dimension analysis
   * result to be recalculated or processed.
   * @returns {void}
   */
  const reCalculateDimensions = (dimension: interfaceAnalyseResult): void => {
    console.log('reCalculateDimensions -- ', dimension);
  };

  await glb();
  if (material) {
    setMaterial(material);
  }
  analyseScene();
  const analyseResults = analyse(glbContainer);

  console.log('glbContainer-Scene -- ', glbContainer);

  return {
    contentSupport: {
      contentGroup: glbContainer,
      handleEffectsSupport: effectsHandler,
    },
    animate,
    visible,
    updateCameraWindowSize,
    reCalculateDimensions,
    setMaterial,
    boundingBox: analyseBoundingBoxResult,
    groups: analyseResults.groups,
    materials: analyseResults.materials,
    meshes: analyseResults.meshes,
    container: {
      onClick: mouseHandler.container.onClick,
      onMouseMove: mouseHandler.container.onMouseMove,
    },
  };
};
