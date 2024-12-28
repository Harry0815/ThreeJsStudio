import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, HostListener, OnInit, viewChild } from '@angular/core';
import * as THREE from 'three';
import { GLTF } from 'three-stdlib';
import { construct, glbLoader, Light, lightTypeEnum, prepareConstruct, preparedConstructReturn } from 'three-utils';

/**
 * Represents the container component for the studio.
 */
@Component({
  selector: 'hss-studio-container',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './studio-container.component.html',
  styleUrl: './studio-container.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudioContainerComponent implements OnInit {
  /**
   * Represents a reference to a canvas element in the HTML DOM.
   */
  canvasElement = viewChild<ElementRef<HTMLCanvasElement>>('canvasElement');

  /**
   * Represents the prepared construct for the studio.
   */
  #preparedConstruct: preparedConstructReturn | undefined = undefined;

  #rendererWidth = 1;
  #rendererHeight = 1;

  /**
   * Initializes the component and prepares the construct if the canvas element is available.
   *
   * This method ensures the canvas element is present before proceeding. It initializes
   * a construct with specific parameters and prepares it using the canvas element's native reference.
   *
   * @return {void} Does not return a value.
   */
  async ngOnInit(): void {
    if (!this.canvasElement()) {
      return;
    }

    const constConstruct = construct(1, 1);
    this.#preparedConstruct = prepareConstruct(constConstruct, this.canvasElement()?.nativeElement);
    this.#updateRendererSize();
    await this.#testFunction();
  }

  /**
   * This function is triggered on window resize
   *
   * @param _event - The event object triggered on window resize
   */
  @HostListener('window:resize', ['$event'])
  onWindowResize(_event: Event): void {
    this.#updateRendererSize();
  }

  /**
   * Updates the renderer size based on the canvas element's dimensions.
   *
   * This method retrieves the width and height of the canvas element's client area
   * and updates the camera's window size if both dimensions are available.
   *
   * @return {void} Does not return a value.
   */
  #updateRendererSize(): void {
    console.log(
      'updateRendererSize',
      this.canvasElement()?.nativeElement.clientWidth,
      this.canvasElement()?.nativeElement.clientHeight,
    );
    const width = this.canvasElement()?.nativeElement.clientWidth;
    const height = this.canvasElement()?.nativeElement.clientHeight;
    if (width && height) {
      this.#updateCameraWindowSize(width, height);
    }
  }

  /**
   * Updates the internal renderer dimensions and adjusts the camera's aspect ratio and projection matrix.
   *
   * @param newWidth - The new width for the renderer.
   * @param newHeight - The new height for the renderer.
   */
  #updateCameraWindowSize(newWidth: number, newHeight: number): void {
    this.#rendererWidth = newWidth;
    this.#rendererHeight = newHeight;

    console.log('updateCameraWindowSize', this.#rendererWidth, this.#rendererHeight);

    if (this.#preparedConstruct) {
      this.#preparedConstruct.updateCameraWindowSize(this.#rendererWidth, this.#rendererHeight);
    }
  }

  /**
   * A test function to demonstrate the usage of the prepared construct.
   *
   * This function retrieves content based on a specified parameter, creates a ground floor mesh object,
   * a 3D view sphere, and adds light sources to the scene. It also initializes the camera position,
   * sets up the animation loop, and prepares the orbit controls for the scene.
   *
   * @return {Promise<void>} A Promise that resolves when the function completes.
   */
  async #testFunction(): Promise<void> {
    console.log('testFunction');

    let boundingBoxEdge = 1;
    const content = await this.#getContentTest(true);
    if (content) {
      const boundingBox = new THREE.Box3().setFromObject(content);
      boundingBoxEdge = Math.sqrt(
        Math.pow(boundingBox.max.x - boundingBox.min.x, 2) +
          Math.pow(boundingBox.max.y - boundingBox.min.y, 2) +
          Math.pow(boundingBox.max.z - boundingBox.min.z, 2),
      );
      content.position.y = boundingBoxEdge / 2;

      this.#preparedConstruct?.basicControls.scene.add(this.#createGroundFloor());
      this.#preparedConstruct?.basicControls.scene.add(this.#greateViewSphere(boundingBoxEdge));
      this.#preparedConstruct?.basicControls.scene.add(content);

      const ambientLight = new Light({
        type: lightTypeEnum.Ambient,
        color: 0x7f7e80,
        intensity: 0.7 * Math.PI,
        position: [0, 0, 0],
      });
      const hemisphereLight = new Light({
        type: lightTypeEnum.Hemisphere,
        color: 0xfbfcff,
        skyColor: 0xfbfcff,
        groundColor: 0x7e7a80,
        intensity: 0.32 * Math.PI,
        position: [boundingBoxEdge / 2, boundingBoxEdge, 0],
      });
      const directionalLight = new Light({
        type: lightTypeEnum.Directional,
        color: 0xffffff,
        intensity: 0.3 * Math.PI,
        position: [boundingBoxEdge / 2, boundingBoxEdge, boundingBoxEdge],
      });

      this.#preparedConstruct?.addLight('ambient', ambientLight);
      this.#preparedConstruct?.addLight('hemisphere', hemisphereLight);
      this.#preparedConstruct?.addLight('direct', directionalLight);
      this.#preparedConstruct?.deleteLight('standard');
      this.#preparedConstruct?.switchAllLights(true, false);

      if (this.#preparedConstruct) {
        const cp = this.#preparedConstruct.basicControls.camera.getPosition();
        cp.z = 5;
        this.#preparedConstruct.basicControls.camera.setPosition(cp);
      }
      if (this.#preparedConstruct) {
        this.#preparedConstruct.animate(() => {
          content.rotation.x += 0.01;
          content.rotation.y += 0.01;
        });

        this.#preparedConstruct.prepareOrbitControls({
          enabled: true,
          enablePan: false,
          enableRotate: true,
          enableZoom: true,
          minDistance: boundingBoxEdge,
        });
      }
    }
  }

  /**
   * Retrieves content based on the specified parameter.
   *
   * @param {boolean} gltfFile - Indicates whether to load content from a GLTF file.
   * @returns {Promise<THREE.Object3D | undefined>} - A Promise that resolves to a THREE.Object3D instance if successful,
   * or undefined if the content cannot be retrieved.
   */
  async #getContentTest(gltfFile: boolean): Promise<THREE.Object3D | undefined> {
    console.log('getContentTest');
    if (gltfFile) {
      const gltf: GLTF | undefined = await glbLoader(undefined, 'cube/viewCube.glb');
      if (gltf?.scene) {
        return gltf.scene;
      }
      return undefined;
    } else {
      const geometry = new THREE.BoxGeometry(0.5, 1, 0.5);
      geometry.rotateX(-Math.PI / 2.15);
      const material = new THREE.MeshStandardMaterial({ color: 0xfbaa12 });
      const cube = new THREE.Mesh(geometry, material);
      cube.castShadow = true;
      return cube;
    }
  }

  /**
   * Creates and returns a ground floor mesh object using THREE.js.
   * The ground floor is represented as a plane geometry with a standard material.
   *
   * @returns {THREE.Mesh} A mesh object representing the ground floor.
   */
  #createGroundFloor(): THREE.Mesh {
    console.log('createGroundFloor');
    const geometry = new THREE.PlaneGeometry(10, 10);
    geometry.rotateX(-Math.PI / 2.15);
    const material = new THREE.MeshStandardMaterial({
      color: 0x0f0f1f,
      side: THREE.DoubleSide,
    });
    const ground = new THREE.Mesh(geometry, material);
    ground.receiveShadow = true;
    return ground;
  }

  /**
   * Creates a 3D view sphere using a box geometry with edges highlighted.
   *
   * @param {number} edgeLength - The length of the edges of the box geometry.
   * @returns {THREE.LineSegments} A LineSegments object representing the geometry with highlighted edges.
   */
  #greateViewSphere(edgeLength: number): THREE.LineSegments {
    console.log('greateViewSphere');
    const geometry = new THREE.BoxGeometry(edgeLength, edgeLength, edgeLength);
    const edges = new THREE.EdgesGeometry(geometry);
    const material = new THREE.LineBasicMaterial({ color: 0xffff00 });
    const lines = new THREE.LineSegments(edges, material);
    lines.translateY(edgeLength / 2);
    lines.rotateX(-Math.PI / 2.15);
    return lines;
  }
}
