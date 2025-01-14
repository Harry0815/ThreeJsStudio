import * as THREE from 'three';
import { preparedConstructReturn, preparedSceneReturn } from './construct';
import { traverseGroup } from './share';

/**
 * Interface representing the return type of an analysis function.
 * This interface specifies the data structures that hold references to 3D objects,
 * such as groups, meshes, and materials.
 *
 * @interface analyseReturn
 * @property {Map<string, THREE.Group>} groups - A map that associates string identifiers with THREE.Group objects.
 * @property {Map<string, THREE.Mesh>} meshes - A map that associates string identifiers with THREE.Mesh objects.
 * @property {Map<string, THREE.Material>} materials - A map that associates string identifiers with THREE.Material objects.
 */
export interface analyseReturn {
  analyse: {
    groups: Map<string, THREE.Group>;
    meshes: Map<string, THREE.Mesh>;
    materials: Map<string, THREE.Material>;
  };
}

export const analyse = (model: THREE.Group): analyseReturn => {
  const mapGroups = new Map<string, THREE.Group>();
  const mapMeshes = new Map<string, THREE.Mesh>();
  const mapMaterials = new Map<string, THREE.Material>();

  const groups = (model: THREE.Group): void => {
    mapGroups.set(model.uuid, model);

    traverseGroup(model, (obj: THREE.Object3D) => {
      if (obj instanceof THREE.Group) {
        mapGroups.set(obj.uuid, obj as THREE.Group);
        groups(obj as THREE.Group);
      }
      if ((obj as unknown) instanceof THREE.Mesh) {
        mapMeshes.set(obj.uuid, obj as THREE.Mesh);
        if ((obj as THREE.Mesh).material instanceof Array) {
          ((obj as THREE.Mesh).material as THREE.Material[]).forEach((m: THREE.Material) => {
            mapMaterials.set(m.uuid, m);
          });
        } else {
          const m = (obj as THREE.Mesh).material as THREE.Material;
          mapMaterials.set(m.uuid, m);
        }
      }
    });
  };

  groups(model);

  console.log('objGroups', mapGroups.keys());
  console.log('objMeshes', mapMeshes.keys());
  console.log('objMaterials', mapMaterials.keys());

  return {
    analyse: {
      groups: mapGroups,
      meshes: mapMeshes,
      materials: mapMaterials,
    },
  };
};

export const hasAnalyseSupport = (obj: unknown): obj is analyseReturn => {
  if (obj === undefined) {
    return false;
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  return (obj as object).analyse !== undefined;
};

export const addAnalyseSupport = (
  scene: preparedSceneReturn,
  construct: preparedConstructReturn | undefined,
): preparedSceneReturn => {
  if (hasAnalyseSupport(scene)) {
    return scene;
  }
  if (construct && scene.contentGroup) {
    return {
      ...scene,
      ...analyse(scene.contentGroup),
    };
  }
  return scene;
};
