export type Config = {
    projects: Project[];
    voyagerContractURL: string;
}

export type Project = {
    slot: string;
    project: string;
    minter: string;
    yielder: string;
    offseter: string;
}

export const DECIMALS = 6;