import { Component } from '@angular/core';

@Component({
  selector: 'lib-web1',
  imports: [],
  templateUrl: './web1.html',
  styleUrl: './web1.css',
})
export class Web1 {
  ngOnInit() {
    console.log('Hello from web1');
  }

  computeProps() {
    console.log('computing...');
    setTimeout(() => {
      alert('Hey!');
    }, 3000);
  }

  computePropsII() {
    console.log('computing II...');
    setTimeout(() => {
      alert('Hey II!');
    }, 1000);
  }
}
