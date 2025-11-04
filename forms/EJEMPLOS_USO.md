# 🔧 Ejemplos de Uso: Casos Prácticos

## Caso 1: Formulario de Registro Simple

### Requerimiento
Crear un formulario de registro que incluya información básica de usuario.

### Solución con CVA

```typescript
// user-registration.component.ts
@Component({
  selector: 'app-user-registration',
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <app-basic-info-fieldset 
        formControlName="basicInfo">
      </app-basic-info-fieldset>
      
      <button type="submit">Registrar</button>
    </form>
  `
})
export class UserRegistrationComponent {
  form = this.fb.group({
    basicInfo: [null]
  });
  
  onSubmit() {
    if (this.form.valid) {
      console.log('User data:', this.form.value.basicInfo);
      // Enviar a API
    }
  }
}
```

**Beneficio**: Toda la lógica de información básica está encapsulada. Si necesitas cambiar campos, solo modificas `BasicInfoFieldset`.

---

## Caso 2: Perfil de Usuario con Múltiples Direcciones

### Requerimiento
Usuario puede tener varias direcciones (casa, trabajo, etc.) y añadir/eliminar dinámicamente.

### Solución con FormArray + CVA

```typescript
// user-profile.component.ts
@Component({
  selector: 'app-user-profile',
  template: `
    <form [formGroup]="profileForm">
      <h2>Información Personal</h2>
      <app-basic-info-fieldset 
        formControlName="personalInfo">
      </app-basic-info-fieldset>
      
      <h2>Direcciones</h2>
      <app-address-list 
        formControlName="addresses">
      </app-address-list>
      
      <button (click)="saveProfile()">Guardar Perfil</button>
    </form>
  `
})
export class UserProfileComponent {
  profileForm = this.fb.group({
    personalInfo: [null],
    addresses: [[]]
  });
  
  saveProfile() {
    const data = this.profileForm.value;
    console.log('Perfil:', data);
    // POST a /api/users/profile
  }
}
```

---

## Caso 3: Formulario de Pedido E-commerce

### Requerimiento
Formulario de compra con:
- Información de envío
- Información de facturación (opcional)
- Lista de productos

### Implementación

```typescript
// order-form.component.ts
@Component({
  selector: 'app-order-form',
  template: `
    <form [formGroup]="orderForm" (ngSubmit)="placeOrder()">
      <!-- Dirección de envío -->
      <section>
        <h3>Dirección de Envío</h3>
        <app-address-form 
          formControlName="shippingAddress">
        </app-address-form>
      </section>
      
      <!-- Dirección de facturación -->
      <section>
        <label>
          <input type="checkbox" [formControl]="useSameAddress">
          Usar la misma dirección para facturación
        </label>
        
        @if (!useSameAddress.value) {
          <h3>Dirección de Facturación</h3>
          <app-address-form 
            formControlName="billingAddress">
          </app-address-form>
        }
      </section>
      
      <!-- Productos -->
      <section>
        <h3>Productos</h3>
        <!-- Lista de productos aquí -->
      </section>
      
      <button type="submit" [disabled]="!orderForm.valid">
        Realizar Pedido
      </button>
    </form>
  `
})
export class OrderFormComponent {
  orderForm = this.fb.group({
    shippingAddress: [null, Validators.required],
    billingAddress: [null]
  });
  
  useSameAddress = new FormControl(true);
  
  constructor(private fb: FormBuilder) {
    // Cuando cambia el checkbox, copiar dirección
    this.useSameAddress.valueChanges.subscribe(same => {
      if (same) {
        const shipping = this.orderForm.get('shippingAddress')?.value;
        this.orderForm.patchValue({ billingAddress: shipping });
      }
    });
  }
  
