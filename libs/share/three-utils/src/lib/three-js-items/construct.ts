import * as THREE from 'three';
import { GLTF, OrbitControls } from 'three-stdlib';
import { analyseReturn } from './analyse';
import { Camera, cameraTypeEnum } from './camera';
import { createLightHelperReturn, createLightReturn, Light, lightTypeEnum } from './light';
import { glbLoader } from './loader';
import { handleMouseSupport } from './mouse';
import { interfaceAnalyseResult, zeroPosition } from './share';

/**
 * Construct a scene, camera, light, and renderer
 */
export interface constructReturn {
  scene: THREE.Scene;
  camera: Camera;
  lights: Map<string, Light>;
  content: Map<string, THREE.Group>;
}

/**
 * Interface representing the structure and methods required for constructing and managing a 3D rendering environment.
 */
export interface preparedConstructReturn {
  basicControls: constructReturn;
  renderer: THREE.WebGLRenderer;
  controls: OrbitControls | undefined;
  animate: (pfkt: (srenderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.Camera) => void) => void;
  addLight: (key: string, light: Light) => void;
  deleteLight: (key: string) => void;
  getLight: (key: string) => Light | undefined;
  switchAllLights: (on: boolean, onHelper: boolean) => void;
  prepareOrbitControls: (orbitConfig: prepareOrbitControls) => void;
  updateCameraWindowSize: (newWidth: number, newHeight: number) => void;
  addContent: (key: string, content: THREE.Group) => void;
  getContent: (key: string) => THREE.Group | undefined;
  deleteContent: (key: string) => void;
  addConstructedScene: (key: string, scene: preparedSceneReturn) => void;
  deleteConstructedScene: (key: string) => void;
  getConstructedScene: (key: string) => preparedSceneReturn | undefined;
  switchAllConstructedScenes: (on: boolean) => void;
  resetConstructedScene: () => void;

  addGlb: (name: string, contentBase64: string | undefined, path: string) => void;
}

/**
 * Configuration for OrbitControls
 */
export interface prepareOrbitControls {
  enableZoom: boolean;
  enablePan: boolean;
  enableRotate: boolean;
  enabled: boolean;
  minDistance?: number;
  maxDistance?: number;
}

/**
 * Interface representing the return object of a prepared scene.
 * Provides methods for rendering and managing a 3D scene in a WebGL context.
 */
export interface preparedSceneReturn {
  animate: (renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.Camera) => void;
  updateCameraWindowSize: (newWidth: number, newHeight: number) => void;
  visible: (vis: boolean) => void;
  reCalculateDimensions: (dimension: interfaceAnalyseResult) => void;
  boundingBox: interfaceAnalyseResult | undefined;
}

/**
 * Interface for handling material support operations.
 *
 * Provides methods to set and manage the material used in rendering processes.
 *
 * Methods:
 * - setMaterial: Sets the material to be used.
 */
export interface handleMaterialSupport {
  setMaterial: (_material: THREE.MeshPhysicalMaterial) => void;
}

/**
 * Determines if the given object is of type `handleMaterialSupport`.
 *
 * This function performs a check to verify if the provided object
 * includes the `setMaterial` property, which suggests it matches
 * the expected shape for the `handleMaterialSupport` type.
 *
 * @param obj - The object to be checked.
 * @returns A boolean indicating whether the object is of type `handleMaterialSupport`.
 */
