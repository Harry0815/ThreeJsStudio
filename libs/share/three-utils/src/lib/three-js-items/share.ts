import * as THREE from 'three';

export const defaultLightColor = 0xffffff;
export const defaultLightIntensity = 1;
export const red = 0xff0000;
export const green = 0x00ff00;
export const blue = 0x0000ff;
export const zeroPosition = { x: 0, y: 0, z: 0 };

/**
 * Traverses through a THREE.Group and executes a callback function on each child.
 *
 * @param {THREE.Group} group - The THREE.Group to traverse through.
 * @param {function} callback - The callback function to be executed on each child.
 */
export const traverseGroup = (group: THREE.Group, callback: (child: THREE.Object3D) => void) => {
  group.children.forEach((child) => {
    if (child instanceof THREE.Group) {
      traverseGroup(child as THREE.Group, callback);
    } else {
      callback(child);
    }
  });
};

/**
 * Represents the interface defining default constants for a software system.
 *
 * @interface interfaceDefaultConstants
 */
export interface interfaceDefaultConstants {
  defaultLightColor: number;
  defaultLightIntensity: number;
  red: number;
  green: number;
  blue: number;
  zeroPosition: { x: number; y: number; z: number };
}

/**
 * Variable containing default constants and values for various settings.
 * @typedef {Object} defaultConstants
 * @property {string} defaultLightColor - The default color for the light source.
 * @property {number} defaultLightIntensity - The default intensity of the light source.
 * @property {number} red - The red color value.
 * @property {number} green - The green color value.
 * @property {number} blue - The blue color value.
 * @property {Object} zeroPosition - The zero position vector.
 */
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
