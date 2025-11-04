# 📚 Conceptos Clave: Formularios Avanzados en Angular

## 1. ControlValueAccessor (CVA)

### ¿Qué es?

`ControlValueAccessor` es una **interfaz** de Angular que actúa como un puente entre el API de Angular Forms y un elemento del DOM nativo o un componente personalizado.

### ¿Por qué usarlo?

**Problemas que resuelve:**

1. **Componentes reutilizables**: Sin CVA, cada vez que necesitas un formulario complejo, tienes que repetir la misma estructura
2. **Encapsulación**: Permite encapsular lógica de formulario compleja en un solo componente
3. **Integración perfecta**: Los componentes CVA se usan exactamente igual que controles nativos

**Ejemplo sin CVA (❌ Malo)**:
```typescript
// En el componente padre
form = this.fb.group({
  firstName: [''],
  lastName: [''],
  email: [''],
  gender: [''],
  birthDate: ['']
});

// En cada lugar que uses este formulario, repites todo el código
```

**Ejemplo con CVA (✅ Bueno)**:
```typescript
// Componente padre
form = this.fb.group({
  basicInfo: [null]  // ¡Un solo control!
});

// En el template
<app-basic-info-fieldset formControlName="basicInfo"></app-basic-info-fieldset>

// La lógica compleja está encapsulada en BasicInfoFieldset
```

### Los 4 Métodos Obligatorios

#### 1. writeValue()

**Propósito**: Escribe un nuevo valor desde el formulario padre al componente.

**Cuándo se llama**: 
- Cuando usas `patchValue()` o `setValue()` en el padre
- Cuando Angular inicializa el formulario

```typescript
writeValue(value: any): void {
  if (value) {
    // ⚠️ IMPORTANTE: usar { emitEvent: false }
    // para evitar loops infinitos
    this.form.patchValue(value, { emitEvent: false });
  }
}
```

**⚠️ Error común**: No usar `{ emitEvent: false }` causa loops infinitos:
```typescript
// ❌ MAL - Causa loop infinito
writeValue(value: any): void {
  this.form.patchValue(value);  // Emite evento -> onChange() -> writeValue() -> ...
}

// ✅ BIEN
writeValue(value: any): void {
  this.form.patchValue(value, { emitEvent: false });
}
```

#### 2. registerOnChange()

**Propósito**: Registra una función callback que debe ser llamada cuando el valor del componente cambia.

```typescript
private onChange: (value: any) => void = () => {};

registerOnChange(fn: any): void {
  this.onChange = fn;
}

// Luego, cuando el valor cambia:
this.form.valueChanges.subscribe(value => {
  this.onChange(value);  // Notifica al padre
});
```

#### 3. registerOnTouched()

**Propósito**: Registra callback para notificar cuando el control ha sido "tocado" (touched).

```typescript
private onTouched: () => void = () => {};

registerOnTouched(fn: any): void {
  this.onTouched = fn;
}

// Llamar cuando el usuario interactúa
this.form.valueChanges.subscribe(() => {
  this.onTouched();
});
```

#### 4. setDisabledState()

**Propósito**: Habilita o deshabilita el control programáticamente.

```typescript
setDisabledState(isDisabled: boolean): void {
  if (isDisabled) {
    this.form.disable();
  } else {
    this.form.enable();
  }
}
```

### Configuración en el Componente

```typescript
@Component({
  selector: 'app-my-component',
  // ... otras propiedades
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MyComponent),
      multi: true  // ⚠️ IMPORTANTE: multi debe ser true
    }
  ]
})
export class MyComponent implements ControlValueAccessor {
  // implementación
}
```

**¿Por qué `forwardRef()`?**
- TypeScript necesita referencias a clases antes de que estén definidas
- `forwardRef()` permite referenciar la clase dentro de su propio decorador

**¿Por qué `multi: true`?**
- Permite múltiples implementaciones de `NG_VALUE_ACCESSOR`
- Angular puede tener varios proveedores para el mismo token

---

## 2. FormArray

### ¿Qué es?

`FormArray` es un array de controles de formulario (`AbstractControl`) que permite gestionar listas dinámicas.

### ¿Cuándo usarlo?

- Listas de items que pueden crecer/decrecer (ej: direcciones, teléfonos)
- Formularios repetitivos
- Cuando no sabes cuántos controles necesitarás

### Operaciones Básicas

