import { Abogado } from "./abogado";
export class Audiencia {
  idAudiencia?: number; 
  fecha: string;        
  direccion: string;
  abogado: Abogado;     
  hora?: string;        
  tipoAudiencia?: string;
  lugarLink?: string;
         
}