  placeOrder() {
    const order = {
      ...this.orderForm.value,
      billingAddress: this.useSameAddress.value 
        ? this.orderForm.value.shippingAddress 
        : this.orderForm.value.billingAddress
    };
    
    console.log('Order:', order);
    // POST a /api/orders
  }
}
```

---

## Caso 4: Formulario Dinámico desde API

### Requerimiento
El backend define qué campos mostrar en el formulario (ej: formulario de encuesta configurable).

### Solución con FormBuilder Service

```typescript
// survey-form.component.ts
@Component({
  selector: 'app-survey-form',
  template: `
    <form [formGroup]="surveyForm" (ngSubmit)="submitSurvey()">
      @for (field of fieldSchemas; track field.name) {
        <app-dynamic-field
          [control]="$any(surveyForm.get(field.name))"
          [schema]="field">
        </app-dynamic-field>
      }
      
      <button type="submit">Enviar Encuesta</button>
    </form>
  `
})
export class SurveyFormComponent implements OnInit {
  surveyForm!: FormGroup;
  fieldSchemas: FieldSchema[] = [];
  
  constructor(
    private formBuilder: FormBuilderService,
    private http: HttpClient
  ) {}
  
  ngOnInit() {
    // Obtener schema desde el backend
    this.http.get<FormSchema>('/api/surveys/123/schema').subscribe(schema => {
      this.fieldSchemas = schema.fields;
      this.surveyForm = this.formBuilder.buildFormFromSchema(schema);
    });
  }
  
  submitSurvey() {
    if (this.surveyForm.valid) {
      this.http.post('/api/surveys/123/responses', this.surveyForm.value)
        .subscribe(() => console.log('Survey submitted!'));
    }
  }
}
```

**Ejemplo de schema desde API**:
```json
{
  "fields": [
    {
      "name": "satisfaction",
      "label": "¿Qué tan satisfecho estás?",
      "type": "select",
      "required": true,
      "options": [
        { "label": "Muy satisfecho", "value": 5 },
        { "label": "Satisfecho", "value": 4 },
        { "label": "Neutral", "value": 3 },
        { "label": "Insatisfecho", "value": 2 },
        { "label": "Muy insatisfecho", "value": 1 }
      ]
    },
    {
      "name": "comments",
      "label": "Comentarios adicionales",
      "type": "text",
      "placeholder": "Escribe tus comentarios aquí..."
    }
  ]
}
```

---

## Caso 5: Formulario con Validación Condicional

### Requerimiento
Si el usuario selecciona "Empresa", mostrar campos adicionales (nombre de empresa, RFC, etc.).

### Implementación

```typescript
// registration-form.component.ts
@Component({
  selector: 'app-registration-form',
  template: `
    <form [formGroup]="form">
      <!-- Tipo de cuenta -->
      <div>
        <label>Tipo de cuenta</label>
        <select formControlName="accountType">
          <option value="personal">Personal</option>
          <option value="business">Empresa</option>
        </select>
      </div>
      
      <!-- Info personal (siempre visible) -->
      <app-basic-info-fieldset 
        formControlName="personalInfo">
      </app-basic-info-fieldset>
      
      <!-- Info de empresa (condicional) -->
      @if (form.value.accountType === 'business') {
        <section>
          <h3>Información de Empresa</h3>
          <div>
            <label>Nombre de Empresa</label>
            <input formControlName="companyName">
          </div>
          <div>
            <label>RFC</label>
            <input formControlName="taxId">
          </div>
        </section>
      }
    </form>
  `
})
export class RegistrationFormComponent implements OnInit {
  form = this.fb.group({
    accountType: ['personal'],
    personalInfo: [null, Validators.required],
    companyName: [''],
    taxId: ['']
  });
  
  ngOnInit() {
    // Añadir/remover validaciones según tipo de cuenta
    this.form.get('accountType')?.valueChanges.subscribe(type => {
      const companyName = this.form.get('companyName');
      const taxId = this.form.get('taxId');
      
      if (type === 'business') {
        companyName?.setValidators([Validators.required]);
        taxId?.setValidators([Validators.required, Validators.pattern(/^[A-Z]{3,4}\d{6}[A-Z0-9]{3}$/)]);
      } else {
        companyName?.clearValidators();
        taxId?.clearValidators();
      }
      
      companyName?.updateValueAndValidity();
      taxId?.updateValueAndValidity();
    });
  }
}
```

---

## Caso 6: Guardar y Restaurar Formulario

### Requerimiento
Permitir al usuario guardar el progreso del formulario y restaurarlo más tarde.

### Implementación

```typescript
// person-form.component.ts (extendido)
export class PersonFormComponent {
  form = this.fb.group({
    basicInfo: [null],
    addresses: [[]]
  });
  
