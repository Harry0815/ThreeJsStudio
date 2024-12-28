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
  color: number;
  intensity: number;
  position: number[];
  skyColor?: number;
  groundColor?: number;
  width?: number;
  height?: number;
}

/**
 * Zod schema for a light configuration
 */
export const lightConfigSchema = z.object({
  type: z.nativeEnum(lightTypeEnum),
  color: z.number(),
  intensity: z.number(),
  position: z.array(z.number()).length(3),
  groundColor: z.number().optional(),
  skyColor: z.number().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
});
/**
 * Type for a light configuration
 */
export type LightConfig = z.infer<typeof lightConfigSchema>;

/**
 * Type for the return of the createLight function
 */
export type createLightReturn =
  | THREE.Light
  | THREE.AmbientLight
  | THREE.HemisphereLight
  | THREE.RectAreaLight
  | THREE.SpotLight
  | THREE.PointLight
  | THREE.DirectionalLight
  | undefined;

export type createLightHelperReturn =
  | THREE.PointLightHelper
  | THREE.SpotLightHelper
  | THREE.DirectionalLightHelper
  | THREE.HemisphereLightHelper
  | undefined;

/**
 * Create a light based on the configuration
 * @param cf Configuration for the light
 * @returns A light
 */
export const createLight = (cf: lightConfig): createLightReturn => {
  const result = lightConfigSchema.safeParse(cf);
  if (!result.success) {
    throw new Error('Invalid light configuration');
  }
  const config = result.data;

  if (config.type === lightTypeEnum.Ambient) {
    return createAmbientLight(config.color, config.intensity);
  }
  if (config.type === lightTypeEnum.Directional) {
    return createDirectionalLight(config.color, config.intensity, config.position);
  }
  if (config.type === lightTypeEnum.Hemisphere) {
    return createHemisphereLight(config.skyColor ?? config.color, config.groundColor ?? config.color, config.intensity);
  }
  if (config.type === lightTypeEnum.Point) {
    return createPointLight(config.color, config.intensity, config.position);
  }
  if (config.type === lightTypeEnum.RectArea) {
    return createRectAreaLight(config.color, config.intensity, config.width ?? 1, config.height ?? 1);
  }
  if (config.type === lightTypeEnum.Spot) {
    return createSpotLight(config.color, config.intensity, config.position);
  }
  return undefined;
};

/**
 * Create an ambient light
 * @param color Color of the light
 * @param intensity Intensity of the light
 * @returns An ambient light
 */
const createAmbientLight = (color: number, intensity: number): THREE.AmbientLight => {
  const light = new THREE.AmbientLight(color, intensity);
  light.castShadow = true;
  return light;
};

/**
 * Create a directional light
 * @param color Color of the light
 * @param intensity Intensity of the light
 * @param position Position of the light
 * @returns A directional light
 */
const createDirectionalLight = (color: number, intensity: number, position: number[]): THREE.Light => {
  const light = new THREE.DirectionalLight(color, intensity);
  light.position.set(position[0], position[1], position[2]);
  light.castShadow = true;
  return light;
};

/**
 * Create a hemisphere light
 * @param skyColor Color of the sky
 * @param groundColor Color of the ground
 * @param intensity Intensity of the light
 * @returns A hemisphere light
 */
const createHemisphereLight = (skyColor: number, groundColor: number, intensity: number): THREE.HemisphereLight => {
  const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
  light.castShadow = true;
  return light;
};

/**
 * Create a point light
 * @param color Color of the light
 * @param intensity Intensity of the light
 * @param position Position of the light
 * @returns A point light
 */
