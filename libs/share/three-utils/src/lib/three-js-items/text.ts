import * as THREE from 'three';
import { FontLoader, TextGeometry } from 'three-stdlib';

export const createTextLabel = (
  fontName: string,
  text: string,
  position: THREE.Vector3,
  color = 0xffffff,
  scene: THREE.Group,
): void => {
  const loader = new FontLoader();

  loader.load(`three-fonts/${fontName}`, (font) => {
    const textGeometry = new TextGeometry(text, {
      font: font,
      size: 10,
      height: 1,
      curveSegments: 12,
      bevelEnabled: false,
    });

    const textMaterial = new THREE.MeshBasicMaterial({ color: color });
    const textMesh = new THREE.Mesh(textGeometry, textMaterial);

    textMesh.position.copy(position);
    scene.add(textMesh);
  });
};
