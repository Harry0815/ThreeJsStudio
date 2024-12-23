import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NxWelcomeComponent } from './nx-welcome.component';
import { StudioContainerComponent } from '@three-js-studio/StudioContainer';

@Component({
  standalone: true,
  imports: [NxWelcomeComponent, RouterModule, StudioContainerComponent],
  selector: 'hss-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'Studio';
}