const createPointLight = (color: number, intensity: number, position: number[]): THREE.Light => {
  const light = new THREE.PointLight(color, intensity);
  light.position.set(position[0], position[1], position[2]);
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
const createRectAreaLight = (color: number, intensity: number, width: number, height: number): THREE.RectAreaLight => {
  const light = new THREE.RectAreaLight(color, intensity, width, height);
  light.castShadow = true;
  return light;
};

/**
 * Create a spotlight
 * @param color Color of the light
 * @param intensity Intensity of the light
 * @param position Position of the light
 * @returns A spotlight
 */
const createSpotLight = (color: number, intensity: number, position: number[]): THREE.Light => {
  const light = new THREE.SpotLight(color, intensity);
  light.position.set(position[0], position[1], position[2]);
  light.castShadow = true;
  return light;
};

/**
 * Class representing a Light object used in a 3D scene.
 */
export class Light {
  #light: createLightReturn;
  #helper: createLightHelperReturn;
  #config: lightConfig;

  /**
   * Constructor for creating a Light object with the given configuration.
   *
   * @param {lightConfig} config - The configuration object for the Light.
   * @return {undefined}
   */
  constructor(config: lightConfig) {
    this.#config = config;
    this.#light = createLight(config);
    this.configureShadow();
    if (config.position.length === 3) {
      this.setLightPosition(new THREE.Vector3(config.position[0], config.position[1], config.position[2]));
    }
    this.#helper = this.#createHelper();
  }

  /**
   * Configures the shadow properties for a light source in a 3D environment.
   * This method enables shadow casting for the light source if it supports shadows
   * and sets default values for the shadow's map size and camera properties.
   * Adjusts `near` and `far` planes for perspective cameras if applicable.
   */
  configureShadow = (): void => {
    try {
      if (this.#light instanceof THREE.PointLight || this.#light instanceof THREE.SpotLight) {
        this.#light.castShadow = true;
        this.#light.shadow.mapSize.width = 512; // default
        this.#light.shadow.mapSize.height = 512; // default
        if (this.#light.shadow.camera instanceof THREE.PerspectiveCamera) {
          this.#light.shadow.camera.near = 0.5; // default
          this.#light.shadow.camera.far = 500; // default
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  /**
   * Retrieves the instance of the light object.
   *
   * This method returns the private `#light` property,
   * which is expected to represent a specific light object or configuration.
   *
   * @function
   * @returns {createLightReturn} The light object associated with this instance.
   */
  getLight = (): createLightReturn => {
    return this.#light;
  };

  /**
   * Retrieves the helper object associated with this instance.
   *
   * @function
   * @returns {THREE.Object3D | undefined} Returns the helper object as a THREE.Object3D instance,
   * or undefined if no helper is defined.
   */
  getHelper = (): createLightHelperReturn => {
    return this.#helper;
  };

  /**
   * Retrieves the current light configuration.
   * @returns {lightConfig} The current light configuration.
   */
  getConfig = (): lightConfig => {
    if (
      this.#light instanceof THREE.DirectionalLight ||
      this.#light instanceof THREE.PointLight ||
      this.#light instanceof THREE.SpotLight
    ) {
      this.#config.position = [this.#light.position.x, this.#light.position.y, this.#light.position.z];
      this.#config.color = this.#light.color.getHex();
      this.#config.intensity = this.#light.intensity;
    }
    if (this.#light instanceof THREE.HemisphereLight) {
      this.#config.color = this.#light.color.getHex();
      this.#config.intensity = this.#light.intensity;
      this.#config.skyColor = this.#light.color.getHex();
      this.#config.groundColor = this.#light.groundColor.getHex();
    }
    if (this.#light instanceof THREE.RectAreaLight) {
      this.#config.color = this.#light.color.getHex();
      this.#config.intensity = this.#light.intensity;
      this.#config.width = this.#light.width;
      this.#config.height = this.#light.height;
    }
    if (this.#light instanceof THREE.AmbientLight) {
      this.#config.color = this.#light.color.getHex();
      this.#config.intensity = this.#light.intensity;
    }
    return this.#config;
  };

  /**
   * Set a new light configuration.
   *
   * @param {lightConfig} config - The new configuration for the light.
   * @returns {void}
   */
  setNewLight = (config: lightConfig): void => {
    this.#config = config;
    this.#light = createLight(config);
    this.#helper = this.#createHelper();
  };

  /**
   * Returns the type of light based on the configuration.
   * @returns {lightTypeEnum} The type of light.
   */
  getLightType = (): lightTypeEnum => {
    return this.#config.type;
  };

  /**
   * Retrieves the position of the light source.
   *
   * @returns {THREE.Vector3} The position of the light source. If the light is of type DirectionalLight, PointLight, or SpotLight,
   * it returns the cloned position of the light; otherwise, it returns a new Vector3 instance.
   */
  getLightPosition = (): THREE.Vector3 => {
    if (
      this.#light instanceof THREE.DirectionalLight ||
      this.#light instanceof THREE.PointLight ||
      this.#light instanceof THREE.SpotLight
    ) {
      return this.#light.position.clone();
    }
    return new THREE.Vector3();
  };

  /**
   * Set the position of the light.
   * @param {THREE.Vector3} newPosition - The new position to set the light to.
   * @returns {void}
   */
  setLightPosition = (newPosition: THREE.Vector3): void => {
    if (
      this.#light instanceof THREE.DirectionalLight ||
      this.#light instanceof THREE.PointLight ||
      this.#light instanceof THREE.SpotLight ||
      this.#light instanceof THREE.RectAreaLight ||
      this.#light instanceof THREE.HemisphereLight ||
      this.#light instanceof THREE.AmbientLight
    ) {
      this.#light.position.set(newPosition.x, newPosition.y, newPosition.z);
    }
  };

  /**
   * Set the color of the light.
   * @param {number} newColor - The new color to set the light to.
   * @returns {void}
   */
  setLightColor = (newColor: number): void => {
    if (
      this.#light instanceof THREE.DirectionalLight ||
      this.#light instanceof THREE.PointLight ||
      this.#light instanceof THREE.SpotLight ||
      this.#light instanceof THREE.RectAreaLight ||
      this.#light instanceof THREE.HemisphereLight ||
      this.#light instanceof THREE.AmbientLight
    ) {
      this.#light.color = new THREE.Color(newColor);
    }
  };

  /**
   * Set the color of the sky for a 3D scene.
   * @param {number} newSkyColor - The new color in hexadecimal format to set as the sky color.
   * @returns {void}
   */
  setSkyColor = (newSkyColor: number): void => {
    if (this.#light instanceof THREE.HemisphereLight) {
      this.#light.color = new THREE.Color(newSkyColor);
    }
  };

  /**
   * Set the color of the ground for a 3D scene.
   * @param {number} newGroundColor - The new color in hexadecimal format to set as the ground color.
   * @returns {void}
   */
  setGroundColor = (newGroundColor: number): void => {
    if (this.#light instanceof THREE.HemisphereLight) {
      this.#light.groundColor = new THREE.Color(newGroundColor);
    }
  };

  /**
   * Set the intensity of the light.
   * @param {number} newIntensity - The new intensity to set the light to.
   * @returns {void}
   */
  setLightIntensity = (newIntensity: number): void => {
    if (
      this.#light instanceof THREE.DirectionalLight ||
      this.#light instanceof THREE.PointLight ||
      this.#light instanceof THREE.SpotLight ||
      this.#light instanceof THREE.RectAreaLight ||
      this.#light instanceof THREE.HemisphereLight ||
      this.#light instanceof THREE.AmbientLight
    ) {
      this.#light.intensity = newIntensity;
    }
  };

  /**
   * Set the new size of the RectAreaLight.
   * @param {number} newWidth - The new width to set the RectAreaLight to.
   * @param {number} newHeight - The new height to set the RectAreaLight to.
   * @returns {void}
   */
  setNewRectAreaLightSize = (newWidth: number, newHeight: number): void => {
    if (this.#light instanceof THREE.RectAreaLight) {
      this.#light.width = newWidth;
      this.#light.height = newHeight;
    }
  };

  /**
   * Toggles the visibility of a light object based on the provided state.
   *
   * @function
   * @param {boolean} on - A boolean value indicating whether the light should be turned on (true) or off (false).
   * @param onHelper - A boolean value indicating whether the lightHelper should be turned on (true) or off (false).
   */
  switch = (on: boolean, onHelper: boolean): void => {
    if (this.#light) {
      this.#light.visible = on;
      if (this.#helper) {
        this.#helper.visible = on ? onHelper : false;
      }
    }
  };

  /**
   * Determines whether the light is currently visible and active.
   *
   * @function
   * @returns {boolean} Returns true if the light is visible and active; otherwise, returns false.
   */
  isOn = (): boolean => {
    if (this.#light) {
      return this.#light.visible;
    }
    return false;
  };

  /**
   * Creates a helper object for the associated light instance, if applicable.
   *
   * This method checks the type of the private `#light` property and returns an
   * appropriate helper object from the THREE.js library based on the light type.
   * Supported types include:
   * - DirectionalLight: Returns a `THREE.DirectionalLightHelper` with a size of 5.
   * - PointLight: Returns a `THREE.PointLightHelper` with a size of 1.
   * - SpotLight: Returns a `THREE.SpotLightHelper`.
   * - HemisphereLight: Returns a `THREE.HemisphereLightHelper` with a size of 5.
   *
   * If the light type is not supported or the `#light` property is undefined,
   * this method returns `undefined`.
   *
   * @returns {createLightHelperReturn} A helper object for the light, or `undefined` if the light type is unsupported or undefined.
   */
  readonly #createHelper = (): createLightHelperReturn => {
    if (this.#light instanceof THREE.DirectionalLight) {
      return new THREE.DirectionalLightHelper(this.#light, 0.2);
    }
    if (this.#light instanceof THREE.PointLight) {
      return new THREE.PointLightHelper(this.#light);
    }
    if (this.#light instanceof THREE.SpotLight) {
      return new THREE.SpotLightHelper(this.#light);
    }
    if (this.#light instanceof THREE.HemisphereLight) {
      return new THREE.HemisphereLightHelper(this.#light, 5);
    }
    return undefined;
  };
}
