export interface Desgravamen {
    cabecera?: Cabecera;
    solicitud?: Solicitud;
    producto?: any;
    riesgoDesgravamen?: any;
    asegurados?: any;
    beneficiarios?: any;
}

export interface Cabecera {
    codigoAplicacion?: string;
    codigoUsuario?: string;
}

export interface Solicitud {
    codCanal?: number;
    nroSolicitudCaja?: number;
    fecSolicitud?: string;
    comentarios?: string;
}

export interface Producto {
    codCia?: number;
    codRamo?: number;
    numPolizaGrupo?: string;
    codPlan?: string;
}

export interface RiesgoDesgravamen {
    codTipoConformacion?: number;
    codTipoPrestamo?: number;
    codMonedaPrestamo?: number;
    impPrestamo?: number;
    numPrestamo?: number;
    codMonedaCumulo?: number;
    impCumulo?: number;
    plazoPrestamo?: number;
}