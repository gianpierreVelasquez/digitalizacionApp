export interface Response {
    data?: Data[];
}

export interface Data {
    codigo: string;
    texto: string;
}

export interface PlanData {
    id: string;
    price: string;
    text: string;
    coverages: Coverage[];
}

export interface Coverage {
    id: string;
    text: string;
    sum_assured: string;
}