import JEASINGS from 'jeasings';
import * as THREE from 'three';

export interface handleEffectsSupport {
  tweenChangeMaterial: (
    material: THREE.MeshPhysicalMaterial | undefined,
    destMaterial: THREE.MeshPhysicalMaterial | undefined,
    duration: number,
  ) => void;
  tweenPrepareFirstPosition: (
    scene: THREE.Scene | THREE.Group | undefined,
    duration: number,
    callback: (rotation: THREE.Euler | undefined) => void,
  ) => void;
}

export const hasEffectsSupport = (obj: unknown): obj is handleEffectsSupport => {
  if (obj === undefined) {
    return false;
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  return (obj as object).tweenChangeMaterial !== undefined;
};

export const effects = (): handleEffectsSupport => {
  const changeMaterial = (
    material: THREE.MeshPhysicalMaterial | undefined,
    destMaterial: THREE.MeshPhysicalMaterial | undefined,
    duration: number,
  ): void => {
    if (material && destMaterial) {
      const tween = new JEASINGS.JEasing(material.color)
        .to({ r: destMaterial.color.r, g: destMaterial.color.g, b: destMaterial.color.b }, duration)
        .easing(JEASINGS.Linear.None)
        .chain(new JEASINGS.JEasing(material).to({ metalness: destMaterial.metalness }, duration))
        .chain(new JEASINGS.JEasing(material).to({ roughness: destMaterial.roughness }, duration))
        .chain(new JEASINGS.JEasing(material).to({ clearcoat: destMaterial.clearcoat }, duration))
        .chain(new JEASINGS.JEasing(material).to({ clearcoatRoughness: destMaterial.clearcoatRoughness }, duration));
      tween.start();
    }
  };

  const prepareFirstPosition = (
    scene: THREE.Scene | THREE.Group | undefined,
    duration: number,
    callback: (rotation: THREE.Euler | undefined) => void,
  ): void => {
    if (!scene) {
      return;
    }
    const rotation = new THREE.Euler(0, 0, 0);
    const tween = new JEASINGS.JEasing(rotation)
      .to({ x: Math.PI * 0.2, y: Math.PI * -0.15, z: 0 }, duration)
      .easing(JEASINGS.Sinusoidal.InOut)
      .onComplete(() => {
        callback(undefined);
        console.log('completed');
      })
      .onUpdate(() => {
        const qa = new THREE.Quaternion().setFromEuler(rotation);
        scene.rotation.setFromQuaternion(qa);
        callback(rotation);
      });
    tween.start();
  };

  return {
    tweenChangeMaterial: changeMaterial,
    tweenPrepareFirstPosition: prepareFirstPosition,
  };
};