```typescript
// Crear FormArray
addressesArray = this.fb.array([]);

// Añadir control
addAddress(): void {
  const control = new FormControl({ street: '', city: '' });
  this.addressesArray.push(control);
}

// Eliminar control
removeAddress(index: number): void {
  this.addressesArray.removeAt(index);
}

// Limpiar todos
clear(): void {
  this.addressesArray.clear();
}

// Acceder a controles
get addresses() {
  return this.addressesArray.controls;
}
```

### En el Template

```html
@for (control of addresses; track $index) {
  <div>
    <!-- Usar el control -->
    <input [formControl]="$any(control)">
    <button (click)="removeAddress($index)">Eliminar</button>
  </div>
}
```

**⚠️ Nota**: `$any()` es necesario para evitar errores de tipo con `AbstractControl`

### FormArray + CVA (Patrón Avanzado)

Este es el patrón más poderoso: encapsular un FormArray completo en un CVA.

**Beneficios**:
- El componente padre no sabe que hay un FormArray
- Toda la lógica de añadir/eliminar está encapsulada
- Reutilizable en cualquier formulario

**Ejemplo** (ver `AddressListComponent`):
```typescript
@Component({
  selector: 'app-address-list',
  providers: [{ provide: NG_VALUE_ACCESSOR, ... }]
})
export class AddressListComponent implements ControlValueAccessor {
  addressesArray: FormArray;
  
  writeValue(addresses: Address[]): void {
    this.addressesArray.clear();
    addresses?.forEach(addr => {
      this.addressesArray.push(new FormControl(addr));
    });
  }
  
  addAddress(): void {
    this.addressesArray.push(new FormControl({}));
    this.onChange(this.addressesArray.value);
  }
}
```

**Uso en el padre**:
```typescript
// ¡El padre no sabe que es un FormArray!
form = this.fb.group({
  addresses: [[]]  // Solo un array vacío
});
```

---

## 3. Validator en CVA

### ¿Por qué implementar Validator?

Los CVA pueden tener validaciones internas, pero el formulario padre **no las conoce** automáticamente. `Validator` propaga esas validaciones.

### Implementación

```typescript
import { Validator, ValidationErrors, AbstractControl } from '@angular/forms';

@Component({
  providers: [
    { provide: NG_VALUE_ACCESSOR, ... },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => MyComponent),
      multi: true
    }
  ]
})
export class MyComponent implements ControlValueAccessor, Validator {
  
  validate(control: AbstractControl): ValidationErrors | null {
    // Si el formulario interno es válido, retorna null
    // Si no, retorna un objeto de error
    return this.form.valid ? null : { invalidForm: true };
  }
}
```

### Ejemplo de Validación Compleja

```typescript
validate(control: AbstractControl): ValidationErrors | null {
  if (!this.form) return null;
  
  const errors: ValidationErrors = {};
  
  // Validar campos individuales
  if (this.form.get('email')?.hasError('email')) {
    errors['invalidEmail'] = true;
  }
  
  // Validación personalizada
  const age = this.calculateAge(this.form.get('birthDate')?.value);
  if (age < 18) {
    errors['tooYoung'] = { minAge: 18, actualAge: age };
  }
  
  // Retornar null si no hay errores
  return Object.keys(errors).length > 0 ? errors : null;
}
```

---

## 4. Composición: CVA dentro de CVA

### El Patrón

Un CVA puede usar otros CVA internamente. Esto crea una jerarquía de componentes reutilizables.

**Ejemplo en esta app**:
```
PersonForm (Página)
├── BasicInfoFieldset (CVA)
│   └── campos individuales
└── AddressList (CVA)
    └── AddressForm (CVA) × N
        └── campos individuales
```

### Beneficios

1. **Máxima reutilización**: Cada nivel es independiente
2. **Testing fácil**: Cada componente se prueba aisladamente
3. **Mantenibilidad**: Cambios localizados
4. **Composición**: Construir formularios complejos con piezas simples

### Ejemplo de Uso

```typescript
// Nivel 1: Campo simple (CVA)
@Component({ selector: 'app-phone-input' })
class PhoneInputComponent implements ControlValueAccessor { }

// Nivel 2: Grupo de campos (CVA)
@Component({ selector: 'app-contact-info' })
class ContactInfoComponent implements ControlValueAccessor {
  form = this.fb.group({
    email: [''],
    phone: [null]  // Usa PhoneInputComponent
  });
}

// Nivel 3: Formulario completo (CVA)
@Component({ selector: 'app-person-form' })
class PersonFormComponent implements ControlValueAccessor {
  form = this.fb.group({
    contact: [null]  // Usa ContactInfoComponent
  });
}
```

