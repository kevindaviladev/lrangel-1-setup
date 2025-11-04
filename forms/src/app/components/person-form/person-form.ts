import { JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ControlContainer, FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Ubigeo } from "../ubigeo/ubigeo";

@Component({
  selector: 'app-person-form',
  imports: [ReactiveFormsModule, JsonPipe, Ubigeo],
  templateUrl: './person-form.html',
  styleUrl: './person-form.css',
  viewProviders: [
    // TODO: Review this: app.routes.ts:19 ERROR ɵNotFound: NG0201: No provider found for `ControlContainer`. Source: Standalone[_SomeComponent]. Find more at
    {
      provide: ControlContainer,
      useFactory: () => inject(ControlContainer, { skipSelf: true })
    }
  ]
})
export class PersonForm {

  fb = inject(FormBuilder);

  form: FormGroup = this.fb.group({
    name: new FormControl(''),
    email: new FormControl(''),
    phone: new FormControl(''),
    ubicacion: new FormGroup({
      departamento: new FormControl(''),
      provincia: new FormControl(''),
      distrito: new FormControl('')
    }),
    comments: new FormArray([])
  });


  print() {
    console.log(this.form.value);
  }

  addControl() {
    const control = new FormGroup({
      videojuego: new FormControl(''),
      genero: new FormControl(''),
    });
    this.form.addControl('workExperience', control);
  }

  removeControl() {
    this.form.removeControl('name');
  }

  addComment() {
    const control = new FormControl('');
    (this.form.get('comments') as FormArray )?.push(control);
  }

  removeComment(index: number) {
    (this.form.get('comments') as FormArray)?.removeAt(index);
  }

  get comments() {
    return (this.form.get('comments') as FormArray)?.controls;
  }
}
