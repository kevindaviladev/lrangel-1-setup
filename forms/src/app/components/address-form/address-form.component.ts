import { Component, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  ControlValueAccessor, 
  FormBuilder, 
  FormGroup, 
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS,
  ReactiveFormsModule,
  Validator,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';
import { COUNTRIES } from '../../utils/mock-data';

/**
 * Componente CVA para una dirección individual
 * 
 * Este componente representa UN formulario de dirección y puede ser usado
 * independientemente o como parte de un FormArray (como en AddressList).
 * 
 * Demuestra cómo un CVA puede encapsular lógica compleja de formulario
 * y ser reutilizado fácilmente.
 */
@Component({
  selector: 'app-address-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './address-form.component.html',
  styleUrls: ['./address-form.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AddressFormComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => AddressFormComponent),
      multi: true
    }
  ]
})
export class AddressFormComponent implements ControlValueAccessor, Validator {
  
  form: FormGroup;
  countries = COUNTRIES;

  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(private fb: FormBuilder) {
    // Crear formulario interno con los campos de dirección
    this.form = this.fb.group({
      street: [''],
      city: [''],
      country: [''],
      postalCode: ['']
    });

    // Suscribirse a cambios y notificar al padre
    this.form.valueChanges.subscribe(value => {
      this.onChange(value);
      this.onTouched();
    });
  }

  // Implementación de ControlValueAccessor
  writeValue(value: any): void {
    if (value) {
      this.form.patchValue(value, { emitEvent: false });
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.form.disable();
    } else {
      this.form.enable();
    }
  }

  // Implementación de Validator
  validate(control: AbstractControl): ValidationErrors | null {
    return this.form.valid ? null : { invalidAddress: true };
  }
}

