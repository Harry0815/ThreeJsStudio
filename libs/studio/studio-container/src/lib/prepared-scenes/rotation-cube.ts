import * as THREE from 'three';
import { GLTF } from 'three-stdlib';
import {
  blue,
  createTextLabel,
  glbLoader,
  green,
  Light,
  lightTypeEnum,
  preparedSceneReturn,
  red,
  zeroPosition,
} from 'three-utils';

/**
 * Constructs and prepares a rotation cube with a 3D scene, camera, lighting, and interaction methods.
 *
 * This function creates a 3D model of a rotation cube which can be rendered in a specific scene.
 * It implements necessary utilities, including lighting, camera setup, and the ability to animate,
 * update the viewport, and toggle visibility of the cube.
 *
 * @returns {preparedSceneReturn} An object containing methods for animating the cube,
 * changing its visibility, and updating the camera window size:
 * - `animate`: A method to synchronize the camera's orientation with the cube.
 * - `visible`: A method to set the visibility of the cube.
 * - `updateCameraWindowSize`: A method to adjust the camera's dimensions based on given viewport parameters.
 */
export const constructRotationCube = (): preparedSceneReturn => {
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

        gltf.scene.position.copy(new THREE.Vector3(zeroPosition.x, zeroPosition.y, zeroPosition.z));
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

    // Multiply by 2 and then calculate 86% to get the size for the arrow length
    const size = sizeBox.multiplyScalar(2 * 0.86);

    // Calculate the center of the bounding box
    const center = new THREE.Vector3();
    boundingBox.getCenter(center);

    // Calculate the origin of the bounding
    const origin: THREE.Vector3 = new THREE.Vector3(zeroPosition.x, zeroPosition.y, zeroPosition.z).copy(
      boundingBox.min,
    );
    const headLength = size.x * 0.2;
    const headWidth = 0.4 * headLength;

    const paras = [
      { direction: new THREE.Vector3(1, 0, 0).normalize(), origin: origin, length: size.x, color: red as number },
      { direction: new THREE.Vector3(0, 1, 0).normalize(), origin: origin, length: size.y, color: green as number },
      { direction: new THREE.Vector3(0, 0, 1).normalize(), origin: origin, length: size.z, color: blue as number },
    ];
    paras.forEach((para) => {
      const arrow = new THREE.ArrowHelper(para.direction, para.origin, para.length, para.color, headLength, headWidth);
      qube.add(arrow);
    });

    createTextLabel('helvetiker_regular.typeface.json', 'X', new THREE.Vector3(45, -20, -20), red as number, qube);
    createTextLabel('helvetiker_regular.typeface.json', 'Y', new THREE.Vector3(-20, 45, -20), green as number, qube);
    createTextLabel('helvetiker_regular.typeface.json', 'Z', new THREE.Vector3(-20, -20, 50), blue as number, qube);
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

  glb();

  console.log('cube-Scene -- ', groupCube, cubeScene);
  return {
    animate,
    visible,
    updateCameraWindowSize,
    setMaterial,
    analyseScene,
  };
};
