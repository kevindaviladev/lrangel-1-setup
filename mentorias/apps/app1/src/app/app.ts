import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Card } from '@mentorias/ui-components';

@Component({
  imports: [Card, RouterModule],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected title = 'app1';
}
