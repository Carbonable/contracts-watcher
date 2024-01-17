import { type LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import ProjectImage from "~/components/project/ProjectImage";
import ProjectAbisWrapper from "~/components/project/ProjectAbisWrapper";
import SlotURIWrapper from "~/components/project/SlotURI";
import ProjectInfo from "~/components/project/ProjectInfo";
import ProjectMetadata from "~/components/project/ProjectMetadata";
import { Title } from "~/components/common/Title";
import ContractsTabs from "~/components/project/ContractsTabs";
import Analytics from "~/components/project/Analytics";
import MigrationStatusWrapper from "~/components/project/MigrationStatusWrapper";
import type { Collection, ConfigFile } from "~/types/config";
import { useConfig } from "~/root";

export async function loader({params}: LoaderFunctionArgs) {
    return json({ project_address: params.project, slot: params.slot, collectionId: params.collection });
}

type LoaderDataProps = {
    project_address: string;
    collectionId: string;
    slot: string;
}

export default function Index() {
    const { project_address, slot, collectionId } = useLoaderData() as LoaderDataProps;
    const { config } = useConfig() as { config: ConfigFile };
    const collections = config.collections;
    const collection: Collection | undefined = collections.find((collection: Collection) => collection.id === collectionId);
    const project = collection?.projects.find((project) => project.project === project_address && project.slot === slot);

    if (!project) {
        return null;
    }

    return (
        <>  
            <ProjectAbisWrapper 
                key={`abi_${slot}`} 
                project={project}
            >
                <SlotURIWrapper>
                    <div className="w-full flex flex-wrap">
                        <div className="w-full md:w-1/3">
                            <ProjectImage />
                        </div>
                        <div className="w-full md:w-2/3 md:px-8 mt-4 md:mt-0">
                            <ProjectInfo />
                        </div>
                        <div className="w-full ml-1">
                            <ProjectMetadata />
                        </div>
                    </div>
                </SlotURIWrapper>
                <div className="w-full">
                    <Title
                        title="Contracts information"
                        icon="🪪"
                     />
                     <ContractsTabs />
                </div>
                <div className="w-full">
                    <Title
                        title="Migration status"
                        icon="⛓️"
                     />
                     <MigrationStatusWrapper />
                </div>
                <div className="w-full">
                    <Title
                        title="Contracts analytics"
                        icon="📊"
                     />
                     <Analytics />
                </div>
            </ProjectAbisWrapper>
        </>
    );
}