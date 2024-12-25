import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, HostListener, OnInit, viewChild } from '@angular/core';
import { construct, prepareConstruct, preparedConstructReturn } from 'three-utils';

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
    console.log('updateCameraWindowSize', newHeight, newWidth);

    this.#rendererWidth = newWidth;
    this.#rendererHeight = newHeight;

    if (this.#preparedConstruct) {
      this.#preparedConstruct.basicControls.camera.updateCameraWindowSize(newWidth, newHeight);
      this.#preparedConstruct.renderer.setSize(this.#rendererWidth, this.#rendererHeight);
    }
  }
}
