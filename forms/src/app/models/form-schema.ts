/**
 * Tipos de campos soportados en el formulario dinámico
 */
export type FieldType = 'text' | 'email' | 'number' | 'date' | 'select' | 'checkbox' | 'radio';

/**
 * Interfaz para opciones de campos tipo select o radio
 */
export interface FieldOption {
  label: string;
  value: any;
}

/**
 * Schema de un campo individual del formulario
 * Define cómo se debe renderizar y validar cada campo
 */
export interface FieldSchema {
  name: string;           // Nombre del control en el formulario
  label: string;          // Etiqueta visible para el usuario
  type: FieldType;        // Tipo de campo
  defaultValue?: any;     // Valor por defecto
  required?: boolean;     // Si es obligatorio
  placeholder?: string;   // Placeholder para inputs
  options?: FieldOption[]; // Opciones para select/radio
  validators?: any[];     // Validadores adicionales de Angular
}

/**
 * Schema completo del formulario
 * Permite definir toda la estructura del formulario desde JSON
 */
export interface FormSchema {
  fields: FieldSchema[];
}

/**
 * Interfaz para los datos básicos de una persona
 */
export interface BasicInfo {
  firstName: string;
  lastName: string;
  email: string;
  gender: 'male' | 'female' | 'other' | '';
  birthDate: string;
}

/**
 * Interfaz para una dirección
 */
export interface Address {
  street: string;
  city: string;
  country: string;
  postalCode: string;
}

/**
 * Interfaz completa para el formulario de persona
 */
export interface PersonForm {
  basicInfo: BasicInfo;
  addresses: Address[];
}

