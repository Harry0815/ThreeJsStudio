import * as THREE from 'three';
import { GLTF, OrbitControls } from 'three-stdlib';
import { Camera, cameraTypeEnum } from './camera';
import { createLightHelperReturn, Light, lightTypeEnum } from './light';
import { glbLoader } from './loader';
import { createTextLabel } from './text';

export const defaultLightColor = 0xffffff;
export const defaultLightIntensity = 1;
const red = 0xff0000;
const green = 0x00ff00;
const blue = 0x0000ff;
const zeroPosition = new THREE.Vector3(0, 0, 0);

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

  addGlb: (name: string, contentBase64: string | undefined, path: string) => void;
}

export interface preparedSceneReturn {
  animate: (renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.Camera) => void;
  updateCameraWindowSize: (newWidth: number, newHeight: number) => void;
  visible: (vis: boolean) => void;
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
 * Construct a scene, camera, light, and renderer
 * @param width Width of the renderer
 * @param height Height of the renderer
 * @returns A scene, camera, lights, and renderer
 */
export const construct = (width: number, height: number): constructReturn => {
  // Create a new scene
  const scene = new THREE.Scene();
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
    groundColor: 0xffffff,
    intensity: 0.2,
    position: [0, 0, 0],
    width: 0.2,
    height: 0.2,
  });
  standardLight.setLightPosition(zeroPosition.clone());
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

  const renderer = new THREE.WebGLRenderer();
  let controls: OrbitControls | undefined;

  renderer.setSize(canvasElement.width, canvasElement.height);
  // renderer.shadowMap.enabled = true;
  // renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  // Add OrbitControls if the camera is a PerspectiveCamera
  if (construct.camera.camera instanceof THREE.PerspectiveCamera) {
    controls = new OrbitControls(construct.camera.camera, renderer.domElement);
    controls.target = zeroPosition.clone(); // .set(0, 0, 0);
    controls.enabled = false;
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.enableRotate = false;
  }
  // Construct a rotation cube
  const rotationCube = constructRotationCube(renderer);
  rotationCube.visible(true);

  // Append the renderer to the canvas element
  canvasElement.appendChild(renderer.domElement);
  // Add the standard light to the scene
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

        // Update the controls if available
        rotationCube.animate(renderer, construct.scene, construct.camera.camera);
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
    rotationCube.updateCameraWindowSize(newWidth, newHeight);
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
  };
};

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

  console.log('constructItem -- ');
  return {
    animate,
    visible,
    updateCameraWindowSize,
  };
};

/**
 * Constructs a rotation-enabled 3D cube with visual indications for its orientation in 3D space.
 *
 * @param _renderer - The WebGLRenderer instance used for rendering the 3D cube scene.
 * @returns {Object} An object containing two methods:
 *   - `animate`: A method to handle the rendering of the cube's scene using the orthographic camera.
 *   - `updateCameraWindowSize`: A method to update the dimensions of the orthographic camera's viewport based on new width and height.
 *
 * This function initializes the 3D cube by loading a model, configuring its dimensions,
 * adding visual axis indicators, and setting up a camera and scene for rendering.
 */
