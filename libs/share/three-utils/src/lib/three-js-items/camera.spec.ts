import * as THREE from 'three';
import { Camera, cameraConfig, cameraTypeEnum } from './camera';

describe('Camera', () => {
  let config: cameraConfig;

  beforeEach(() => {
    config = {
      type: cameraTypeEnum.PERSPECTIVE,
      width: 800,
      height: 600,
      fov: 75,
      near: 0.01,
      far: 1000,
    };
  });

  it('should initialize with perspective camera for type PERSPECTIVE', () => {
    const cameraInstance = new Camera(config);
    expect(cameraInstance.camera).toBeInstanceOf(THREE.PerspectiveCamera);
  });

  it('should initialize with orthographic camera for type ORTHOGRAPHIC', () => {
    config.type = cameraTypeEnum.ORTHOGRAPHIC;
    const cameraInstance = new Camera(config);
    expect(cameraInstance.camera).toBeInstanceOf(THREE.OrthographicCamera);
  });

  it('should throw an error when initialized with invalid configuration', () => {
    config.width = -1; // Invalid width
    expect(() => new Camera(config)).toThrow('Invalid light configuration');
  });

  it('should update the camera window size correctly', () => {
    const cameraInstance = new Camera(config);
    const perspectiveCamera = cameraInstance.camera as THREE.PerspectiveCamera;

    expect(perspectiveCamera.aspect).toBeCloseTo(800 / 600);
    cameraInstance.updateCameraWindowSize(1920, 1080);
    expect(perspectiveCamera.aspect).toBeCloseTo(1920 / 1080);
  });

  it('should get and set the camera instance', () => {
    const cameraInstance = new Camera(config);
    const customCamera = new THREE.PerspectiveCamera();
    cameraInstance.camera = customCamera;
    expect(cameraInstance.camera).toBe(customCamera);
  });
});
