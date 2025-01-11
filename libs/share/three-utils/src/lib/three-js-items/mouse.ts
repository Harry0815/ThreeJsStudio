import * as THREE from 'three';
import {
  handleMaterialSupport,
  ishandleMaterialSupport,
  preparedConstructReturn,
  preparedSceneReturn,
} from './construct';

/**
 * Represents an interface for handling mouse event support.
 *
 * This interface defines properties for dealing with mouse events
 * such as clicks and movement within a specified container.
 *
 * @interface handleMouseSupport
 * @property {Object} container - Object containing event handling functions for mouse interactions.
 * @property {Function} container.onClick - Function to handle the `click` event triggered when the mouse is clicked.
 * @property {Function} container.onMouseMove - Function to handle the `mousemove` event triggered when the mouse moves.
 */
export interface handleMouseSupport {
  container: {
    onClick: (event: MouseEvent, scene: preparedSceneReturn) => void;
    onMouseMove: (event: MouseEvent, scene: preparedSceneReturn) => void;
  };
}

/**
 * Checks if the given object has mouse support by determining the presence
 * of a `container` property.
 *
 * @param {unknown} obj - The object to be checked for mouse support.
 * @returns {boolean} - Returns `true` if the object supports mouse interactions, otherwise `false`.
 */
export const hasMouseSupport = (obj: unknown): obj is handleMouseSupport => {
  if (obj === undefined) {
    return false;
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  return (obj as object).container !== undefined;
};

/**
 * Function to handle mouse support for 3D scenes using the THREE.js library.
 *
 * This function provides event handling functionality for mouse clicks, allowing interaction
 * with 3D objects and camera within a scene. It optionally accepts a `preparedConstructReturn`
 * object used to initialize the 3D scene, or defaults to a minimal mouse event handler if no
 * argument is provided.
 *
 * The function utilizes a `Raycaster` to calculate intersections between mouse projection
 * and 3D objects within the scene.
 *
 * @param {preparedConstructReturn | undefined} prep - An optional object containing pre-configured
 *        elements for the 3D scene, such as the camera, renderer, and scene setup. If undefined,
 *        a default onClick handler is provided.
 * @returns {handleMouseSupport} An object containing a `container` property with an `onClick`
 *          and mouseMove event handler, enabling interaction with 3D objects in the scene.
 */
export const mouseSupport = (prep: preparedConstructReturn | undefined): handleMouseSupport => {
  if (!prep) {
    return {
      container: {
        onClick: (_event: MouseEvent): void => {
          //
        },
        onMouseMove: (_event: MouseEvent): void => {
          //
        },
      },
    };
  }

  const raycaster = new THREE.Raycaster();
  const raycasterMove = new THREE.Raycaster();
  const mouseVector = new THREE.Vector2();
  const mouseVectorMove = new THREE.Vector2();

  let storedMeshUUID = '';

  /**
   * Handles the onClick event for processing mouse interactions with the scene.
   *
   * This function calculates the mouse position in normalized device coordinates
   * (NDC) relative to the rendering area and uses a raycaster to detect intersections
   * with objects in the scene. If intersections are found, it handles those that
   * involve THREE.Mesh objects.
   *
   * @param event The MouseEvent triggered by clicking in the rendering area.
   * @param _scene An object containing the prepared scene data, used for interaction logic.
   */
  const onClick = (event: MouseEvent, _scene: preparedSceneReturn): void => {
    if (prep.basicControls.camera.camera) {
      const rect = prep.renderer.domElement.getBoundingClientRect();
      mouseVector.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseVector.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouseVector, prep.basicControls.camera.camera);
      const intersects = raycaster.intersectObject(prep.basicControls.scene, true);
      if (intersects.length > 0) {
        for (const m of intersects) {
          if ((m.object as unknown) instanceof THREE.Mesh) {
            console.log('Mesh click', m.object);
          }
        }
      }
    }
  };

  /**
   * Handles the mouse movement event on the canvas to facilitate interactive scene manipulation.
   *
   * This method calculates the position of the mouse relative to the canvas, updates the raycaster
   * to detect intersections with objects in the scene, and performs various operations such as
   * highlighting objects, resetting materials, and managing interaction states. The function checks
   * for specific object interactions using the mouse and adjusts the corresponding visual properties
   * of the objects in the 3D scene.
   *
   * @param {MouseEvent} event - The mouse movement event containing information about the cursor's
   * position and the interaction context.
   * @param {preparedSceneReturn} scene - The prepared scene object containing the necessary setup
   * for rendering and interaction, including materials and camera positioning.
   *
   * @returns {void} No return value. The function modifies the visual properties of the objects in
   * the scene based on mouse movement and raycaster intersection.
   */
  const onMouseMove = (event: MouseEvent, scene: preparedSceneReturn): void => {
    if (prep.basicControls.camera.camera) {
      const rect = prep.renderer.domElement.getBoundingClientRect();
      mouseVectorMove.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseVectorMove.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycasterMove.setFromCamera(mouseVectorMove, prep.basicControls.camera.camera);
      const intersects = raycasterMove.intersectObject(prep.basicControls.scene, true);
      if (intersects.length > 0) {
        for (const m of intersects) {
          if ((m.object as unknown) instanceof THREE.Mesh) {
            const mesh = m.object as THREE.Mesh;
            if (mesh.uuid === storedMeshUUID) {
              return;
            }
            storedMeshUUID = mesh.uuid;
          }
        }
      } else {
        if (storedMeshUUID === '') {
          return;
        }
      }

      // Reset color
      if (ishandleMaterialSupport(scene)) {
        const resetMaterial = (scene as handleMaterialSupport).actualMaterial;
        if (resetMaterial) {
          prep.basicControls.scene.traverse((object) => {
            if (object instanceof THREE.Mesh) {
              if (object.material instanceof Array) {
                for (let i = 0; i < object.material.length; i++) {
                  object.material[i] = resetMaterial as THREE.Material;
                }
              } else {
                object.material = resetMaterial as THREE.Material;
              }
            }
          });
        }

        if (intersects.length > 0) {
          for (const m of intersects) {
            if ((m.object as unknown) instanceof THREE.Mesh) {
              const mesh = m.object as THREE.Mesh;
              if (!mesh.visible) continue;
              if (resetMaterial) {
                const markMaterial = resetMaterial.clone();
                markMaterial.color.addScalar(1);
                if (mesh.material instanceof Array) {
                  for (let i = 0; i < mesh.material.length; i++) {
                    mesh.material[i] = markMaterial;
                  }
                } else {
                  mesh.material = markMaterial;
                }
                break;
              }
            }
          }
        }
        storedMeshUUID = '';
      }
    }
  };

  return {
    container: {
      onClick: onClick,
      onMouseMove: onMouseMove,
    },
  };
};

/**
 * Enhances the given scene with mouse support if not already present.
 *
 * This function checks whether the provided scene already includes mouse support.
 * If mouse support is absent and a construct is provided, it merges the scene
 * with the necessary mouse support features generated from the construct.
 * If no construct is provided, the original scene is returned unmodified.
 *
 * @param {preparedSceneReturn} scene - The prepared scene to be evaluated and potentially enhanced.
 * @param {preparedConstructReturn | undefined} construct - An optional construct used to generate
 *                                                          mouse support features for the scene.
 * @returns {preparedSceneReturn} - The resulting scene, enhanced with mouse support if applicable.
 */
export const addMouseSupport = (
  scene: preparedSceneReturn,
  construct: preparedConstructReturn | undefined,
): preparedSceneReturn => {
  if (hasMouseSupport(scene)) {
    return scene;
  }
  if (!construct) {
    return scene;
  }
  return {
    ...scene,
    ...mouseSupport(construct),
  };
};
