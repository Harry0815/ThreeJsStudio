// Importing necessary dependencies and functions
import * as THREE from 'three';
// import { Camera, cameraTypeEnum } from './camera';
import { construct, constructReturn } from './construct';
// import { Light, lightTypeEnum } from './light';

// Start defining Jest tests
describe('construct function tests', () => {
  let width: number;
  let height: number;

  beforeEach(() => {
    // Setting width and height before each test
    width = 600;
    height = 800;
  });

  test('should return an object with scene, camera, and lights', () => {
    const result: constructReturn = construct(width, height);

    // Assert properties
    expect(result).toHaveProperty('scene');
    expect(result).toHaveProperty('camera');
    expect(result).toHaveProperty('lights');
    expect(result.lights).toBeInstanceOf(Map);
  });

  test('should create a THREE.Scene object', () => {
    const result: constructReturn = construct(width, height);

    // Assert scene is correctly instantiated
    expect(result.scene).toBeInstanceOf(THREE.Scene);
  });

  test('should create a perspective camera with correct aspect ratio', () => {
    const result: constructReturn = construct(width, height);

    const camera = result.camera.camera;
    if (camera instanceof THREE.PerspectiveCamera) {
      expect(camera.aspect).toBe(width / height);
    } else {
      fail('Expected a THREE.PerspectiveCamera instance');
    }
  });

  test('should create standard light with position set correctly', () => {
    const result: constructReturn = construct(width, height);

    const light = result.lights.get('standard');
    if (!light) {
      fail('Expected standard light to be defined');
    } else {
      expect(light.getLightPosition()).toEqual(new THREE.Vector3(0, 2, 2));
    }
  });
});

// describe('prepareConstruct function tests', () => {
//   let mockConstruct: constructReturn;
//   let canvasElement: HTMLCanvasElement;
//
//   beforeEach(() => {
//     // Mocking canvas element and construct
//     canvasElement = document.createElement('canvas');
//     canvasElement.width = 600;
//     canvasElement.height = 800;
//
//     mockConstruct = {
//       scene: new THREE.Scene(),
//       camera: new Camera({ type: cameraTypeEnum.PERSPECTIVE, fov: 75, height: 800, width: 600, far: 1000, near: 0.01 }),
//       lights: new Map([
//         [
//           'standard',
//           new Light({
//             type: lightTypeEnum.Hemisphere,
//             color: 0xffffff,
//             intensity: 1,
//             position: [0, 10, 10],
//           }),
//         ],
//       ]),
//     };
//   });
//
//   test('should return undefined if canvasElement is not provided', () => {
//     const result = prepareConstruct(mockConstruct, undefined);
//     expect(result).toBeUndefined();
//   });
//
//   test('should initialize renderer and attach it to the canvas', () => {
//     const result = prepareConstruct(mockConstruct, canvasElement);
//     expect(result).toBeDefined();
//     expect(result?.renderer).toBeInstanceOf(THREE.WebGLRenderer);
//     expect(canvasElement.childNodes.length).toBe(1); // Renderer DOM element appended
//   });
//
//   test('should add lights to the scene', () => {
//     prepareConstruct(mockConstruct, canvasElement);
//     expect(mockConstruct.scene.children.some(child => child instanceof THREE.Light)).toBe(true);
//   });
//
//   test('should allow adding a new light', () => {
//     const result = prepareConstruct(mockConstruct, canvasElement);
//     const newLight = new Light({
//       type: lightTypeEnum.Hemisphere,
//       color: 0xffffff,
//       intensity: 1,
//       position: [0, 10, 10],
//     });
//
//     result?.addLight('newLight', newLight);
//     expect(mockConstruct.lights.has('newLight')).toBe(true);
//     expect(mockConstruct.scene.children.some((child) => child instanceof THREE.Light)).toBe(true);
//   });
//
//   test('should allow deleting an existing light', () => {
//     const result = prepareConstruct(mockConstruct, canvasElement);
//     result?.deleteLight('standard');
//     expect(mockConstruct.lights.has('standard')).toBe(false);
//     expect(mockConstruct.scene.children.some((child) => child instanceof THREE.Light)).toBe(false);
//   });
//
//   test('should animate and render', () => {
//     const result = prepareConstruct(mockConstruct, canvasElement);
//     const mockCallback = jest.fn();
//     result?.animate(mockCallback);
//
//     // RequestAnimationFrame is called (mocked internally)
//     expect(mockCallback).toBeCalled();
//   });
// });
