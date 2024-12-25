import * as THREE from 'three';
import { Light, lightConfig, lightTypeEnum } from './light';

describe('Light', () => {
  let config: lightConfig;
  let light: Light;

  beforeEach(() => {
    config = {
      type: lightTypeEnum.Directional,
      color: 0xffffff,
      intensity: 1,
      position: [0, 0, 0],
    };
    light = new Light(config);
  });

  test('should get the correct light type', () => {
    expect(light.getLightType()).toBe(lightTypeEnum.Directional);
  });

  test('should set new light with different configuration', () => {
    const newConfig: lightConfig = {
      type: lightTypeEnum.Point,
      color: 0xffff00,
      intensity: 0.5,
      position: [1, 2, 3],
    };
    light.setNewLight(newConfig);
    expect(light.getLightType()).toBe(lightTypeEnum.Point);
  });

  test('should set and get correct position of the light', () => {
    const newPosition = new THREE.Vector3(10, 20, 30);
    light.setLightPosition(newPosition);
    const config = light.getConfig();
  });

  test('should set the color of the light', () => {
    const newColor = 0xee82ee;
    light.setLightColor(newColor);
    const config = light.getConfig();
    if (config.color) {
      expect(config.color).toBe(newColor);
    }
    expect(config.color).toBe(newColor);
  });

  test('should set the sky color for a 3D scene when light is HemisphereLight', () => {
    const hemisphereLightConfig: lightConfig = {
      type: lightTypeEnum.Hemisphere,
      color: 0xffff00,
      intensity: 0.5,
      position: [1, 2, 3],
      skyColor: 0x87ceeb,
    };
    const hemisphereLight = new Light(hemisphereLightConfig);
    hemisphereLight.setSkyColor(0x0000ff);
    const config = hemisphereLight.getConfig();
    expect(config.color).toBe(0x0000ff);
  });

  test('should set the ground color for a 3D scene when light is HemisphereLight', () => {
    const hemisphereLightConfig: lightConfig = {
      type: lightTypeEnum.Hemisphere,
      color: 0xffff00,
      intensity: 0.5,
      position: [1, 2, 3],
      groundColor: 0xa0522d,
    };
    const hemisphereLight = new Light(hemisphereLightConfig);
    hemisphereLight.setGroundColor(0xd2691e);
    const config = hemisphereLight.getConfig();
    expect(config.groundColor).toBe(0xd2691e);
  });

  test('should set the intensity of the light', () => {
    const newIntensity = 0.7;
    light.setLightIntensity(newIntensity);
    const config = light.getConfig();
    expect(config.intensity).toBe(newIntensity);
  });

  test('should set the new size of the RectAreaLight', () => {
    const rectAreaLightConfig: lightConfig = {
      type: lightTypeEnum.RectArea,
      color: 0xffff00,
      intensity: 0.5,
      position: [1, 2, 3],
      width: 10,
      height: 20,
    };
    const rectAreaLight = new Light(rectAreaLightConfig);
    rectAreaLight.setNewRectAreaLightSize(5, 10);
    const config = rectAreaLight.getConfig();
    expect(config.width).toBe(5);
    expect(config.height).toBe(10);
  });
});
