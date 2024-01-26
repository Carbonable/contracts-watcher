export type Config = {
    config: ConfigFile;
    voyagerContractURL: string;
    isPublic: boolean;
    forecast: ForecastFile;
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

export type ForecastFile = {
    forecast: Forecast[];
}

export type Forecast = {
    type: string;
    values: Value[];
}

export type Value = {
    year: number;
    price: number;
}

export const DECIMALS = 6;
export const SECONDS_PER_YEAR = 31556925;
export const FEES: number = 0.85;