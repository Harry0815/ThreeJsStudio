import * as THREE from 'three';
import { z } from 'zod';

/**
 * Enum for the different types of lights
 */
export enum lightTypeEnum {
  Ambient,
  Directional,
  Hemisphere,
  Point,
  RectArea,
  Spot,
  Unknown,
}

/**
 * Configuration for a light
 */
export interface lightConfig {
  type: lightTypeEnum;
  color: string;
  skyColor?: string;
  groundColor?: string;
  intensity: number;
  width?: number;
  height?: number;
  position?: [number, number, number];
}

/**
 * Zod schema for a light configuration
 */
export const lightConfigSchema = z.object({
  type: z.nativeEnum(lightTypeEnum),
  color: z.string(),
  groundColor: z.string().optional(),
  skyColor: z.string().optional(),
  intensity: z.number(),
  width: z.number().optional(),
  height: z.number().optional(),
  position: z.array(z.number()),
});
/**
 * Type for a light configuration
 */
export type LightConfig = z.infer<typeof lightConfigSchema>;

/**
 * Create a light based on the configuration
 * @param config Configuration for the light
 * @returns A light
 */
export const createLight = (config: lightConfig): THREE.Light | undefined => {
  lightConfigSchema.parse(config);

  if (config.type === lightTypeEnum.Ambient) {
    return createAmbientLight(config.color, config.intensity);
  }
  if (config.type === lightTypeEnum.Directional) {
    return createDirectionalLight(config.color, config.intensity, config.position ?? [0, 0, 0]);
  }
  if (config.type === lightTypeEnum.Hemisphere) {
    return createHemisphereLight(config.skyColor ?? config.color, config.groundColor ?? config.color, config.intensity);
  }
  if (config.type === lightTypeEnum.Point) {
    return createPointLight(config.color, config.intensity, config.position ?? [0, 0, 0]);
  }
  if (config.type === lightTypeEnum.RectArea) {
    return createRectAreaLight(config.color, config.intensity, config.width ?? 1, config.height ?? 1);
  }
  if (config.type === lightTypeEnum.Spot) {
    return createSpotLight(config.color, config.intensity, config.position ?? [0, 0, 0]);
  }
  return undefined;
};

/**
 * Create an ambient light
 * @param color Color of the light
 * @param intensity Intensity of the light
 * @returns An ambient light
 */
const createAmbientLight = (color: string, intensity: number): THREE.Light => {
  return new THREE.AmbientLight(color, intensity);
};

/**
 * Create a directional light
 * @param color Color of the light
 * @param intensity Intensity of the light
 * @param position Position of the light
 * @returns A directional light
 */
const createDirectionalLight = (color: string, intensity: number, position: [number, number, number]): THREE.Light => {
  const light = new THREE.DirectionalLight(color, intensity);
  light.position.set(...position);
  return light;
};

/**
 * Create a hemisphere light
 * @param skyColor Color of the sky
 * @param groundColor Color of the ground
 * @param intensity Intensity of the light
 * @returns A hemisphere light
 */
const createHemisphereLight = (skyColor: string, groundColor: string, intensity: number): THREE.Light => {
  return new THREE.HemisphereLight(skyColor, groundColor, intensity);
};

/**
 * Create a point light
 * @param color Color of the light
 * @param intensity Intensity of the light
 * @param position Position of the light
 * @returns A point light
 */
const createPointLight = (color: string, intensity: number, position: [number, number, number]): THREE.Light => {
  const light = new THREE.PointLight(color, intensity);
  light.position.set(...position);
  return light;
};

/**
 * Create a rect area light
 * @param color Color of the light
 * @param intensity Intensity of the light
 * @param width Width of the light
 * @param height Height of the light
 * @returns A rect area light
 */
const createRectAreaLight = (color: string, intensity: number, width: number, height: number): THREE.Light => {
  return new THREE.RectAreaLight(color, intensity, width, height);
};

/**
 * Create a spotlight
 * @param color Color of the light
 * @param intensity Intensity of the light
 * @param position Position of the light
 * @returns A spotlight
 */
const createSpotLight = (color: string, intensity: number, position: [number, number, number]): THREE.Light => {
  const light = new THREE.SpotLight(color, intensity);
  light.position.set(...position);
  return light;
};
