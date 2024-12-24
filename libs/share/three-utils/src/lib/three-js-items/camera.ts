import * as THREE from 'three';
import { z } from 'zod';

/**
 * Enum for the different types of cameras
 */
export enum cameraTypeEnum {
  PERSPECTIVE = 'perspective',
  ORTHOGRAPHIC = 'orthographic',
  UNDEFINED = 'undefined',
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
 * Create a camera based on the configuration
 * @param cf Configuration for the camera
 * @returns A camera
 */
export const createCamera = (cf: cameraConfig): THREE.Camera | undefined => {
  const result = cameraConfigSchema.safeParse(cf);
  if (!result.success) {
    throw new Error('Invalid light configuration');
  }
  const config = result.data;

  let camera: THREE.Camera | undefined = undefined;
  if (config.type === cameraTypeEnum.PERSPECTIVE) {
    camera = new THREE.PerspectiveCamera(
      config.fov ?? 75,
      config.width / config.height,
      config.near ?? 0.01,
      config.far ?? 1000,
    );
  } else if (config.type === cameraTypeEnum.ORTHOGRAPHIC) {
    camera = new THREE.OrthographicCamera(
      config.width / -2,
      config.width / 2,
      config.height / 2,
      config.height / -2,
      config.near ?? 0.01,
      config.far ?? 1000,
    );
  }
  return camera;
};
