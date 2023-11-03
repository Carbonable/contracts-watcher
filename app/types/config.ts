export type Config = {
    projects: Project[];
    voyagerContractURL: string;
    displayAPR: boolean;
}

export type Project = {
    slot: string;
    project: string;
    minter: string;
    yielder: string;
    offseter: string;
    migrator?: string;
}

export const DECIMALS = 6;
export const SECONDS_PER_YEAR = 31556925;