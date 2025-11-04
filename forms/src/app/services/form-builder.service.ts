import { Injectable } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FieldSchema, FormSchema } from '../models/form-schema';

/**
 * Servicio para construir formularios dinámicamente desde un schema JSON
 * 
 * Este servicio es útil para:
 * - Generar formularios basados en configuración
 * - Reutilizar lógica de validación
 * - Crear formularios sin hardcodear la estructura
 */
@Injectable({
  providedIn: 'root'
})
export class FormBuilderService {

  constructor(private fb: FormBuilder) { }

  /**
   * Construye un FormGroup a partir de un FormSchema
   * 
   * @param schema - Schema que define los campos y sus validaciones
   * @returns FormGroup configurado según el schema
   * 
   * Ejemplo de uso:
   * ```typescript
   * const schema: FormSchema = {
   *   fields: [
   *     { name: 'name', label: 'Nombre', type: 'text', required: true },
   *     { name: 'email', label: 'Email', type: 'email', required: true }
   *   ]
   * };
   * const form = this.formBuilderService.buildFormFromSchema(schema);
   * ```
   */
  buildFormFromSchema(schema: FormSchema): FormGroup {
    const group: { [key: string]: FormControl } = {};

    schema.fields.forEach(field => {
      const validators = this.getValidators(field);
      const defaultValue = field.defaultValue ?? this.getDefaultValueForType(field.type);
      
      group[field.name] = new FormControl(defaultValue, validators);
    });

    return this.fb.group(group);
  }

  /**
   * Obtiene los validadores para un campo según su configuración
   */
  private getValidators(field: FieldSchema): any[] {
    const validators = field.validators || [];

    // Añadir validador required si está marcado
    if (field.required) {
      validators.push(Validators.required);
    }

    // Añadir validador de email si el tipo es email
    if (field.type === 'email') {
      validators.push(Validators.email);
    }

    return validators;
  }

  /**
   * Obtiene el valor por defecto según el tipo de campo
   */
  private getDefaultValueForType(type: string): any {
    switch (type) {
      case 'checkbox':
        return false;
      case 'number':
        return 0;
      case 'date':
        return '';
      default:
        return '';
    }
  }

  /**
   * Valida si un FormGroup es válido y retorna los errores
   * Útil para debugging
   */
  getFormErrors(form: FormGroup): { [key: string]: any } {
    const errors: { [key: string]: any } = {};

    Object.keys(form.controls).forEach(key => {
      const control = form.get(key);
      if (control && control.errors) {
        errors[key] = control.errors;
      }
    });

    return errors;
  }

  /**
   * Marca todos los campos como touched para mostrar errores
   */
  markAllAsTouched(form: FormGroup): void {
    Object.keys(form.controls).forEach(key => {
      const control = form.get(key);
      control?.markAsTouched();

      // Si es un FormGroup anidado, recursión
      if (control instanceof FormGroup) {
        this.markAllAsTouched(control);
      }
    });
  }
}

