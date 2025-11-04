# 📋 App Educativa: Formularios Avanzados en Angular

Aplicación educativa en **Angular v20** para enseñar patrones avanzados de formularios reactivos.

## 🎯 Objetivos de Aprendizaje

Esta aplicación demuestra:

1. **ControlValueAccessor (CVA)**: Crear componentes personalizados que se integran con Angular Forms
2. **FormArray Dinámicos**: Gestionar listas dinámicas de formularios
3. **Formularios desde JSON**: Generar formularios dinámicamente desde configuración
4. **Composición de Componentes**: CVA dentro de CVA
5. **Validación Compleja**: Validadores personalizados y propagación de errores

## 🚀 Inicio Rápido

### Requisitos
- Node.js v18+
- npm v9+

### Instalación

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm start
# o
ng serve
```

Abre tu navegador en `http://localhost:4200`

## 📁 Estructura del Proyecto

```
src/app/
├── models/
│   └── form-schema.ts           # Interfaces y tipos TypeScript
│
├── utils/
│   └── mock-data.ts             # Datos de ejemplo
│
├── services/
│   └── form-builder.service.ts  # Servicio para construir formularios desde JSON
│
├── components/
│   ├── basic-info-fieldset/     # CVA: Información básica
│   ├── address-form/            # CVA: Formulario de dirección individual
│   ├── address-list/            # CVA: Lista dinámica con FormArray
│   └── dynamic-field/           # Renderiza campos desde schema JSON
│
└── pages/
    └── person-form/             # Página principal del formulario
```

## 🧩 Componentes Principales

### 1. BasicInfoFieldset (CVA)

**Ubicación**: `components/basic-info-fieldset/`

**Propósito**: Encapsula campos de información básica (nombre, email, género, fecha) como un componente reutilizable.

**Conceptos demostrados**:
- Implementación de `ControlValueAccessor`
- FormGroup interno
- Comunicación bidireccional con formulario padre

**Uso**:
```html
<app-basic-info-fieldset formControlName="basicInfo"></app-basic-info-fieldset>
```

### 2. AddressForm (CVA)

**Ubicación**: `components/address-form/`

**Propósito**: Representa un formulario individual de dirección.

**Conceptos demostrados**:
- CVA simple
- Validación interna
- Select con opciones dinámicas

**Uso**:
```html
<app-address-form [formControl]="addressControl"></app-address-form>
```

### 3. AddressList (CVA + FormArray)

**Ubicación**: `components/address-list/`

**Propósito**: Gestiona una lista dinámica de direcciones usando FormArray.

**Conceptos demostrados**:
- CVA + FormArray
- Añadir/eliminar items dinámicamente
- Composición (usa AddressForm internamente)
- Propagación de validaciones

**Uso**:
```html
<app-address-list formControlName="addresses"></app-address-list>
```

### 4. DynamicField

**Ubicación**: `components/dynamic-field/`

**Propósito**: Renderiza campos dinámicamente basados en un schema JSON.

**Conceptos demostrados**:
- Renderizado condicional
- Formularios desde configuración
- Validación dinámica

**Uso**:
```html
<app-dynamic-field 
  [control]="form.get('fieldName')" 
  [schema]="fieldSchema">
</app-dynamic-field>
```

## 🎓 Guía de Estudio

### 1. ¿Qué es ControlValueAccessor (CVA)?

CVA es una interfaz que permite crear componentes personalizados que funcionan como controles de formulario nativos de Angular.

**4 métodos requeridos**:

```typescript
// 1. Escribe valor desde el padre al componente
writeValue(value: any): void { }

// 2. Registra callback para notificar cambios al padre
registerOnChange(fn: any): void { }

// 3. Registra callback para notificar touch
registerOnTouched(fn: any): void { }

// 4. Habilita/deshabilita el control
setDisabledState(isDisabled: boolean): void { }
```

**Beneficios**:
- ✅ Reutilización de lógica de formulario
- ✅ Encapsulación de validaciones
- ✅ Integración perfecta con `formControlName`
- ✅ Testeo más fácil

### 2. FormArray Dinámico

FormArray permite gestionar listas dinámicas de controles.

**Operaciones comunes**:
```typescript
// Añadir control
this.formArray.push(new FormControl(value));

// Eliminar control
this.formArray.removeAt(index);

// Limpiar array
this.formArray.clear();

// Acceder a controles
const controls = this.formArray.controls;
```

### 3. Formularios desde JSON

El servicio `FormBuilderService` construye formularios dinámicamente:

```typescript
const schema: FormSchema = {
  fields: [
    { 
      name: 'email', 
      label: 'Email', 
      type: 'email', 
      required: true 
    }
  ]
};

const form = this.formBuilderService.buildFormFromSchema(schema);
```

## 🔍 Ejercicios Propuestos

1. **Añadir validación personalizada** a `BasicInfoFieldset` (ej: edad mínima)
2. **Crear un nuevo componente CVA** para teléfonos con validación internacional
3. **Extender `DynamicField`** para soportar un nuevo tipo de campo (ej: file upload)
4. **Añadir funcionalidad** de guardar/restaurar formulario en localStorage
5. **Implementar confirmación** antes de eliminar una dirección

## 📚 Recursos Adicionales

- [Angular Forms Documentation](https://angular.dev/guide/forms)
- [ControlValueAccessor Guide](https://angular.dev/api/forms/ControlValueAccessor)
- [FormArray Documentation](https://angular.dev/api/forms/FormArray)
- [Validators](https://angular.dev/api/forms/Validators)

## 🛠️ Tecnologías Utilizadas

- **Angular v20** - Framework
- **TypeScript v5.8** - Lenguaje
- **Reactive Forms** - Sistema de formularios
- **Standalone Components** - Arquitectura modular

## 💡 Patrones de Diseño Implementados

1. **Composition Pattern**: CVA dentro de CVA (AddressList usa AddressForm)
2. **Strategy Pattern**: FormBuilder construye formularios según schema
3. **Observer Pattern**: valueChanges para reactividad
4. **Template Method**: CVA define template, componentes implementan detalles

## 🤝 Contribuir

Este es un proyecto educativo. Siéntete libre de:
- Añadir nuevos componentes CVA
- Mejorar validaciones
- Añadir tests
- Mejorar documentación

## 📝 Notas Importantes

### CVA Best Practices

1. **Siempre marca el formulario interno con `emitEvent: false`** en `writeValue()`:
   ```typescript
   writeValue(value: any): void {
     this.form.patchValue(value, { emitEvent: false });
   }
   ```

2. **Registra providers en el decorador**:
   ```typescript
   providers: [
     {
       provide: NG_VALUE_ACCESSOR,
       useExisting: forwardRef(() => MyComponent),
       multi: true
     }
   ]
   ```

3. **Implementa Validator para propagar errores**:
   ```typescript
   validate(control: AbstractControl): ValidationErrors | null {
     return this.form.valid ? null : { invalidForm: true };
   }
   ```

### FormArray Tips

1. **Usa trackBy en ngFor** para mejor performance
2. **Valida el array completo** con validators personalizados
3. **Maneja el estado disabled** correctamente

## 🐛 Debugging

Para ver el valor del formulario en consola:
1. Abre DevTools (F12)
2. Haz clic en "Enviar Formulario"
3. Revisa la consola para ver el output

Para cargar datos de ejemplo:
1. Haz clic en "Cargar Datos de Ejemplo"
2. El formulario se poblará automáticamente

## 📄 Licencia

MIT - Uso educativo libre

---

**¡Happy coding! 🚀**

Para preguntas o sugerencias, abre un issue en el repositorio.