export const ishandleMaterialSupport = (obj: unknown): obj is handleMaterialSupport => {
  if (obj === undefined) {
    return false;
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  return (obj as object).setMaterial !== undefined;
};

/**
 * The `preparedSceneReturnWithMaterial` type represents a combination of both `preparedSceneReturn`
 * and `handleMaterialSupport`. This type is used to define an object that encapsulates the properties
 * and methods involved in preparing a scene and handling material support in a unified way.
 *
 * It merges the functionalities of the `preparedSceneReturn`, which contains scene-related
 * configurations, and `handleMaterialSupport`, which includes material-specific handling and processing.
 */
export type preparedSceneReturnWithMaterial = preparedSceneReturn & handleMaterialSupport;
export type preparedSceneReturnWithMaterialAndAnalysis = preparedSceneReturn & handleMaterialSupport & analyseReturn;
export type preparedSceneReturnWithMaterialAndAnalysisWithMouseSupport = preparedSceneReturn &
  handleMaterialSupport &
  analyseReturn &
  handleMouseSupport;
export type preparedConstructWithMouseSupport = preparedConstructReturn & handleMouseSupport;

/**
 * Construct a scene, camera, light, and renderer
 * @param width Width of the renderer
 * @param height Height of the renderer
 * @returns A scene, camera, lights, and renderer
 */
export const construct = (width: number, height: number): constructReturn => {
  // Create a new scene
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x7f7e80);

  // Create a new camera
  const camera = new Camera({
    type: cameraTypeEnum.PERSPECTIVE,
    fov: undefined,
    height: height,
    width: width,
    far: undefined,
    near: undefined,
  });
  // Create a new light
  const lights = new Map<string, Light>();
  const standardLight = new Light({
    type: lightTypeEnum.Ambient,
    color: 0x7f7e80,
    skyColor: 0x7f7e80,
    groundColor: 0x0f0f0f,
    intensity: 1,
    position: [0, 0, 0],
    width: 0.2,
    height: 0.2,
  });

  standardLight.setLightPosition(new THREE.Vector3(zeroPosition.x, zeroPosition.y, zeroPosition.z));
  lights.set('standard', standardLight);

  // Create a new content
  const content = new Map<string, THREE.Group>();
  return { scene, camera, lights, content };
};

/**
 * Prepares the necessary components for rendering a 3D scene, including the setup
 * of a WebGL renderer, cameras, lights, and controls.
 *
 * @param {constructReturn} construct - An object containing the 3D scene, camera, lights, and other configurations.
 * @param {HTMLCanvasElement | undefined} canvasElement - The HTML canvas element where the 3D scene will be rendered.
 * @returns {preparedConstructReturn | undefined} Returns an object containing the renderer, controls, and utility methods for managing the scene, or undefined if no canvas element is provided.
 */
