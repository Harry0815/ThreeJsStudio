import * as THREE from 'three';
import { preparedConstructReturn } from './construct';

/**
 * Interface representing support for handling mouse-related events.
 *
 * This interface includes configurations for mouse interactions,
 * such as handling click events on a specific container.
 *
 * Properties:
 * - container: Object that contains the mouse event handling logic for the designated container.
 *   - onClick: A function that is triggered when a click event occurs within the container.
 *              It receives a MouseEvent object as its argument.
 */
export interface handleMouseSupport {
  container: {
    onClick: (event: MouseEvent) => void;
  };
}

/**
 * Checks if the given object has mouse support by determining the presence
 * of a `container` property.
 *
 * @param {unknown} obj - The object to be checked for mouse support.
 * @returns {boolean} - Returns `true` if the object supports mouse interactions, otherwise `false`.
 */
export const hasMouseSupportSupport = (obj: unknown): obj is handleMouseSupport => {
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
 *          event handler, enabling interaction with 3D objects in the scene.
 */
export const mouseSupport = (prep: preparedConstructReturn | undefined): handleMouseSupport => {
  if (!prep) {
    return {
      container: {
        onClick: (_event: MouseEvent): void => {
          //
        },
      },
    };
  }

  const raycaster = new THREE.Raycaster();
  const mouseVector = new THREE.Vector2();

  const onClick = (event: MouseEvent): void => {
    if (prep.basicControls.camera.camera) {
      const rect = prep.renderer.domElement.getBoundingClientRect();
      mouseVector.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseVector.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouseVector, prep.basicControls.camera.camera);
      const intersects = raycaster.intersectObject(prep.basicControls.scene, true);
      if (intersects.length > 0) {
        for (const m of intersects) {
          if ((m.object as unknown) instanceof THREE.Mesh) {
            console.log('Mesh', m.object);
          }
        }
      }
    }
  };

  return {
    container: {
      onClick: onClick,
    },
  };
};
