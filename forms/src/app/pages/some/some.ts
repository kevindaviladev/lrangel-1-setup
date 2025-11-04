import { JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ControlContainer, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PersonForm } from "../../components/person-form/person-form";
import { catchError, of, throwError } from 'rxjs';

@Component({
  selector: 'app-some',
  imports: [ReactiveFormsModule, PersonForm],
  templateUrl: './some.html',
  styleUrls: ['./some.css'],
})
export class SomeComponent {

  form = getCurrentForm('person');

  // ngOnInit() {
  //   this.form.get('ubicacion')?.get('departamento')?.valueChanges.subscribe(value => {
  //     console.log(value);
  //   });
  // }

  // setValue() {
  //   this.form.get('name')?.setValue('John Doe');
  // }

  // print() {
  //   console.log(this.form.get('name'));
  // }

  getDepartments() {
    // throw new Error('Not implemented');
    // throw Error('Not implemented');
    // return of([1,2,3])
    // return of(throwError(() => new Error('Not implemented')));
    return throwError(() => new Error('Not implemented'));
  }


  ngOnInit() {
    this.getDepartments()
    .pipe(
      catchError(error => {
        console.error("Error al obtener los departamentos desde catchError",error);
        return of([]);
      })
    )
    .subscribe({
      next: departments => {
        console.log("next",departments);
      },
      error: error => {
        console.error("Error al obtener los departamentos",error);
      }
    });
  }

}

export function getForm() {
  const form = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl(''),
    ubicacion: new FormGroup({
      departamento: new FormControl(''),
      provincia: new FormControl(''),
      distrito: new FormControl('')
    })
  });

  return form;
}

export function getFormUbigeo() {
  const form = new FormGroup({
    departamento: new FormControl(''),
    provincia: new FormControl(''),
    distrito: new FormControl('')
  });

  return form;
}

export function getFormAnimal() {
  const form = new FormGroup({
    name: new FormControl(''),
    age: new FormControl(''),
    type: new FormControl('')
  });

  return form;
}

export function getCurrentForm(prop: 'person' | 'ubigeo' | 'animal') {
  switch (prop) {
    case 'person':
      return getForm();
    case 'ubigeo':
      return getFormUbigeo();
    case 'animal':
      return getFormAnimal();
  }
}