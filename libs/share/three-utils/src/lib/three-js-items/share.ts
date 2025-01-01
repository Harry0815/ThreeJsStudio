import * as THREE from 'three';

export const defaultLightColor = 0xffffff;
export const defaultLightIntensity = 1;
export const red = 0xff0000;
export const green = 0x00ff00;
export const blue = 0x0000ff;
export const zeroPosition = { x: 0, y: 0, z: 0 };

export interface interfaceAnalyseResult {
  boundingLength: number;
  boundingBox: THREE.Box3;
}

/**
 * Calculates the length of the bounding box's diagonal edge for a given 3D object.
 *
 * @param {THREE.Object3D} object - The 3D object for which the bounding box will be calculated.
 * @returns {interfaceAnalyseResult} - The diagonal edge length of the bounding box and the boundingBox.
 */
export const calculateBoundingBox = (object: THREE.Object3D): interfaceAnalyseResult => {
  const ret = {
    boundingLength: 0,
    boundingBox: new THREE.Box3(),
  };

  ret.boundingBox = new THREE.Box3().setFromObject(object);
  ret.boundingLength = Math.sqrt(
    Math.pow(ret.boundingBox.max.x - ret.boundingBox.min.x, 2) +
      Math.pow(ret.boundingBox.max.y - ret.boundingBox.min.y, 2) +
      Math.pow(ret.boundingBox.max.z - ret.boundingBox.min.z, 2),
  );

  return ret;
};

/**
 * Traverses through a THREE.Group and executes a callback function on each child.
 *
 * @param {THREE.Group} group - The THREE.Group to traverse through.
 * @param {function} callback - The callback function to be executed on each child.
 */
export const traverseGroup = (group: THREE.Group, callback: (child: THREE.Object3D) => void): void => {
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
 * A collection of default constant values used for light source configuration and color definitions.
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
