import * as THREE from 'three';
import { cameraConfig, cameraTypeEnum, createCamera } from './camera';

describe('createCamera', () => {
  let config: cameraConfig;

  beforeEach(() => {
    config = {
      type: cameraTypeEnum.PERSPECTIVE,
      width: 800,
      height: 600,
    };
  });

  it('should create perspective camera when type is PERSPECTIVE', () => {
    const camera = createCamera(config);
    expect(camera).toBeInstanceOf(THREE.PerspectiveCamera);
  });

  it('should create orthographic camera when type is ORTHOGRAPHIC', () => {
    config.type = cameraTypeEnum.ORTHOGRAPHIC;
    const camera = createCamera(config);
    expect(camera).toBeInstanceOf(THREE.OrthographicCamera);
  });

  it('should throw error when config is invalid', () => {
    config.width = -1;
    expect(() => createCamera(config)).toThrow();
  });
});
