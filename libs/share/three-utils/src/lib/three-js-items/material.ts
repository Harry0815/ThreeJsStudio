import * as THREE from 'three';
import { preparedConstructReturn, preparedSceneReturn } from './construct';
import { traverseGroup } from './share';

/**
 * Interface for handling material support operations.
 *
 * Provides methods to set and manage the material used in rendering processes.
 *
 * Methods:
 * - setMaterial: Sets the material to be used.
 */
export interface handleMaterialSupport {
  materialSupportContainer: {
    actualMaterial: THREE.MeshPhysicalMaterial | undefined;
    setMaterial: (_material: THREE.MeshPhysicalMaterial) => void;
    changeMaterial: (_material: THREE.MeshPhysicalMaterial) => void;
  };
}

/**
 * Determines if the given object is of type `handleMaterialSupport`.
 *
 * This function performs a check to verify if the provided object
 * includes the `setMaterial` property, which suggests it matches
 * the expected shape for the `handleMaterialSupport` type.
 *
 * @param obj - The object to be checked.
 * @returns A boolean indicating whether the object is of type `handleMaterialSupport`.
 */
export const hasMaterialSupport = (obj: unknown): obj is handleMaterialSupport => {
  if (obj === undefined) {
    return false;
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  return (obj as object).materialSupportContainer !== undefined;
};

export const materialSupport = (scene: preparedSceneReturn): handleMaterialSupport => {
  let actualMaterial: THREE.MeshPhysicalMaterial | undefined;

  return {
    materialSupportContainer: {
      actualMaterial,

      /**
       * Sets the material for the 3D object or mesh and applies it to all child meshes within the specified group.
       *
       * @param {THREE.MeshPhysicalMaterial} material - The material to set, which will be cloned and applied to meshes.
       * @return {void} Does not return a value.
       */
      setMaterial(material: THREE.MeshPhysicalMaterial): void {
        if (!this.actualMaterial) {
          this.actualMaterial = material.clone();
          if (scene.contentGroup) {
            traverseGroup(scene.contentGroup, (child) => {
              if ((child as unknown) instanceof THREE.Mesh) {
                const m = child as THREE.Mesh;
                if (this.actualMaterial) {
                  m.material = this.actualMaterial;
                }
              }
            });
          }
        }
      },
      /**
       * Changes the material of a 3D object to the specified material.
       *
       * @param {THREE.MeshPhysicalMaterial} material - The new material to apply to the object.
       * @return {void} This method does not return a value.
       */
      changeMaterial(material: THREE.MeshPhysicalMaterial): void {
        console.log('changeMaterial', material);
      },
    },
  };
};

export const addMaterialSupport = (
  scene: preparedSceneReturn,
  construct: preparedConstructReturn | undefined,
): preparedSceneReturn => {
  if (hasMaterialSupport(scene)) {
    return scene;
  }
  if (!construct) {
    return scene;
  }
  return {
    ...scene,
    ...materialSupport(scene),
  };
};
