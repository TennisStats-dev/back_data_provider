// To parse this data:
//
//   import { Convert, APIError } from "./file";
//
//   const aPIError = Convert.toAPIError(json);

export interface APIError {
    code:     number;
    config:   Config;
    request:  Request;
    response: Response;
}

export interface Config {
    data:   string;
    method: string;
    params: Params;
    url:    string;
}

export interface Params {
    page:     number;
    sport_id: number;
}

export interface Request {
    path: string;
}

export interface Response {
    data:   Data;
    status: number;
}

export interface Data {
    error:        string;
    error_detail: string;
    success:      number;
}

// Converts JSON strings to/from your types
export class Convert {
    public static toAPIError(json: string): APIError {
        return JSON.parse(json);
    }

    public static aPIErrorToJson(value: APIError): string {
        return JSON.stringify(value);
    }
}
