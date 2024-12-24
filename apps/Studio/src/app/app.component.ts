import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { StudioContainerComponent } from '@three-js-studio/StudioContainer';

/**
 * Represents the root component for the studio.
 */
@Component({
  standalone: true,
  imports: [RouterModule, StudioContainerComponent],
  selector: 'hss-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'Studio';
}
