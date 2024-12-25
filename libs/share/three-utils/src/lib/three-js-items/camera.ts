import * as THREE from 'three';
import { z } from 'zod';

/**
 * Enum for the different types of cameras
 */
export enum cameraTypeEnum {
  PERSPECTIVE = 0,
  ORTHOGRAPHIC = 1,
  UNDEFINED = 2,
}

/**
 * Configuration for a camera
 */
export interface cameraConfig {
  type: cameraTypeEnum;
  width: number;
  height: number;
  fov?: number;
  near?: number;
  far?: number;
}

/**
 * Zod schema for a camera configuration
 */
export const cameraConfigSchema = z.object({
  type: z.nativeEnum(cameraTypeEnum),
  width: z.number().positive(),
  height: z.number().positive(),
  fov: z.number().optional(),
  near: z.number().optional(),
  far: z.number().optional(),
});

/**
 * Type for a camera configuration
 */
export type CameraConfig = z.infer<typeof cameraConfigSchema>;

/**
 * Represents a camera class that wraps a Three.js Camera object and provides functionality to initialize and manage it.
 */
export class Camera {
  /**
   * Gets the current instance of the camera.
   * This method provides access to the underlying Three.js Camera object.
   *
   * @returns {THREE.Camera} The current camera instance.
   */
  get camera(): THREE.Camera | undefined {
    return this.#camera;
  }

  /**
   * Sets the camera to be used.
   *
   * @param {THREE.Camera} value - The new camera instance to set.
   */
  set camera(value: THREE.Camera | undefined) {
    this.#camera = value;
  }

  /**
   * The current camera instance.
   */
  #camera: THREE.Camera | undefined = undefined;

  /**
   * Constructs a new instance of the class with the provided camera configuration.
   *
   * @param {cameraConfig} cf - The camera configuration object to initialize the camera.
   * @throws {Error} Throws an error if the provided camera configuration is invalid.
   * @return {void} This constructor does not return a value.
   */
  constructor(cf: cameraConfig) {
    const result = cameraConfigSchema.safeParse(cf);
    if (!result.success) {
      throw new Error('Invalid light configuration');
    }
    const config = result.data;
    this.#createCamera(config);
  }

  /**
   * Creates and configures a camera instance based on the provided configuration object.
   *
   * @param {object} cf - The camera configuration object.
   * @param {string} cf.type - The type of the camera, either "PERSPECTIVE" or "ORTHOGRAPHIC".
   * @param {number} cf.fov - The field of view for the perspective camera (optional for PERSPECTIVE).
   * @param {number} cf.width - The width used for calculating the aspect ratio or orthographic bounds.
   * @param {number} cf.height - The height used for calculating the aspect ratio or orthographic bounds.
   * @param {number} cf.near - The near clipping plane distance (optional, defaults to 0.01).
   * @param {number} cf.far - The far clipping plane distance (optional, defaults to 1000).
   * @returns {void} This method does not return any value, but it sets up the camera instance.
   * @throws {Error} Throws an error if the provided camera configuration is invalid.
   */
  #createCamera(cf: cameraConfig): void {
    const result = cameraConfigSchema.safeParse(cf);
    if (!result.success) {
      throw new Error('Invalid light configuration');
    }
    const config = result.data;

    if (config.type === cameraTypeEnum.PERSPECTIVE) {
      this.camera = new THREE.PerspectiveCamera(
        config.fov ?? 75,
        config.width / config.height,
        config.near ?? 0.01,
        config.far ?? 1000,
      );
    } else if (config.type === cameraTypeEnum.ORTHOGRAPHIC) {
      this.camera = new THREE.OrthographicCamera(
        config.width / -2,
        config.width / 2,
        config.height / 2,
        config.height / -2,
        config.near ?? 0.01,
        config.far ?? 1000,
      );
    }
  }

  /**
   * Update the camera's window size
   * @param newWidth New width for the camera
   * @param newHeight New height for the camera
   * @returns {void} This method does not return any value, but it sets up the camera instance.
   */
  updateCameraWindowSize = (newWidth: number, newHeight: number): void => {
    if (this.camera instanceof THREE.PerspectiveCamera) {
      this.camera.aspect = newWidth / newHeight;
      this.camera.updateProjectionMatrix();
      this.camera.updateMatrixWorld();
    }
  };
}
