import { Component, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  ControlValueAccessor, 
  FormArray, 
  FormBuilder, 
  FormControl,
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS,
  ReactiveFormsModule,
  Validator,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';
import { AddressFormComponent } from '../address-form/address-form.component';
import { Address } from '../../models/form-schema';

/**
 * Componente CVA que gestiona un FormArray de direcciones
 * 
 * Este es el componente más complejo, ya que:
 * 1. Implementa CVA para integrarse con el formulario padre
 * 2. Gestiona un FormArray dinámico internamente
 * 3. Permite añadir y eliminar direcciones
 * 4. Usa otro CVA (AddressForm) como hijos
 * 
 * Patrón importante: CVA + FormArray
 * Este patrón permite encapsular lógica compleja de arrays dinámicos
 * y exponerla como un simple control de formulario.
 */
@Component({
  selector: 'app-address-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AddressFormComponent],
  templateUrl: './address-list.component.html',
  styleUrls: ['./address-list.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AddressListComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => AddressListComponent),
      multi: true
    }
  ]
})
export class AddressListComponent implements ControlValueAccessor, Validator {
  
  /**
   * FormArray que contiene los controles para cada dirección
   * Cada elemento del array es un FormControl que usa AddressFormComponent
   */
  addressesArray: FormArray;

  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(private fb: FormBuilder) {
    // Inicializar FormArray vacío
    this.addressesArray = this.fb.array([]);

    // Suscribirse a cambios del array completo
    this.addressesArray.valueChanges.subscribe(value => {
      this.onChange(value);
      this.onTouched();
    });
  }

  /**
   * Añade una nueva dirección al FormArray
   * Por defecto, añade un objeto vacío que será gestionado por AddressForm
   */
  addAddress(): void {
    const addressControl = new FormControl({
      street: '',
      city: '',
      country: '',
      postalCode: ''
    });
    
    this.addressesArray.push(addressControl);
    
    // Notificar cambios al padre
    this.onChange(this.addressesArray.value);
  }

  /**
   * Elimina una dirección del FormArray por índice
   */
  removeAddress(index: number): void {
    this.addressesArray.removeAt(index);
    
    // Notificar cambios al padre
    this.onChange(this.addressesArray.value);
  }

  /**
   * CVA: Escribe un array de direcciones desde el formulario padre
   * Reconstruye el FormArray con los valores recibidos
   */
  writeValue(addresses: Address[]): void {
    // Limpiar el array actual
    this.addressesArray.clear();

    // Si hay direcciones, añadirlas al FormArray
    if (addresses && addresses.length > 0) {
      addresses.forEach(address => {
        const control = new FormControl(address);
        this.addressesArray.push(control);
      });
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
      this.addressesArray.disable();
    } else {
      this.addressesArray.enable();
    }
  }

  /**
   * Validator: Valida que todas las direcciones sean válidas
   */
  validate(control: AbstractControl): ValidationErrors | null {
    return this.addressesArray.valid ? null : { invalidAddresses: true };
  }

  /**
   * Helper para obtener los controles del FormArray
   * Útil en el template para iterar
   */
  get addresses() {
    return this.addressesArray.controls;
  }
}

