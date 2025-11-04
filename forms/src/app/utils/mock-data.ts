import { PersonForm } from '../models/form-schema';

/**
 * Datos de ejemplo para demostrar la carga del formulario desde JSON
 * Esto simula lo que podría venir de una API
 */
export const MOCK_PERSON_DATA: PersonForm = {
  basicInfo: {
    firstName: 'Juan',
    lastName: 'Pérez',
    email: 'juan.perez@example.com',
    gender: 'male',
    birthDate: '1990-05-15'
  },
  addresses: [
    {
      street: 'Calle Principal 123',
      city: 'Madrid',
      country: 'España',
      postalCode: '28001'
    },
    {
      street: 'Avenida Secundaria 456',
      city: 'Barcelona',
      country: 'España',
      postalCode: '08001'
    }
  ]
};

/**
 * Datos de ejemplo vacíos para iniciar un formulario limpio
 */
export const EMPTY_PERSON_DATA: PersonForm = {
  basicInfo: {
    firstName: '',
    lastName: '',
    email: '',
    gender: '',
    birthDate: ''
  },
  addresses: []
};

/**
 * Lista de países para los selects
 */
export const COUNTRIES = [
  'España',
  'México',
  'Argentina',
  'Colombia',
  'Chile',
  'Perú',
  'Venezuela',
  'Ecuador',
  'Guatemala',
  'Cuba'
];

