export type Config = {
    config: ConfigFile;
    voyagerContractURL: string;
    displayAPR: boolean;
    isPublic: boolean;
}

export type ConfigFile = {
    collections: Collection[];
}

export type Collection = {
    id: string;
    name: string;
    logo: string;
    projects: Project[];
}

export type Project = {
    slot: string;
    project: string;
    minter: string;
    yielder: string;
    offseter: string;
    migrator?: string;
    old_nft?: string;
}

export const DECIMALS = 6;
export const SECONDS_PER_YEAR = 31556925;