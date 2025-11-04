import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Ubigeo } from '../../components/ubigeo/ubigeo';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-other-page',
  imports: [Ubigeo, ReactiveFormsModule, JsonPipe],
  templateUrl: './other-page.html',
  styleUrl: './other-page.css',
})
export class OtherPage {

  form = new FormGroup({
    prueba: new FormGroup({
      departamento: new FormControl(''),
      provincia: new FormControl(''),
      distrito: new FormControl('')
    })
  });

}
