import * as THREE from 'three';

export const defaultLightColor = 0xffffff;
export const defaultLightIntensity = 1;
export const red = 0xff0000;
export const green = 0x00ff00;
export const blue = 0x0000ff;
export const zeroPosition = { x: 0, y: 0, z: 0 };

export interface interfaceDefaultConstants {
  defaultLightColor: number;
  defaultLightIntensity: number;
  red: number;
  green: number;
  blue: number;
  zeroPosition: { x: number; y: number; z: number };
}

export const defaultConstants = {
  /**
   * The default color for the light source.
   */
  defaultLightColor: defaultLightColor,

  /**
   * The default intensity of the light source.
   */
  defaultLightIntensity: defaultLightIntensity,

  /**
   * The red color value.
   */
  red: red,

  /**
   * The green color value.
   */
  green: green,

  /**
   * The blue color value.
   */
  blue: blue,

  /**
   * The zero position vector.
   */
  zeroPosition: new THREE.Vector3(zeroPosition.x, zeroPosition.y, zeroPosition.z),
} as interfaceDefaultConstants;