  private readonly STORAGE_KEY = 'person_form_draft';
  
  ngOnInit() {
    // Restaurar desde localStorage
    this.loadDraft();
    
    // Auto-guardar cada 30 segundos
    interval(30000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.saveDraft());
  }
  
  saveDraft() {
    const draft = this.form.value;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(draft));
    console.log('Draft saved!');
  }
  
  loadDraft() {
    const draft = localStorage.getItem(this.STORAGE_KEY);
    if (draft) {
      const data = JSON.parse(draft);
      this.form.patchValue(data);
      console.log('Draft loaded!');
    }
  }
  
  clearDraft() {
    localStorage.removeItem(this.STORAGE_KEY);
    this.form.reset();
  }
  
  onSubmit() {
    if (this.form.valid) {
      // Enviar datos
      this.http.post('/api/persons', this.form.value).subscribe(() => {
        // Limpiar draft después de enviar exitosamente
        this.clearDraft();
      });
    }
  }
}
```

**Template actualizado**:
```html
<div class="draft-controls">
  <button type="button" (click)="saveDraft()">
    💾 Guardar borrador
  </button>
  <button type="button" (click)="loadDraft()">
    📂 Cargar borrador
  </button>
  <button type="button" (click)="clearDraft()">
    🗑️ Eliminar borrador
  </button>
</div>
```

---

## Caso 7: Formulario Multi-Step (Wizard)

### Requerimiento
Formulario dividido en pasos: 1) Info básica, 2) Direcciones, 3) Revisión.

### Implementación

```typescript
// wizard-form.component.ts
@Component({
  selector: 'app-wizard-form',
  template: `
    <div class="wizard">
      <!-- Indicador de pasos -->
      <div class="steps">
        <div [class.active]="currentStep === 1">1. Información Básica</div>
        <div [class.active]="currentStep === 2">2. Direcciones</div>
        <div [class.active]="currentStep === 3">3. Revisión</div>
      </div>
      
      <form [formGroup]="form">
        <!-- Paso 1 -->
        @if (currentStep === 1) {
          <app-basic-info-fieldset formControlName="basicInfo">
          </app-basic-info-fieldset>
        }
        
        <!-- Paso 2 -->
        @if (currentStep === 2) {
          <app-address-list formControlName="addresses">
          </app-address-list>
        }
        
        <!-- Paso 3: Revisión -->
        @if (currentStep === 3) {
          <div class="review">
            <h3>Revisar información</h3>
            <pre>{{ form.value | json }}</pre>
          </div>
        }
        
        <!-- Navegación -->
        <div class="navigation">
          <button 
            type="button"
            (click)="previousStep()"
            [disabled]="currentStep === 1">
            ← Anterior
          </button>
          
          @if (currentStep < 3) {
            <button 
              type="button"
              (click)="nextStep()"
              [disabled]="!canProceed()">
              Siguiente →
            </button>
          }
          
          @if (currentStep === 3) {
            <button 
              type="submit"
              (click)="submit()"
              [disabled]="!form.valid">
              ✓ Finalizar
            </button>
          }
        </div>
      </form>
    </div>
  `
})
export class WizardFormComponent {
  form = this.fb.group({
    basicInfo: [null, Validators.required],
    addresses: [[], Validators.required]
  });
  
  currentStep = 1;
  
