import * as THREE from 'three';
import { createLight, lightConfig, lightTypeEnum } from './light';
import 'jest';

// CreateLight function tests

describe('createLight function', () => {
  const defaultConfig: lightConfig = {
    type: lightTypeEnum.Ambient,
    color: 0xfefefe,
    intensity: 1,
    position: [0, 0, 0],
  };

  it('returns an AmbientLight when given type lightTypeEnum.Ambient', () => {
    const config = { ...defaultConfig, type: lightTypeEnum.Ambient };
    const result = createLight(config);
    expect(result).toBeInstanceOf(THREE.AmbientLight);
  });

  it('returns a DirectionalLight when given type lightTypeEnum.Directional', () => {
    const config = { ...defaultConfig, type: lightTypeEnum.Directional };
    const result = createLight(config);
    expect(result).toBeInstanceOf(THREE.DirectionalLight);
  });

  it('returns a HemisphereLight when given type lightTypeEnum.Hemisphere', () => {
    const config = { ...defaultConfig, type: lightTypeEnum.Hemisphere };
    const result = createLight(config);
    expect(result).toBeInstanceOf(THREE.HemisphereLight);
  });

  it('returns a PointLight when given type lightTypeEnum.Point', () => {
    const config = { ...defaultConfig, type: lightTypeEnum.Point };
    const result = createLight(config);
    expect(result).toBeInstanceOf(THREE.PointLight);
  });

  it('returns a RectAreaLight when given type lightTypeEnum.RectArea', () => {
    const config = { ...defaultConfig, type: lightTypeEnum.RectArea };
    const result = createLight(config);
    expect(result).toBeInstanceOf(THREE.RectAreaLight);
  });

  it('returns a SpotLight when given type lightTypeEnum.Spot', () => {
    const config = { ...defaultConfig, type: lightTypeEnum.Spot };
    const result = createLight(config);
    expect(result).toBeInstanceOf(THREE.SpotLight);
  });

  it('should throw error when config is invalid', () => {
    const config = { ...defaultConfig, type: -1 };
    expect(() => createLight(config)).toThrow();
  });
});
