import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Web1 } from '@mentorias/web1';
import { Web2 } from '@mentorias/web2';
import { Web3 } from '@mentorias/web3';

@Component({
  imports: [RouterModule, Web1, Web2, Web3],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected title = 'app1';
}
