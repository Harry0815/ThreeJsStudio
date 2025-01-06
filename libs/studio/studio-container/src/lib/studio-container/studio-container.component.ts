import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, HostListener, OnInit, viewChild } from '@angular/core';
import {
  construct,
  handleMouseSupport,
  hasMouseSupport,
  ishandleMaterialSupport,
  Light,
  lightTypeEnum,
  prepareConstruct,
  preparedConstructReturn,
} from '@three-js-studio/three-utils';
import * as THREE from 'three';
import { glbScene } from '../prepared-scenes/glb-scene';
import { ground } from '../prepared-scenes/ground';
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

  #actualConstructedScene = '';

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
    this.#testFunction();
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
   * Handles the 'click' event on the host element.
   *
   * @param {MouseEvent} _event - The mouse event triggering the click.
   *
   * @return {void}
   */
  @HostListener('click', ['$event'])
  onClick(_event: MouseEvent): void {
    const scene = this.#preparedConstruct?.getConstructedScene(this.#actualConstructedScene);
    if (hasMouseSupport(scene)) {
      (scene as handleMouseSupport).container.onClick(_event);
    }
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
    if (this.#preparedConstruct) {
      this.#preparedConstruct.updateCameraWindowSize(newWidth, newHeight);
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
  #testFunction(): void {
    console.log('testFunction');

    // this.#preparedConstruct?.addConstructedScene('ground', ground());
    this.#preparedConstruct?.addConstructedScene('rotationCube', constructRotationCube());
    const groundFloor = ground(this.#preparedConstruct?.basicControls.scene ?? new THREE.Scene());
    this.#preparedConstruct?.addConstructedScene('ground', groundFloor);

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
      position: [0, 10, 0],
    });
    const directionalLight = new Light({
      type: lightTypeEnum.Directional,
      color: 0xffffff,
      intensity: 0.3 * Math.PI,
      position: [5, 10, 10],
    });

    this.#preparedConstruct?.addLight('ambient', ambientLight);
    this.#preparedConstruct?.addLight('hemisphere', hemisphereLight);
    this.#preparedConstruct?.addLight('direct', directionalLight);
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
        minDistance: 1,
      });

      this.#preparedConstruct.animate((_renderer: THREE.WebGLRenderer, _scene: THREE.Scene, _camera: THREE.Camera) => {
        // addContent(scene);
      });
    }
    this.#updateRendererSize();
  }

  /**
   * Handles the click event on the canvas.
   * Executes specific actions, such as logging the event
   * and resetting the constructed scene if a prepared construct exists.
   *
   * @return {void} Does not return a value.
   */
  resetCanvas(): void {
    console.log('resetCanvas');
    this.#preparedConstruct?.resetConstructedScene();
  }

  /**
   * Handles the click event to change the color and material properties of a specific 3D object in the scene.
   * Updates the material of the designated 3D model with predefined properties such as color, roughness, clearcoat, and metalness.
   * @return {void} Does not return any value.
   */
  clickChangeColor(): void {
    console.log('clickChangeColor', this.#actualConstructedScene);
    const scene = this.#preparedConstruct?.getConstructedScene(this.#actualConstructedScene);
    if (ishandleMaterialSupport(scene)) {
      const mesh = new THREE.MeshPhysicalMaterial({
        color: 0xaf2010,
        roughness: 100,
        clearcoat: 1.0,
        clearcoatRoughness: 0.5,
        metalness: 0.9,
      });
      scene.setMaterial(mesh);
    }
  }

  /**
   * Switches the current scene to the "lotus" scene by loading the specified 3D model file.
   *
   * @return {Promise<void>} A promise that resolves when the "lotus" scene has been successfully loaded.
   */
  async switchToLotus(): Promise<void> {
    const scene = this.#preparedConstruct?.getConstructedScene(this.#actualConstructedScene);
    if (scene) {
      scene.visible(false);
    }

    this.#actualConstructedScene = 'lotus.glb';
    await this.#sitchToScene(this.#actualConstructedScene);
  }

  /**
   * Switches the scene to display a cube.
   * This method asynchronously transitions to a predefined cube view
   * represented by the 'cube/viewCube.glb' file.
   *
   * @return {Promise<void>} A promise that resolves when the scene has successfully switched.
   */
  async switchToCube(): Promise<void> {
    const scene = this.#preparedConstruct?.getConstructedScene(this.#actualConstructedScene);
    if (scene) {
      scene.visible(false);
    }

    this.#actualConstructedScene = 'cube/viewCube.glb';
    await this.#sitchToScene(this.#actualConstructedScene);
  }

  /**
   * Switches to the specified scene by its key. If the scene is not already constructed,
   * it will load and construct it. Makes the specified scene, the ground floor, and
   * the rotation cube visible while resetting other constructed scenes.
   *
   * @param {string} key - The unique identifier for the scene to switch to.
   * @return {Promise<void>} Resolves when the scene switching process is complete.
   */
  async #sitchToScene(key: string): Promise<void> {
    this.#preparedConstruct?.switchAllConstructedScenes(false);
    let scene = this.#preparedConstruct?.getConstructedScene(key);
    if (!scene) {
      scene = await glbScene(
        key,
        new THREE.MeshPhysicalMaterial({
          color: 0xafcb10,
          roughness: 0.5,
          clearcoat: 1.0,
          clearcoatRoughness: 0.5,
          metalness: 0.5,
        }),
        this.#preparedConstruct,
      );
      this.#preparedConstruct?.addConstructedScene(key, scene);
    }
    const groundFloor = this.#preparedConstruct?.getConstructedScene('ground');
    const rotationCube = this.#preparedConstruct?.getConstructedScene('rotationCube');

    if (groundFloor) {
      if (scene.boundingBox) {
        groundFloor.reCalculateDimensions(scene.boundingBox);
      }
    }
    this.#preparedConstruct?.resetConstructedScene();
    groundFloor?.visible(true);
    scene.visible(true);
    rotationCube?.visible(true);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    if (this.#preparedConstruct.contentSupport.contentGroup && rotationCube?.contentSupport.contentGroup) {
      this.#preparedConstruct?.contentSupport.handleEffectsSupport.tweenPrepareFirstPosition(
        [this.#preparedConstruct.contentSupport.contentGroup, rotationCube.contentSupport.contentGroup],
        1000,
      );
    }
  }
}