export const prepareConstruct = (
  construct: constructReturn,
  canvasElement: HTMLCanvasElement | undefined,
): preparedConstructReturn | undefined => {
  if (!canvasElement) {
    return undefined;
  }

  const constructedScenes: Map<string, preparedSceneReturn> = new Map<string, preparedSceneReturn>();

  const renderer = new THREE.WebGLRenderer();
  let controls: OrbitControls | undefined;
  renderer.setSize(canvasElement.width, canvasElement.height);

  // renderer.shadowMap.enabled = true;
  // renderer.shadowMap.type = THREE.PCFShadowMap;

  // Add OrbitControls if the camera is a PerspectiveCamera
  if (construct.camera.camera instanceof THREE.PerspectiveCamera) {
    controls = new OrbitControls(construct.camera.camera, renderer.domElement);
    controls.target.set(0, 0, 0);
    controls.enabled = false;
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.enableRotate = false;

    controls.saveState();
  }
  // Append the renderer to the canvas element
  canvasElement.appendChild(renderer.domElement);
  // Add the standard light to the scene
  for (const l of construct.lights.values()) {
    const light = l.getLight();
    if (light) {
      construct.scene.add(light); //  as THREE.Light);
    }
  }

  /**
   * Resets the constructed scene to its initial state.
   * This function performs the following actions:
   * - Logs a message indicating that the reset process has been triggered.
   * - Resets the controls, if they are initialized.
   *
   * It is primarily used to reinitialize or clear the scene configuration
   * in environments where interactive controls or parameters might have been modified.
   *
   * @returns {void} This function does not return any value.
   */
  const resetConstructedScene = (): void => {
    console.log('resetConstructedScene -- ');
    controls?.reset();
  };

  resetConstructedScene();

  /**
   * Adds a constructed scene to the collection of constructed scenes.
   *
   * @param {string} key - A unique identifier for the constructed scene.
   * @param {preparedSceneReturn} scene - The prepared scene object to be added.
   * @returns {void}
   */
  const addConstructedScene = (key: string, scene: preparedSceneReturn): void => {
    constructedScenes.set(key, scene);
  };

  /**
   * Retrieves a pre-constructed scene from the constructedScenes map using the provided key.
   *
   * @param {string} key - The unique identifier used to retrieve the corresponding constructed scene.
   * @returns {preparedSceneReturn | undefined} The constructed scene associated with the given key, or undefined if the key does not exist in the map.
   */
  const getConstructedScene = (key: string): preparedSceneReturn | undefined => {
    return constructedScenes.get(key);
  };

  /**
   * Deletes a constructed scene from the collection of constructed scenes.
   *
   * @param {string} key - The unique identifier for the constructed scene to be removed.
   * @returns {void}
   */
  const deleteConstructedScene = (key: string): void => {
    constructedScenes.delete(key);
  };

  /**
   * Toggles the visibility of all constructed scenes.
   *
   * @param {boolean} on - Determines the visibility state for all constructed scenes.
   *                        Pass `true` to make all constructed scenes visible,
   *                        or `false` to hide them.
   */
  const switchAllConstructedScenes = (on: boolean): void => {
    for (const l of constructedScenes.values()) {
      l.visible(on);
    }
  };

  /**
   * A function that continuously animates a given callback function (`pfkt`)
   * and renders a 3D scene using a camera and renderer if available.
   *
   * The animation loop is achieved using `requestAnimationFrame` to ensure smooth rendering
   * synchronized with the display refresh rate. The provided callback function is executed
   * within the loop, allowing custom logic to be performed during each frame.
   *
   * The rendering process uses a `construct` object containing a `scene` and a `camera` object.
   * If the camera is defined, the renderer will render the scene from the camera's perspective.
   *
   * @param {Function} pfkt - A callback function that is executed during each frame of the animation.
   * @returns {void} This function does not return any value.
   */
  const animate = (pfkt: (renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.Camera) => void): void => {
    const anim = (): void => {
      // Request the next frame of the animation loop
      requestAnimationFrame(anim);

      if (construct.camera.camera) {
        renderer.autoClear = false; // Stoppt das automatische Leeren des Canvas
        renderer.clear();

        // Render the scene using the camera
        renderer.render(construct.scene, construct.camera.camera);
        renderer.clearDepth();

        for (const l of constructedScenes.values()) {
          // Update the controls if available
          l.animate(renderer, construct.scene, construct.camera.camera);
          // renderer.clearDepth();
        }
        // Call the provided callback function with the renderer, scene, and camera
        pfkt(renderer, construct.scene, construct.camera.camera);
      }
    };
    anim();
  };

  /**
   * Configures and updates the OrbitControls settings based on the provided configuration.
   *
   * @param {Object} orbitConfig - The configuration object for OrbitControls.
   * @param {boolean} orbitConfig.enableZoom - Specifies whether zooming is enabled.
   * @param {boolean} orbitConfig.enablePan - Specifies whether panning is enabled.
   * @param {boolean} orbitConfig.enableRotate - Specifies whether rotation is enabled.
   * @param {boolean} orbitConfig.enabled - Specifies whether the OrbitControls are active.
   * @returns {void}
   */
  const prepareOrbitControls = (orbitConfig: prepareOrbitControls): void => {
    if (controls) {
      controls.enableZoom = orbitConfig.enableZoom;
      controls.enablePan = orbitConfig.enablePan;
      controls.enableRotate = orbitConfig.enableRotate;
      controls.enabled = orbitConfig.enabled;
      controls.minDistance = orbitConfig.minDistance ?? 0;
      controls.maxDistance = orbitConfig.maxDistance ?? Infinity;
      controls.saveState();
    }
  };

  /**
   * Switches all lights in the construct on or off.
   *
   * @param {boolean} on - A boolean value indicating whether the lights should be switched on (`true`) or off (`false`).
   * @param onHelper - A boolean value indicating whether the helper lights should be switched on (`true`) or off (`false`).
   * @returns {void} This function does not return any value.
   */
  const switchAllLights = (on: boolean, onHelper: boolean): void => {
    for (const l of construct.lights.values()) {
      l.switch(on, onHelper);
    }
  };

  /**
   * Adds a light source to the construct's scene and initializes its state.
   *
   * @param {string} key - A unique identifier for the light to be added.
   * @param {Light} light - The Light object to be added, which defines the characteristics of the light source.
   *
   * This function performs the following:
   * 1. Associates the given light with the specified key in the construct's lights map.
   * 2. Switches the light off with the initial `switch` method.
   * 3. Adds the light source to the construct's scene using its `getLight` method.
   *    If `getLight` returns `null`, a default ambient light is added with a predefined color and intensity.
   */
  const addLight = (key: string, light: Light): void => {
    construct.lights.set(key, light);
    // light.switch(false, false);
    const helper: createLightHelperReturn = light.getHelper();
    const lightObj: createLightReturn = light.getLight();

    // if (helper) construct.scene.add(helper);
    if (lightObj) {
      construct.scene.add(
        lightObj, // light.getLight()  // ?? new THREE.AmbientLight(defaultLightColor as number, defaultLightIntensity as number),
      );
    }
    console.log('addLight', light, helper, construct.scene);
  };

  /**
   * Deletes a light object from the scene and its associated collection.
   *
   * This function removes a light from the `construct.lights` map using the provided key.
   * If the light exists and has a valid THREE.Light instance, it is also removed from the
   * `construct.scene`. The function ensures that the light is properly removed from both
   * the data structure and the 3D scene to maintain consistency.
   *
   * @param {string} key - The unique identifier for the light object to be removed.
   * @returns {void}
   */
  const deleteLight = (key: string): void => {
    const light = construct.lights.get(key);
    if (light?.getLight()) {
      construct.lights.delete(key);
      construct.scene.remove(light.getLight() as THREE.Light);
    }
  };

  /**
   * Retrieves a light object from the construct based on the specified key.
   *
   * @param {string} key - The unique identifier for the light object to retrieve.
   * @returns {Light | undefined} The Light object associated with the specified key, or `undefined` if not found.
   */
  const getLight = (key: string): Light | undefined => {
    return construct.lights.get(key);
  };

  /**
   * Adds a content group to the construct's scene and initializes its state.
   *
   * @param {string} key - A unique identifier for the content group to be added.
   * @param {THREE.Group} content - The content group to be added to the scene.
   * @returns {void} This function does not return any value.
   */
  const addContent = (key: string, content: THREE.Group): void => {
    console.log('addContent', key, content);
    construct.content.set(key, content);
    construct.scene.add(content);
  };

  /**
   * Retrieves a content group from the construct based on the specified key.
   *
   * @param {string} key - The unique identifier for the content group to retrieve.
   * @returns {THREE.Group | undefined} The content group associated with the specified key, or `undefined` if not found
   */
  const getContent = (key: string): THREE.Group | undefined => {
    return construct.content.get(key);
  };

  /**
   * Deletes a content group from the scene and its associated collection.
   *
   * This function removes a content group from the `construct.content` map using the provided key.
   * If the content group exists and has a valid THREE.Group instance, it is also removed from the
   * `construct.scene`. The function ensures that the content group is properly removed from both
   * the data structure and the 3D scene to maintain consistency.
   *
   * @param {string} key - The unique identifier for the content group to be removed.
   * @returns {void}
   */
  const deleteContent = (key: string): void => {
    const content = construct.content.get(key);
    if (content) {
      construct.content.delete(key);
      construct.scene.remove(content);
    }
  };

  /**
   * Updates the dimensions of the camera's viewport and adjusts the renderer size.
   *
   * @param {number} newWidth - The new width of the camera's viewport.
   * @param {number} newHeight - The new height of the camera's viewport.
   * @returns {void}
   */
  const updateCameraWindowSize = (newWidth: number, newHeight: number): void => {
    construct.camera.updateCameraWindowSize(newWidth, newHeight);
    for (const l of constructedScenes.values()) {
      l.updateCameraWindowSize(newWidth, newHeight);
    }
    renderer.setSize(newWidth, newHeight);
  };

  /**
   * Asynchronously loads a GLB content encoded as base64 string and adds it to the scene.
   *
   * @param {string} name - The name of the content to be added.
   * @param {string} contentBase64 - The base64-encoded GLB content to be loaded.
   * @param {string} path - The path to the GLB file to be loaded.
   */
  const addGlb = (name: string, contentBase64: string | undefined, path: string): void => {
    void glbLoader(contentBase64, path).then((gltf: GLTF | undefined) => {
      if (gltf?.scene) {
        const contentGroup = new THREE.Group();
        gltf.scene.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            const m = child as THREE.Mesh;
            m.material = new THREE.MeshStandardMaterial({
              color: 0x01a1a1,
              roughness: 5,
              metalness: 0.2,
            });
          }
        });

        contentGroup.add(gltf.scene);
        contentGroup.name = name;
        addContent(name, contentGroup);

        // Add a view sphere to the content
        const viewSphere = createViewSphere(contentGroup);
        viewSphere.visible = false;
        addContent(`${name}-view-sphere`, viewSphere);
      }
    });
  };

  /**
   * Creates a view sphere based on the bounding box of the content group.
   *
   * @param {THREE.Group} content - The content group for which to create the view sphere.
   * @returns {THREE.Group} The view sphere group that encapsulates the content.
   */
  const createViewSphere = (content: THREE.Group): THREE.Group => {
    const boundingBox = new THREE.Box3().setFromObject(content);
    const edgeLength = Math.sqrt(
      Math.pow(boundingBox.max.x - boundingBox.min.x, 2) +
        Math.pow(boundingBox.max.y - boundingBox.min.y, 2) +
        Math.pow(boundingBox.max.z - boundingBox.min.z, 2),
    );
    const geometry = new THREE.BoxGeometry(edgeLength, edgeLength, edgeLength);
    const edges = new THREE.EdgesGeometry(geometry);
    const material = new THREE.LineBasicMaterial({ color: 0xffff00 });
    const lines = new THREE.LineSegments(edges, material);
    return new THREE.Group().add(lines);
  };

  // Return the prepared construct
  return {
    basicControls: construct,
    controls,
    renderer,
    addLight,
    deleteLight,
    getLight,
    addContent,
    deleteContent,
    getContent,
    animate,
    switchAllLights,
    prepareOrbitControls,
    updateCameraWindowSize,
    addGlb,
    addConstructedScene,
    getConstructedScene,
    deleteConstructedScene,
    resetConstructedScene,
    switchAllConstructedScenes,
  };
};

