// To parse this data:
//
//   import { Convert, Match } from "./file";
//
//   const match = Convert.toMatch(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.
/* eslint-disable */
export interface Match {
    success: number;
    results: Result[];
}

export interface Result {
    id:                string;
    sport_id:          string;
    time:              string;
    time_status:       string;
    league:            Away;
    home:              Away;
    away:              Away;
    ss:                string;
    stats:             Stats;
    events:            Event[];
    scores:            { [key: string]: Score };
    extra:             Extra;
    inplay_created_at: string;
    inplay_updated_at: string;
    confirmed_at:      string;
    bet365_id:         string;
}

export interface Away {
    id:        string;
    name:      string;
    image_id?: number;
    cc:        null | string;
}

export interface Event {
    id:   string;
    text: string;
}

export interface Extra {
    bestofsets:   string;
    stadium_data: StadiumData;
    round:        string;
    ground:       string;
}

export interface StadiumData {
    id:           string;
    name:         string;
    city:         string;
    country:      string;
    capacity:     null;
    googlecoords: null;
}

export interface Score {
    home: string;
    away: string;
}

export interface Stats {
    aces:                    string[];
    double_faults:           string[];
    win_1st_serve:           string[];
    break_point_conversions: string[];
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toMatch(json: string): Match {
        return cast(JSON.parse(json), r("Match"));
    }

    public static matchToJson(value: Match): string {
        return JSON.stringify(uncast(value, r("Match")), null, 2);
    }
}

function invalidValue(typ: any, val: any, key: any, parent: any = ''): never {
    const prettyTyp = prettyTypeName(typ);
    const parentText = parent ? ` on ${parent}` : '';
    const keyText = key ? ` for key "${key}"` : '';
    throw Error(`Invalid value${keyText}${parentText}. Expected ${prettyTyp} but got ${JSON.stringify(val)}`);
}

function prettyTypeName(typ: any): string {
    if (Array.isArray(typ)) {
        if (typ.length === 2 && typ[0] === undefined) {
            return `an optional ${prettyTypeName(typ[1])}`;
        } else {
            return `one of [${typ.map(a => { return prettyTypeName(a); }).join(", ")}]`;
        }
    } else if (typeof typ === "object" && typ.literal !== undefined) {
        return typ.literal;
    } else {
        return typeof typ;
    }
}

function jsonToJSProps(typ: any): any {
    if (typ.jsonToJS === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.json] = { key: p.js, typ: p.typ });
        typ.jsonToJS = map;
    }
    return typ.jsonToJS;
}

function jsToJSONProps(typ: any): any {
    if (typ.jsToJSON === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.js] = { key: p.json, typ: p.typ });
        typ.jsToJSON = map;
    }
    return typ.jsToJSON;
}

function transform(val: any, typ: any, getProps: any, key: any = '', parent: any = ''): any {
    function transformPrimitive(typ: string, val: any): any {
        if (typeof typ === typeof val) return val;
        return invalidValue(typ, val, key, parent);
    }

    function transformUnion(typs: any[], val: any): any {
        // val must validate against one typ in typs
        const l = typs.length;
        for (let i = 0; i < l; i++) {
            const typ = typs[i];
            try {
                return transform(val, typ, getProps);
            } catch (_) {}
        }
        return invalidValue(typs, val, key, parent);
    }

    function transformEnum(cases: string[], val: any): any {
        if (cases.indexOf(val) !== -1) return val;
        return invalidValue(cases.map(a => { return l(a); }), val, key, parent);
    }

    function transformArray(typ: any, val: any): any {
        // val must be an array with no invalid elements
        if (!Array.isArray(val)) return invalidValue(l("array"), val, key, parent);
        return val.map(el => transform(el, typ, getProps));
    }

    function transformDate(val: any): any {
        if (val === null) {
            return null;
        }
        const d = new Date(val);
        if (isNaN(d.valueOf())) {
            return invalidValue(l("Date"), val, key, parent);
        }
        return d;
    }

    function transformObject(props: { [k: string]: any }, additional: any, val: any): any {
        if (val === null || typeof val !== "object" || Array.isArray(val)) {
            return invalidValue(l(ref || "object"), val, key, parent);
        }
        const result: any = {};
        Object.getOwnPropertyNames(props).forEach(key => {
            const prop = props[key];
            const v = Object.prototype.hasOwnProperty.call(val, key) ? val[key] : undefined;
            result[prop.key] = transform(v, prop.typ, getProps, key, ref);
        });
        Object.getOwnPropertyNames(val).forEach(key => {
            if (!Object.prototype.hasOwnProperty.call(props, key)) {
                result[key] = transform(val[key], additional, getProps, key, ref);
            }
        });
        return result;
    }

    if (typ === "any") return val;
    if (typ === null) {
        if (val === null) return val;
        return invalidValue(typ, val, key, parent);
    }
    if (typ === false) return invalidValue(typ, val, key, parent);
    let ref: any = undefined;
    while (typeof typ === "object" && typ.ref !== undefined) {
        ref = typ.ref;
        typ = typeMap[typ.ref];
    }
    if (Array.isArray(typ)) return transformEnum(typ, val);
    if (typeof typ === "object") {
        return typ.hasOwnProperty("unionMembers") ? transformUnion(typ.unionMembers, val)
            : typ.hasOwnProperty("arrayItems")    ? transformArray(typ.arrayItems, val)
            : typ.hasOwnProperty("props")         ? transformObject(getProps(typ), typ.additional, val)
            : invalidValue(typ, val, key, parent);
    }
    // Numbers can be parsed by Date but shouldn't be.
    if (typ === Date && typeof val !== "number") return transformDate(val);
    return transformPrimitive(typ, val);
}

