// To parse this data:
//
//   import { Convert, TeamMembers } from "./file";
//
//   const teamMembers = Convert.toTeamMembers(json);

export interface TeamMembersRes {
    success: number;
    results: TeamMembers[];
}

export interface TeamMembers {
    id:       string;
    name:     string;
    image_id: number;
    cc:       string;
}

// Converts JSON strings to/from your types
export class Convert {
    public static toTeamMembers(json: string): TeamMembers {
        return JSON.parse(json);
    }

    public static teamMembersToJson(value: TeamMembers): string {
        return JSON.stringify(value);
    }
}
