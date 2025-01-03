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
      expect(light.getLightPosition()).toEqual(new THREE.Vector3(0, 0, 0));
    }
  });
});