/**
 * Constructs a prepared scene object containing methods for managing and analyzing a 3D scene.
 *
 * @param {THREE.WebGLRenderer} _renderer - The WebGL renderer responsible for rendering the 3D scene.
 * @returns {preparedSceneReturn} An object containing various utility methods for interacting with the scene,
 * including animation, visibility control, dimension updates, scene analysis, and recalculations.
 */
const _constructItem = (_renderer: THREE.WebGLRenderer): preparedSceneReturn => {
  /**
   * Updates the dimensions of the camera's viewport and adjusts the renderer size.
   *
   * @param {number} _newWidth - The new width of the camera's viewport.
   * @param {number} _newHeight - The new height of the camera's viewport.
   * @returns {void}
   */
  const updateCameraWindowSize = (_newWidth: number, _newHeight: number): void => {
    console.log('updateCameraWindowSize -- ');
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
    // console.log('animate -- ');
  };

  /**
   * Sets the visibility of the rotation cube.
   *
   * @param {boolean} _vis - A boolean value indicating whether the cube should be visible (`true`) or hidden (`false`).
   * @returns {void} This function does not return any value.
   */
  const visible = (_vis: boolean): void => {
    console.log('visible -- ');
  };

  /**
   * Updates and recalculates dimensions based on the provided input.
   *
   * This function takes an object of type `interfaceAnalyseResult` and
   * performs a console log operation, indicating that the dimensions
   * recalculation process has been triggered.
   *
   * @param {interfaceAnalyseResult} dimension - The input object containing
   * the details required for recalculating dimensions.
   * @returns {void} Does not return any value.
   */
  const reCalculateDimensions = (dimension: interfaceAnalyseResult): void => {
    console.log('reCalculateDimensions -- ', dimension);
  };

  console.log('constructItem -- ');
  return {
    animate,
    visible,
    updateCameraWindowSize,
    reCalculateDimensions,
    boundingBox: undefined,
  };
};
