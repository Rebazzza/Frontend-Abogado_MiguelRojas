export interface pagoPendiente{
    idPago: number;
    monto: Float32Array;
    estadoPago: boolean;
}

export class pago {
    idPago: number;
    metodoPago: string;
    monto: Float32Array;

    fechaPago: Date;
    estadoPago: boolean;
    
}