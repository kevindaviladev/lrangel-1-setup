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

/**
 * Componente que implementa ControlValueAccessor (CVA)
 * 
 * ¿Qué es CVA?
 * Es una interfaz que permite crear componentes personalizados que se comportan
 * como controles de formulario nativos de Angular. Esto permite:
 * - Usar el componente con formControlName
 * - Integrar validación
 * - Sincronizar valores bidireccialmente
 * 
 * Los 4 métodos requeridos son:
 * 1. writeValue() - Escribe un valor desde el formulario padre al componente
 * 2. registerOnChange() - Registra callback para notificar cambios al padre
 * 3. registerOnTouched() - Registra callback para notificar que fue tocado
 * 4. setDisabledState() - Habilita/deshabilita el control
 */
@Component({
  selector: 'app-basic-info-fieldset',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './basic-info-fieldset.component.html',
  styleUrls: ['./basic-info-fieldset.component.css'],
  providers: [
    {
      // Proveedor para ControlValueAccessor
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => BasicInfoFieldsetComponent),
      multi: true
    },
    {
      // Proveedor para validadores
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => BasicInfoFieldsetComponent),
      multi: true
    }
  ]
})
export class BasicInfoFieldsetComponent implements ControlValueAccessor, Validator {
  
  // FormGroup interno que maneja los campos de información básica
  form: FormGroup;

  // Callbacks para comunicación con el formulario padre
  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(private fb: FormBuilder) {
    // Inicializar el formulario interno
    this.form = this.fb.group({
      firstName: [''],
      lastName: [''],
      email: [''],
      gender: [''],
      birthDate: ['']
    });

    // Suscribirse a cambios del formulario interno
    // y notificar al formulario padre
    this.form.valueChanges.subscribe(value => {
      this.onChange(value);
      this.onTouched();
    });
  }

  /**
   * CVA: Escribe un valor desde el formulario padre
   * Se llama cuando el valor cambia desde fuera del componente
   */
  writeValue(value: any): void {
    if (value) {
      this.form.patchValue(value, { emitEvent: false });
    }
  }

  /**
   * CVA: Registra función callback para notificar cambios
   */
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  /**
   * CVA: Registra función callback para notificar touch
   */
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  /**
   * CVA: Habilita o deshabilita el control
   */
  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.form.disable();
    } else {
      this.form.enable();
    }
  }

  /**
   * Validator: Valida el formulario completo
   * Propaga los errores del formulario interno al padre
   */
  validate(control: AbstractControl): ValidationErrors | null {
    return this.form.valid ? null : { invalidBasicInfo: true };
  }

  // Opciones para el radio button de género
  genderOptions = [
    { label: 'Masculino', value: 'male' },
    { label: 'Femenino', value: 'female' },
    { label: 'Otro', value: 'other' }
  ];
}

