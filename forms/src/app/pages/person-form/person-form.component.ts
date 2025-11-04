import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BasicInfoFieldsetComponent } from '../../components/basic-info-fieldset/basic-info-fieldset.component';
import { AddressListComponent } from '../../components/address-list/address-list.component';
import { MOCK_PERSON_DATA, EMPTY_PERSON_DATA } from '../../utils/mock-data';
import { PersonForm } from '../../models/form-schema';

/**
 * Página principal del formulario de persona
 * 
 * Esta página demuestra:
 * 1. Uso de componentes CVA personalizados en un formulario
 * 2. Gestión de FormArray a través de CVA
 * 3. Carga de datos desde JSON
 * 4. Validación de formularios complejos
 * 
 * El formulario completo está compuesto por:
 * - BasicInfoFieldset (CVA): Información básica
 * - AddressList (CVA): Lista dinámica de direcciones usando FormArray
 */
@Component({
  selector: 'app-person-form',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    BasicInfoFieldsetComponent,
    AddressListComponent
  ],
  templateUrl: './person-form.component.html',
  styleUrls: ['./person-form.component.css']
})
export class PersonFormComponent implements OnInit {
  
  /**
   * FormGroup principal que contiene todo el formulario
   * 
   * Estructura:
   * {
   *   basicInfo: { ... } <- Gestionado por BasicInfoFieldset CVA
   *   addresses: [ ... ] <- Gestionado por AddressList CVA
   * }
   */
  personForm: FormGroup;

  /**
   * Flag para mostrar el JSON en el template
   */
  showFormValue = false;

  /**
   * Valor del formulario en formato JSON para visualización
   */
  formJsonValue = '';

  constructor(private fb: FormBuilder) {
    // Inicializar el formulario principal
    // Nota: No necesitamos construir los FormControls internos manualmente
    // porque los componentes CVA se encargan de eso
    this.personForm = this.fb.group({
      basicInfo: [null],  // Será gestionado por BasicInfoFieldset
      addresses: [[]]     // Será gestionado por AddressList
    });

    // Suscribirse a cambios del formulario (opcional, para debugging)
    this.personForm.valueChanges.subscribe(value => {
      console.log('Form changed:', value);
    });
  }

  ngOnInit(): void {
    // Puedes inicializar con datos vacíos o cargar datos de ejemplo
    // this.loadFormData(EMPTY_PERSON_DATA);
  }

  /**
   * Carga datos en el formulario desde un objeto JSON
   * Demuestra cómo los CVA simplifican la carga de datos complejos
   */
  loadFormData(data: PersonForm): void {
    // Con CVA, simplemente usamos patchValue y los componentes
    // se encargan de actualizar sus controles internos
    this.personForm.patchValue(data);
    
    console.log('Datos cargados:', data);
  }

  /**
   * Carga los datos de ejemplo (MOCK)
   */
  loadMockData(): void {
    this.loadFormData(MOCK_PERSON_DATA);
  }

  /**
   * Limpia el formulario
   */
  clearForm(): void {
    this.loadFormData(EMPTY_PERSON_DATA);
  }

  /**
   * Maneja el submit del formulario
   */
  onSubmit(): void {
    // Marcar todos los campos como touched para mostrar errores
    this.markFormGroupTouched(this.personForm);

    if (this.personForm.valid) {
      const formValue = this.personForm.value;
      
      console.log('=== FORMULARIO ENVIADO ===');
      console.log('Valor completo:', formValue);
      console.log('Información básica:', formValue.basicInfo);
      console.log('Direcciones:', formValue.addresses);
      console.log('Número de direcciones:', formValue.addresses?.length || 0);
      console.log('=========================');

      // Mostrar JSON en el template
      this.formJsonValue = JSON.stringify(formValue, null, 2);
      this.showFormValue = true;

      alert('✅ Formulario válido! Revisa la consola para ver los datos.');
    } else {
      console.error('❌ Formulario inválido');
      console.log('Errores:', this.getFormErrors());
      
      alert('⚠️ Por favor, completa todos los campos requeridos.');
    }
  }

  /**
   * Marca todos los controles del formulario como touched (recursivo)
   * Esto fuerza a mostrar los mensajes de error
   */
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  /**
   * Obtiene los errores del formulario (útil para debugging)
   */
  private getFormErrors(): any {
    const errors: any = {};

    Object.keys(this.personForm.controls).forEach(key => {
      const control = this.personForm.get(key);
      if (control && control.errors) {
        errors[key] = control.errors;
      }
    });

    return errors;
  }

  /**
   * Exporta el valor del formulario como JSON
   */
  exportAsJson(): void {
    const json = JSON.stringify(this.personForm.value, null, 2);
    
    // Crear un blob y descargarlo
    const blob = new Blob([json], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'person-form-data.json';
    link.click();
    window.URL.revokeObjectURL(url);
  }

  /**
   * Cierra la visualización del JSON
   */
  closeJsonView(): void {
    this.showFormValue = false;
  }

  /**
   * Helper para verificar si el formulario es válido
   */
  get isFormValid(): boolean {
    return this.personForm.valid;
  }

  /**
   * Helper para verificar si el formulario tiene direcciones
   */
  get hasAddresses(): boolean {
    const addresses = this.personForm.get('addresses')?.value;
    return addresses && addresses.length > 0;
  }
}

