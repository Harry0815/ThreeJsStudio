import * as THREE from 'three';
import { preparedSceneReturn } from 'three-utils';

export const ground = (): preparedSceneReturn => {
  const groundScene: THREE.Scene = new THREE.Scene();
  const analyseResult = {
    boundingLength: 0,
  };

  const staticCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10000);
  staticCamera.position.set(0, 0, 100);
  staticCamera.lookAt(0, 0, 0);
  staticCamera.zoom = 1;

  const geometry = new THREE.PlaneGeometry(10, 10);
  geometry.rotateX(-Math.PI / 3.5); //.15);

  const material = new THREE.MeshStandardMaterial({
    color: 0x0f0f1f,
    side: THREE.DoubleSide,
  });
  const ground = new THREE.Mesh(geometry, material);
  ground.receiveShadow = true;
  ground.position.z = 0;
  // ground.position.y = -15;
  groundScene.add(new THREE.Group().add(ground));
  groundScene.scale.set(30, 30, 30);
  /*
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
  groundScene.add(standardLight.getLight() as THREE.Light);

   */

  /**
   * Updates the dimensions of the camera's viewport and adjusts the renderer size.
   *
   * @param {number} _newWidth - nothing to do.
   * @param {number} _newHeight - nothing to do.
   * @returns {void}
   */
  const updateCameraWindowSize = (_newWidth: number, _newHeight: number): void => {
    staticCamera.left = -_newWidth;
    staticCamera.right = _newWidth;
    staticCamera.top = _newHeight;
    staticCamera.bottom = -_newHeight;
    staticCamera.updateProjectionMatrix();
  };

  /**
   * A function that manages the rendering process for a 3D scene.
   *
   * @param {THREE.WebGLRenderer} renderer - The WebGL renderer responsible for rendering the scene.
   * @param {THREE.Scene} _scene - The main scene to be rendered (unused in this function).
   * @param {THREE.Camera} _camera - The main camera for the scene (unused in this function).
   * @returns {void} This function does not return a value.
   */
  const animate = (renderer: THREE.WebGLRenderer, _scene: THREE.Scene, _camera: THREE.Camera): void => {
    renderer.render(groundScene, staticCamera);
  };

  const visible = (vis: boolean): void => {
    ground.visible = vis;
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

  analyseScene();
  console.log('ground-Scene -- ', groundScene);

  return {
    animate,
    visible,
    updateCameraWindowSize,
    setMaterial,
    analyseScene,
    analyseResult: analyseResult,
  };
};
