import { useProvider } from "@starknet-react/core";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Abi } from "starknet";
import type { Project } from "~/types/config";
import { fetchAbi } from "~/utils/starknet";

type ProjectAbiContextType = {
    projectAbi: Abi,
    minterAbi?: Abi,
    yielderAbi?: Abi,
    offseterAbi?: Abi,
    migratorAbi?: Abi,
    projectAddress: string,
    minterAddress?: string,
    yielderAddress?: string,
    offseterAddress?: string,
    migratorAddress?: string,
    oldNFTAddress?: string,
    slot: string
}

const ProjectAbiContext = createContext<ProjectAbiContextType>({} as ProjectAbiContextType);

export default function ProjectAbisWrapper({ children, project }: { children: React.ReactNode, project: Project }) {
    const { provider } = useProvider();

    const minterAddress = useMemo(() => project.minter, [project]);
    const yielderAddress = useMemo(() => project.yielder, [project]);
    const offseterAddress = useMemo(() => project.offseter, [project]);
    const migratorAddress = useMemo(() => project.migrator, [project]);
    const oldNFTAddress = useMemo(() => project.old_nft, [project]);

    const [projectAbi, setProjectAbi] = useState<Abi|undefined>(undefined);
    const [minterAbi, setMinterAbi] = useState<Abi|undefined>(undefined);
    const [yielderAbi, setYielderAbi] = useState<Abi|undefined>(undefined);
    const [offseterAbi, setOffseterAbi] = useState<Abi|undefined>(undefined);
    const [migratorAbi, setMigratorAbi] = useState<Abi|undefined>(undefined);
    
    useEffect(() => {
        async function fetchProjectAbiWrapper() {
            const projectAbiResult = await fetchAbi(provider, project.project);
            setProjectAbi(projectAbiResult);

        }
        fetchProjectAbiWrapper();
    }, [provider, project.project]);

    useEffect(() => {
        async function fetchMinterAbiWrapper() {

            if (minterAddress !== undefined) {
                const minterAbiResult = await fetchAbi(provider, minterAddress);
                setMinterAbi(minterAbiResult);
            }
        }
        fetchMinterAbiWrapper();
    }, [provider, minterAddress]);

    useEffect(() => {
        async function fetchYielderAbiWrapper() {

            if (yielderAddress !== undefined) {
                const yielderAbiResult = await fetchAbi(provider, yielderAddress);
                setYielderAbi(yielderAbiResult);
            }
        }
        fetchYielderAbiWrapper();
    }, [provider, yielderAddress]);

    useEffect(() => {
        async function fetchOffseterAbiWrapper() {

            if (offseterAddress !== undefined) {
                const offseterAbiResult = await fetchAbi(provider, offseterAddress);
                setOffseterAbi(offseterAbiResult);
            }
        }
        fetchOffseterAbiWrapper();
    }, [provider, offseterAddress]);

    useEffect(() => {
        async function fetchMigratorAbiWrapper() {

            if (migratorAddress !== undefined) {
                const migratorAbiResult = await fetchAbi(provider, migratorAddress);
                setMigratorAbi(migratorAbiResult);
            }
        }
        fetchMigratorAbiWrapper();
    }, [provider, migratorAddress]);


    if (projectAbi === undefined) { return null; }

    return (
        <ProjectAbiContext.Provider 
            value={{ projectAbi, minterAbi, yielderAbi, offseterAbi, migratorAbi, projectAddress: project.project, minterAddress, yielderAddress, offseterAddress, migratorAddress, oldNFTAddress, slot:project.slot }}
        >
            { children }
        </ProjectAbiContext.Provider>
    );
}


export function useProjectAbis() {
    return useContext(ProjectAbiContext);
}