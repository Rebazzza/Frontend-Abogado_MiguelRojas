export interface Usuario {
  idUsuario: number;
  username: string;
  password?: string;
  idRol: number;
  rolName: string;
  idAbogado?: number | null;
  abogadoNombre?: string;
}