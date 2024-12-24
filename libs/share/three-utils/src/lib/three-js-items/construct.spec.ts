// Importing necessary dependencies and functions
import * as THREE from 'three';
import { construct, constructReturn } from './construct';

// Start defining Jest tests
describe('construct function tests', () => {
  let width: number;
  let height: number;

  beforeEach(() => {
    // Setting width and height before each test
    width = 600;
    height = 800;
  });

  test('should return properly constructed object', () => {
    const result: constructReturn = construct(width, height);

    // Check if the result has all the necessary properties
    expect(result).toHaveProperty('scene');
    expect(result).toHaveProperty('camera');
    expect(result).toHaveProperty('light');

    // Check type of the properties
    expect(result.scene).toBeInstanceOf(THREE.Scene);
    expect(result.camera).toBeTruthy();
    expect(result.light).toBeTruthy();

    // Checking camera and renderer width and height
    if (result.camera instanceof THREE.PerspectiveCamera) {
      expect(result.camera.aspect).toBe(width / height);
    }
  });
});
