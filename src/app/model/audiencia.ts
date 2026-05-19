import { Abogado } from "./abogado";
import {Caso} from "./caso";



export class Audiencia {
  idAudiencia?: number; 
  fecha: string;        
  direccion: string;
  abogado: Abogado;     
  hora?: string;        
  tipoAudiencia?: string;
  lugarLink?: string;
  caso: Caso;           
}