const constructRotationCube = (_renderer: THREE.WebGLRenderer): preparedSceneReturn => {
  const groupCube: THREE.Group = new THREE.Group();
  const cube: THREE.Group = new THREE.Group();
  const cubeScene: THREE.Scene = new THREE.Scene();
  const cubeCamera: THREE.OrthographicCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 2000);

  const standardLight = new Light({
    type: lightTypeEnum.Directional,
    color: 0x7f7e80,
    skyColor: 0x7f7e80,
    groundColor: 0xffffff,
    intensity: 0.7,
    position: [0, 0, 0],
    width: 0.2,
    height: 0.2,
  });
  standardLight.setLightPosition(new THREE.Vector3(-1, 1, 1));
  cubeScene.add(standardLight.getLight() as THREE.Light);
  standardLight.setLightPosition(new THREE.Vector3(-1, -1, 1));
  cubeScene.add(standardLight.getLight() as THREE.Light);
  standardLight.setLightPosition(new THREE.Vector3(1, -1, 1));
  cubeScene.add(standardLight.getLight() as THREE.Light);

  const glb = (): void => {
    void glbLoader(undefined, 'cube/viewCube.glb').then((gltf: GLTF | undefined) => {
      if (gltf?.scene) {
        cubeCamera.position.z = 100;
        cubeCamera.zoom = 1;

        // cubeScene.add(cubeCamera);
        cubeScene.add(groupCube);

        gltf.scene.position.copy(zeroPosition.clone());
        cube.add(gltf.scene);

        // cube is 50x50x50 (1 scale 50)
        cube.scale.set(50, 50, 50);
        groupCube.add(cube);
        finishRotationCube(groupCube);
      }
    });
  };

  /**
   * Updates the dimensions of the camera's viewport and adjusts the renderer size.
   *
   * @param {number} newWidth - The new width of the camera's viewport.
   * @param {number} newHeight - The new height of the camera's viewport.
   * @returns {void}
   */
  const updateCameraWindowSize = (newWidth: number, newHeight: number): void => {
    console.log('updateCameraWindowSize --', newWidth, newHeight);

    cubeCamera.left = -65;
    cubeCamera.right = newWidth;
    cubeCamera.top = newHeight;
    cubeCamera.bottom = -65;
    cubeCamera.updateProjectionMatrix();
  };

  /**
   * Adds visual indicators to a 3D cube-like object representing its orientation in 3D space.
   *
   * This function creates and adds arrow helpers to the provided 3D group object,
   * representing the X, Y, and Z axes. Each axis has a specific length, color,
   * and arrowhead size. The origin is set to the minimum bounds of the cube's
   * bounding box.
   *
   * @param {THREE.Group} qube - The 3D group object (typically a cube) to which the
   * orientation indicators are added. The function operates on this object.
   *
   * @returns {void}
   */
  const finishRotationCube = (qube: THREE.Group): void => {
    console.log('finishRotationCube');

    const boundingBox = new THREE.Box3().setFromObject(qube);
    const sizeBox = new THREE.Vector3();
    boundingBox.getSize(sizeBox);
    const size = sizeBox.multiplyScalar(2);

    const center = new THREE.Vector3();
    boundingBox.getCenter(center);

    const origin = zeroPosition.clone().copy(boundingBox.min);
    const headLength = size.x * 0.86 * 0.2;
    const headWidth = 0.4 * headLength;

    const xA = new THREE.ArrowHelper(
      new THREE.Vector3(1, 0, 0).normalize(),
      origin,
      size.x * 0.86,
      red,
      headLength,
      headWidth,
    );
    const yA = new THREE.ArrowHelper(
      new THREE.Vector3(0, 1, 0).normalize(),
      origin,
      size.y * 0.86,
      green,
      headLength,
      headWidth,
    );
    const zA = new THREE.ArrowHelper(
      new THREE.Vector3(0, 0, 1).normalize(),
      origin,
      size.z * 0.86,
      blue,
      headLength,
      headWidth,
    );
    qube.add(yA);
    qube.add(xA);
    qube.add(zA);

    createTextLabel('helvetiker_regular.typeface.json', 'X', new THREE.Vector3(45, -20, -20), red, qube);
    createTextLabel('helvetiker_regular.typeface.json', 'Y', new THREE.Vector3(-20, 45, -20), green, qube);
    createTextLabel('helvetiker_regular.typeface.json', 'Z', new THREE.Vector3(-20, -20, 50), blue, qube);
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
    const quater = new THREE.Quaternion(
      camera.quaternion.x,
      camera.quaternion.y,
      camera.quaternion.z,
      camera.quaternion.w,
    );
    quater.invert();
    groupCube.setRotationFromQuaternion(quater);
    renderer.render(cubeScene, cubeCamera);
  };

  /**
   * Sets the visibility of the rotation cube.
   *
   * @param {boolean} vis - A boolean value indicating whether the cube should be visible (`true`) or hidden (`false`).
   * @returns {void} This function does not return any value.
   */
  const visible = (vis: boolean): void => {
    groupCube.visible = vis;
  };

  glb();

  console.log('cubeScene -- ', groupCube);
  return {
    animate,
    visible,
    updateCameraWindowSize,
  };
};
