import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, HostListener, OnInit, viewChild } from '@angular/core';
import * as THREE from 'three';
import {
  construct,
  Light,
  lightTypeEnum,
  prepareConstruct,
  preparedConstructReturn,
  preparedSceneReturn
} from 'three-utils';
import { cube } from '../prepared-scenes/cube';
import { constructRotationCube } from '../prepared-scenes/rotation-cube';

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
  ngOnInit(): void {
    if (!this.canvasElement()) {
      return;
    }

    const constConstruct = construct(1, 1);
    this.#preparedConstruct = prepareConstruct(constConstruct, this.canvasElement()?.nativeElement);
    this.#updateRendererSize();
    void this.#testFunction();
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

    this.#preparedConstruct?.addConstructedScene('rotationCube', constructRotationCube());
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const cubeScene: preparedSceneReturn = await cube();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    cubeScene.setMaterial(
      new THREE.MeshStandardMaterial({
        color: 0xafbb1c,
        roughness: 0.5,
        metalness: 0.5,
      }),
    );
    this.#preparedConstruct?.addConstructedScene('cube-glb', cubeScene);

    const boundingBoxEdge = 1;

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
    // this.#preparedConstruct?.deleteLight('standard');
    this.#preparedConstruct?.switchAllLights(true, true);

    if (this.#preparedConstruct) {
      const cp = this.#preparedConstruct.basicControls.camera.getPosition();
      cp.z = 5;
      this.#preparedConstruct.basicControls.camera.setPosition(cp);
    }
    if (this.#preparedConstruct) {
      this.#preparedConstruct.prepareOrbitControls({
        enabled: true,
        enablePan: false,
        enableRotate: true,
        enableZoom: true,
        minDistance: boundingBoxEdge,
      });

      this.#preparedConstruct.animate((_renderer: THREE.WebGLRenderer, _scene: THREE.Scene, _camera: THREE.Camera) => {
        // console.log('animate');
      });
    }
    this.#updateRendererSize();
  }

  /**
   * Creates and returns a ground floor mesh object using THREE.js.
   * The ground floor is represented as a plane geometry with a standard material.
   *
   * @returns {THREE.Group} A group object representing the ground floor.
   */
  #createGroundFloor(): THREE.Group {
    console.log('createGroundFloor');
    const geometry = new THREE.PlaneGeometry(10, 10);
    geometry.rotateX(-Math.PI / 2); // .15);
    const material = new THREE.MeshStandardMaterial({
      color: 0x0f0f1f,
      side: THREE.DoubleSide,
    });
    const ground = new THREE.Mesh(geometry, material);
    ground.receiveShadow = true;
    return new THREE.Group().add(ground);
  }
}
