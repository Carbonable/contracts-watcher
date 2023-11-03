import { useProvider } from "@starknet-react/core";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Abi } from "starknet";
import { useConfig } from "~/root";
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

export default function ProjectAbisWrapper({ children, projectAddress, slot }: { children: React.ReactNode, projectAddress: string, slot: string }) {
    const { provider } = useProvider();
    const { projects } = useConfig();

    const minterAddress = useMemo(() => projects.find((project) => project.slot === slot)?.minter, [projects, slot]);
    const yielderAddress = useMemo(() => projects.find((project) => project.slot === slot)?.yielder, [projects, slot]);
    const offseterAddress = useMemo(() => projects.find((project) => project.slot === slot)?.offseter, [projects, slot]);
    const migratorAddress = useMemo(() => projects.find((project) => project.slot === slot)?.migrator, [projects, slot]);
    const oldNFTAddress = useMemo(() => projects.find((project) => project.slot === slot)?.old_nft, [projects, slot]);

    const [projectAbi, setProjectAbi] = useState<Abi|undefined>(undefined);
    const [minterAbi, setMinterAbi] = useState<Abi|undefined>(undefined);
    const [yielderAbi, setYielderAbi] = useState<Abi|undefined>(undefined);
    const [offseterAbi, setOffseterAbi] = useState<Abi|undefined>(undefined);
    const [migratorAbi, setMigratorAbi] = useState<Abi|undefined>(undefined);
    
    useEffect(() => {
        async function fetchProjectAbiWrapper() {
            const projectAbiResult = await fetchAbi(provider, projectAddress);
            setProjectAbi(projectAbiResult);

        }
        fetchProjectAbiWrapper();
    }, [provider, projectAddress]);

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
            value={{ projectAbi, minterAbi, yielderAbi, offseterAbi, migratorAbi, projectAddress, minterAddress, yielderAddress, offseterAddress, migratorAddress, oldNFTAddress, slot }}
        >
            { children }
        </ProjectAbiContext.Provider>
    );
}


export function useProjectAbis() {
    return useContext(ProjectAbiContext);
}