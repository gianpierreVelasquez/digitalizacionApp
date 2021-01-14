export interface Desgravamen {
    cabecera?: Cabecera;
    solicitud?: Solicitud;
    producto?: Producto;
    riesgoDesgravamen?: RiesgoDesgravamen;
    asegurados?: Asegurados;
    beneficiarios?: Beneficiario[];
}

export interface Cabecera {
    codigoAplicacion?: string;
    codigoUsuario?: string;
}

export interface Solicitud {
    codCanal?: number;
    tipSolicitud?: number;
    nroSolicitudCaja?: number;
    fecSolicitud?: string;
    comentarios?: string;
}

export interface Producto {
    codCia?: number;
    codRamo?: number;
    numPolizaGrupo?: number;
    codPlan?: number;
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

export interface Asegurados {
    codParentesco?: string;
    tipDocum?: string;
    codDocum?: string;
    fecNacimiento?: string;
    estadoCivil?: string;
    nombre?: string;
    apePaterno?: string;
    mcaSexo?: string;
    nacionalidad?: string;
    apeMaterno?: string;
    codOcupacion?: number;
    tlfNumero?: number;
    tlfMovil?: string;
    email?: string;
    talla?: number;
    peso?: number;
    direccion?: Direccion[];
    cuestionario?: Cuestionario[];
}

export interface Direccion {
    codPais?: string;
    codDepartamento?: number;
    codProvincia?: number;
    codDistrito?: number;
    tipDomicilio?: number;
    nomDomicilio?: string;
    refDireccion?: string;
    codigoPostal?: number;
}

export interface Cuestionario {
    preguntas: Pregunta[];
    observaciones?: Observacion[];
}

export interface Pregunta {
    codPregunta: number;
    desPregunta?: string;
    codRespuesta: string;
    descRespuesta?: DescripcionRespuesta;
}

export interface DescripcionRespuesta {
    cantidad?: number;
    frecuencia?: string;
}

export interface Observacion {
    enfermedad?: string;
    fecha?: string;
    duracion?: string;
    clinica?: string;
    estado_actual?: string;
}

export interface Beneficiario {
    codParentesco?: number;
    tipDocum?: string;
    codDocum?: string;
    fecNacimiento?: string;
    porcParticipacion?: number;
    nombre?: string;
    apePaterno?: string;
    apeMaterno?: string;
    mcaSexo?: number;
    estadoCivil?: string;
}

export interface DireccionHelper {
    aseguradoP?: any[],
    aseguradoS?: any[]
}