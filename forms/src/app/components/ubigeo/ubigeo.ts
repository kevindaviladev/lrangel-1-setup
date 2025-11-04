import { JsonPipe } from '@angular/common';
import { Component, inject, Input, SkipSelf } from '@angular/core';
import { ControlContainer, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-ubigeo',
  imports: [ReactiveFormsModule, JsonPipe],
  templateUrl: './ubigeo.html',
  styleUrl: './ubigeo.css',
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: () => inject(ControlContainer, { skipSelf: true })
    }
  ]
})
export class Ubigeo {

  controlContainer = inject(ControlContainer);

  ngOnInit() {
    const form = this.controlContainer.control as FormGroup;
    console.log(form);

    form.get('departamento')?.valueChanges.subscribe(value => {
      console.log("change on departamento", value);
    });
  }
}