  nextStep() {
    if (this.canProceed()) {
      this.currentStep++;
    }
  }
  
  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }
  
  canProceed(): boolean {
    switch (this.currentStep) {
      case 1:
        return this.form.get('basicInfo')?.valid ?? false;
      case 2:
        const addresses = this.form.get('addresses')?.value;
        return addresses && addresses.length > 0;
      default:
        return true;
    }
  }
  
  submit() {
    if (this.form.valid) {
      console.log('Form submitted:', this.form.value);
      // Enviar a API
    }
  }
}
```

---

## Caso 8: Validación Cross-Field

### Requerimiento
Validar que la "fecha de fin" sea posterior a la "fecha de inicio".

### Implementación

```typescript
// date-range.component.ts
@Component({
  selector: 'app-date-range',
  template: `
    <div [formGroup]="form">
      <div>
        <label>Fecha de Inicio</label>
        <input type="date" formControlName="startDate">
      </div>
      
      <div>
        <label>Fecha de Fin</label>
        <input type="date" formControlName="endDate">
        
        @if (form.errors?.['dateRange'] && form.get('endDate')?.touched) {
          <div class="error">
            La fecha de fin debe ser posterior a la fecha de inicio
          </div>
        }
      </div>
    </div>
  `,
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => DateRangeComponent), multi: true },
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => DateRangeComponent), multi: true }
  ]
})
export class DateRangeComponent implements ControlValueAccessor, Validator {
  form = this.fb.group({
    startDate: [''],
    endDate: ['']
  }, { validators: this.dateRangeValidator });
  
  // Validador personalizado
  dateRangeValidator(group: AbstractControl): ValidationErrors | null {
    const start = group.get('startDate')?.value;
    const end = group.get('endDate')?.value;
    
    if (!start || !end) return null;
    
    const startDate = new Date(start);
    const endDate = new Date(end);
    
    return startDate < endDate ? null : { dateRange: true };
  }
  
  // Implementación CVA...
  validate(control: AbstractControl): ValidationErrors | null {
    return this.form.errors;
  }
}
```

---

## Caso 9: Autocompletado con API

### Requerimiento
Campo de búsqueda de ciudades con autocompletado desde API.

### Implementación

```typescript
// city-autocomplete.component.ts
@Component({
  selector: 'app-city-autocomplete',
  template: `
    <div>
      <input 
        type="text"
        [formControl]="searchControl"
        placeholder="Buscar ciudad...">
      
      @if (suggestions.length > 0) {
        <ul class="suggestions">
          @for (city of suggestions; track city.id) {
            <li (click)="selectCity(city)">
              {{ city.name }}, {{ city.country }}
            </li>
          }
        </ul>
      }
      
      @if (loading) {
        <div class="loading">Buscando...</div>
      }
    </div>
  `
})
export class CityAutocompleteComponent implements ControlValueAccessor {
  searchControl = new FormControl('');
  suggestions: City[] = [];
  loading = false;
  
  private onChange: (value: any) => void = () => {};
  
  constructor(private http: HttpClient) {
    // Debounce para no hacer muchas peticiones
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(query => {
        if (!query || query.length < 3) {
          return of([]);
        }
        this.loading = true;
        return this.http.get<City[]>(`/api/cities?q=${query}`);
      })
    ).subscribe(cities => {
      this.suggestions = cities;
      this.loading = false;
    });
  }
  
  selectCity(city: City) {
    this.searchControl.setValue(city.name, { emitEvent: false });
    this.suggestions = [];
    this.onChange(city);
  }
  
  writeValue(value: any): void {
    if (value) {
      this.searchControl.setValue(value.name || value, { emitEvent: false });
    }
  }
  
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  
  registerOnTouched(fn: any): void { }
  
  setDisabledState(isDisabled: boolean): void {
    isDisabled ? this.searchControl.disable() : this.searchControl.enable();
  }
}
```

---

## Resumen de Patrones

| Caso | Patrón | Complejidad |
|------|--------|-------------|
| Registro Simple | CVA básico | ⭐ |
| Múltiples Direcciones | CVA + FormArray | ⭐⭐ |
| Pedido E-commerce | CVA anidados | ⭐⭐ |
| Formulario Dinámico | FormBuilder + JSON | ⭐⭐⭐ |
| Validación Condicional | Validadores dinámicos | ⭐⭐ |
| Guardar/Restaurar | LocalStorage + Forms | ⭐⭐ |
| Wizard Multi-Step | State management | ⭐⭐⭐ |
| Cross-Field Validation | Validadores personalizados | ⭐⭐ |
| Autocompletado | CVA + HTTP + RxJS | ⭐⭐⭐ |

---

**💡 Tip**: Empieza con los casos simples y ve aumentando la complejidad gradualmente. Cada patrón se construye sobre el anterior.

