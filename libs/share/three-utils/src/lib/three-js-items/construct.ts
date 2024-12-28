import * as THREE from 'three';
import { OrbitControls } from 'three-stdlib';
import { Camera, cameraTypeEnum } from './camera';
import { createLightHelperReturn, Light, lightTypeEnum } from './light';

export const defaultLightColor = 0xffffff;
export const defaultLightIntensity = 1;

/**
 * Construct a scene, camera, light, and renderer
 */
export interface constructReturn {
  scene: THREE.Scene;
  camera: Camera;
  lights: Map<string, Light>;
}

export interface preparedConstructReturn {
  basicControls: constructReturn;
  renderer: THREE.WebGLRenderer;
  controls: OrbitControls | undefined;
  animate: (pfkt: () => void) => void;
  addLight: (key: string, light: Light) => void;
  deleteLight: (key: string) => void;
  switchAllLights: (on: boolean, onHelper: boolean) => void;
  prepareOrbitControls: (orbitConfig: prepareOrbitControls) => void;
  updateCameraWindowSize: (newWidth: number, newHeight: number) => void;
}

export interface prepareOrbitControls {
  enableZoom: boolean;
  enablePan: boolean;
  enableRotate: boolean;
  enabled: boolean;
  minDistance?: number;
  maxDistance?: number;
}

/**
 * Construct a scene, camera, light, and renderer
 * @param width Width of the renderer
 * @param height Height of the renderer
 * @returns A scene, camera, lights, and renderer
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

  const lights = new Map<string, Light>();
  const standardLight = new Light({
    type: lightTypeEnum.Ambient,
    color: 0x7f7e80,
    skyColor: 0x7f7e80,
    groundColor: 0xffffff,
    intensity: 0.2,
    position: [0, 10, 10],
    width: 0.2,
    height: 0.2,
  });
  standardLight.setLightPosition(new THREE.Vector3(0, 2, 2));
  lights.set('standard', standardLight);

  return { scene, camera, lights };
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

  const renderer = new THREE.WebGLRenderer();
  let controls: OrbitControls | undefined;

  renderer.setSize(canvasElement.width, canvasElement.height);
  // renderer.shadowMap.enabled = true;
  // renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  if (construct.camera.camera instanceof THREE.PerspectiveCamera) {
    controls = new OrbitControls(construct.camera.camera, renderer.domElement);
    controls.target.set(0, 0, 0);
    controls.enabled = false;
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.enableRotate = false;
  }
  canvasElement.appendChild(renderer.domElement);

  for (const l of construct.lights.values()) {
    if (l.getLight()) {
      construct.scene.add(l.getLight() as THREE.Light);
    }
  }

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
    light.switch(false, false);
    const helper: createLightHelperReturn = light.getHelper();
    if (helper) construct.scene.add(helper);
    construct.scene.add(light.getLight() ?? new THREE.AmbientLight(defaultLightColor, defaultLightIntensity));
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
   * Updates the dimensions of the camera's viewport and adjusts the renderer size.
   *
   * @param {number} newWidth - The new width of the camera's viewport.
   * @param {number} newHeight - The new height of the camera's viewport.
   * @returns {void}
   */
  const updateCameraWindowSize = (newWidth: number, newHeight: number): void => {
    construct.camera.updateCameraWindowSize(newWidth, newHeight);
    renderer.setSize(newWidth, newHeight);
  };

  return {
    basicControls: construct,
    controls,
    renderer,
    addLight,
    deleteLight,
    animate,
    switchAllLights,
    prepareOrbitControls,
    updateCameraWindowSize,
  };
};
