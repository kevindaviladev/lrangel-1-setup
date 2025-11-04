import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { FieldSchema } from '../../models/form-schema';

/**
 * Componente para renderizar campos dinámicamente basados en un schema
 * 
 * Este componente no implementa CVA porque es más simple:
 * recibe un FormControl del padre y un schema que define cómo renderizarlo.
 * 
 * Útil para generar formularios completamente desde JSON sin hardcodear campos.
 * 
 * Ejemplo de uso:
 * ```html
 * <app-dynamic-field 
 *   [control]="form.get('name')" 
 *   [schema]="nameFieldSchema">
 * </app-dynamic-field>
 * ```
 */
@Component({
  selector: 'app-dynamic-field',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dynamic-field.component.html',
  styleUrls: ['./dynamic-field.component.css']
})
export class DynamicFieldComponent {
  
  /**
   * El control del formulario asociado a este campo
   */
  @Input() control!: FormControl;

  /**
   * Schema que define cómo se debe renderizar el campo
   */
  @Input() schema!: FieldSchema;

  /**
   * Helper para determinar si se debe mostrar un error
   */
  get showError(): boolean {
    return !!(this.control && this.control.invalid && this.control.touched);
  }

  /**
   * Helper para obtener el mensaje de error apropiado
   */
  get errorMessage(): string {
    if (!this.control || !this.control.errors) {
      return '';
    }

    const errors = this.control.errors;

    if (errors['required']) {
      return `${this.schema.label} es requerido`;
    }

    if (errors['email']) {
      return 'Email inválido';
    }

    return 'Campo inválido';
  }
}