---

## 5. Formularios Dinámicos desde JSON

### El Problema

Hard-codear formularios no escala:
- Difícil de mantener
- No configurable
- Repetitivo

### La Solución

Generar formularios desde un schema JSON:

```typescript
interface FieldSchema {
  name: string;
  label: string;
  type: 'text' | 'email' | 'select' | ...;
  required?: boolean;
  options?: { label: string, value: any }[];
}

const schema: FieldSchema[] = [
  { name: 'email', label: 'Email', type: 'email', required: true },
  { name: 'country', label: 'País', type: 'select', options: [...] }
];
```

### Implementación

```typescript
@Injectable()
export class FormBuilderService {
  buildFormFromSchema(schema: FormSchema): FormGroup {
    const controls: { [key: string]: FormControl } = {};
    
    schema.fields.forEach(field => {
      const validators = this.getValidators(field);
      controls[field.name] = new FormControl(
        field.defaultValue ?? '',
        validators
      );
    });
    
    return this.fb.group(controls);
  }
  
  private getValidators(field: FieldSchema) {
    const validators = [];
    if (field.required) validators.push(Validators.required);
    if (field.type === 'email') validators.push(Validators.email);
    return validators;
  }
}
```

### Ventajas

- ✅ Configuración centralizada
- ✅ Fácil de modificar
- ✅ Puede venir de una API
- ✅ Genera formularios en runtime

---

## 6. Best Practices

### 1. Usa `emitEvent: false` en writeValue

```typescript
writeValue(value: any): void {
  this.form.patchValue(value, { emitEvent: false });
}
```

### 2. Siempre inicializa callbacks

```typescript
private onChange: (value: any) => void = () => {};
private onTouched: () => void = () => {};
```

### 3. Maneja null/undefined

```typescript
writeValue(value: any): void {
  if (value) {  // ⚠️ Verifica antes de usar
    this.form.patchValue(value, { emitEvent: false });
  }
}
```

### 4. Desuscríbete de observables

```typescript
private destroy$ = new Subject<void>();

ngOnInit() {
  this.form.valueChanges
    .pipe(takeUntil(this.destroy$))
    .subscribe(value => this.onChange(value));
}

ngOnDestroy() {
  this.destroy$.next();
  this.destroy$.complete();
}
```

### 5. Usa forwardRef correctamente

```typescript
providers: [
  {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => MyComponent),  // ⚠️ forwardRef es necesario
    multi: true
  }
]
```

---

## 7. Patrones Avanzados

### Validadores Asíncronos en CVA

```typescript
asyncValidator(control: AbstractControl): Observable<ValidationErrors | null> {
  return this.http.get(`/api/validate/${control.value}`).pipe(
    map(response => response.valid ? null : { invalid: true }),
    catchError(() => of(null))
  );
}
```

### CVA con Signals (Angular 16+)

```typescript
value = signal<MyValue | null>(null);

writeValue(value: MyValue): void {
  this.value.set(value);
}

// En el template
<input [value]="value()" (input)="handleInput($event)">
```

### Cross-field Validation

```typescript
validate(control: AbstractControl): ValidationErrors | null {
  const password = this.form.get('password')?.value;
  const confirm = this.form.get('confirmPassword')?.value;
  
  return password === confirm ? null : { passwordMismatch: true };
}
```

---

## 8. Debugging Tips

### Ver el valor del formulario

```typescript
// En el componente
console.log('Form value:', this.form.value);
console.log('Form valid:', this.form.valid);
console.log('Form errors:', this.form.errors);
```

### Detectar cuándo se llaman los métodos CVA

```typescript
writeValue(value: any): void {
  console.log('writeValue called with:', value);
  // ...
}

registerOnChange(fn: any): void {
  console.log('registerOnChange called');
  this.onChange = fn;
}
```

### Ver el estado de cada control

```typescript
Object.keys(this.form.controls).forEach(key => {
  const control = this.form.get(key);
  console.log(`${key}:`, {
    value: control?.value,
    valid: control?.valid,
    errors: control?.errors
  });
});
```

---

## Recursos Adicionales

- [Angular Forms Docs](https://angular.dev/guide/forms)
- [ControlValueAccessor API](https://angular.dev/api/forms/ControlValueAccessor)
- [FormArray API](https://angular.dev/api/forms/FormArray)
- [Custom Form Controls](https://angular.dev/guide/forms/custom-form-controls)

---

**🎓 ¡Feliz aprendizaje!**

