export class ServicioLegal {
  idServicio?: number;     // Opcional (?) porque se autogenera en el backend (IDENTITY)
  nombre: string;          // nullable = false (obligatorio)
  descripcion: string;     // nullable = false (obligatorio)
  estado: string;          // nullable = false (obligatorio)
  costoBase?: number;      // Opcional (?) porque en Java es nullable = true
}