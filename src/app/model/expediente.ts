//esta es lo que se mostrara en la vista resumida de los expedientes
export class expediente {
    idExPediente: number;
    titulo: string;
    tipoExpediente: string;
    resumenExpediente: string;

    victima: string;
    victimario: string;
    
    fechaInicio: string;
    fechaCierre: string;

    //el expediente recien agregado por defecto esta en proceso = false
    estadoExpediente: boolean = false;
    
    idCaso: number;
}