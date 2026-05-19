export class Especialista {
  idEspecialista?: number;   // Opcional (?) solo porque es IDENTITY (autogenerado por el backend)
  nombre: string;           // nullable = false
  descripcion: string;      // nullable = false
  estado: string;           // nullable = false
  dni: boolean;             // nullable = false (Ojo: revisa si en Java querías 'String' o realmente es 'boolean')
  disponibilidad: boolean;  // nullable = false
  telefono: string;         // nullable = false
  correo: string;           // nullable = false
}