function cast<T>(val: any, typ: any): T {
    return transform(val, typ, jsonToJSProps);
}

function uncast<T>(val: T, typ: any): any {
    return transform(val, typ, jsToJSONProps);
}

function l(typ: any) {
    return { literal: typ };
}

function a(typ: any) {
    return { arrayItems: typ };
}

function u(...typs: any[]) {
    return { unionMembers: typs };
}

function o(props: any[], additional: any) {
    return { props, additional };
}

function m(additional: any) {
    return { props: [], additional };
}

function r(name: string) {
    return { ref: name };
}

const typeMap: any = {
    "Match": o([
        { json: "success", js: "success", typ: 0 },
        { json: "results", js: "results", typ: a(r("Result")) },
    ], false),
    "Result": o([
        { json: "id", js: "id", typ: "" },
        { json: "sport_id", js: "sport_id", typ: "" },
        { json: "time", js: "time", typ: "" },
        { json: "time_status", js: "time_status", typ: "" },
        { json: "league", js: "league", typ: r("Away") },
        { json: "home", js: "home", typ: r("Away") },
        { json: "away", js: "away", typ: r("Away") },
        { json: "ss", js: "ss", typ: "" },
        { json: "stats", js: "stats", typ: r("Stats") },
        { json: "events", js: "events", typ: a(r("Event")) },
        { json: "scores", js: "scores", typ: m(r("Score")) },
        { json: "extra", js: "extra", typ: r("Extra") },
        { json: "inplay_created_at", js: "inplay_created_at", typ: "" },
        { json: "inplay_updated_at", js: "inplay_updated_at", typ: "" },
        { json: "confirmed_at", js: "confirmed_at", typ: "" },
        { json: "bet365_id", js: "bet365_id", typ: "" },
    ], false),
    "Away": o([
        { json: "id", js: "id", typ: "" },
        { json: "name", js: "name", typ: "" },
        { json: "image_id", js: "image_id", typ: u(undefined, 0) },
        { json: "cc", js: "cc", typ: u(null, "") },
    ], false),
    "Event": o([
        { json: "id", js: "id", typ: "" },
        { json: "text", js: "text", typ: "" },
    ], false),
    "Extra": o([
        { json: "bestofsets", js: "bestofsets", typ: "" },
        { json: "stadium_data", js: "stadium_data", typ: r("StadiumData") },
        { json: "round", js: "round", typ: "" },
        { json: "ground", js: "ground", typ: "" },
    ], false),
    "StadiumData": o([
        { json: "id", js: "id", typ: "" },
        { json: "name", js: "name", typ: "" },
        { json: "city", js: "city", typ: "" },
        { json: "country", js: "country", typ: "" },
        { json: "capacity", js: "capacity", typ: null },
        { json: "googlecoords", js: "googlecoords", typ: null },
    ], false),
    "Score": o([
        { json: "home", js: "home", typ: "" },
        { json: "away", js: "away", typ: "" },
    ], false),
    "Stats": o([
        { json: "aces", js: "aces", typ: a("") },
        { json: "double_faults", js: "double_faults", typ: a("") },
        { json: "win_1st_serve", js: "win_1st_serve", typ: a("") },
        { json: "break_point_conversions", js: "break_point_conversions", typ: a("") },
    ], false),
};
