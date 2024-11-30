import { Link, useLoaderData } from "@remix-run/react";
import ProjectImage from "~/components/project/ProjectImage";
import ProjectAbisWrapper from "~/components/project/ProjectAbisWrapper";
import SlotURIWrapper, { useSlotURI } from "~/components/project/SlotURI";
import { json, type LoaderFunctionArgs } from "@remix-run/node";
import type { Collection } from "~/types/config";
import ProjectMap from "~/components/project/ProjectMap";
import { useConfig } from "~/root";
import { useEffect, useState } from "react";
// import "maplibre-gl/dist/maplibre-gl.css";


export async function loader({params}: LoaderFunctionArgs) {
    const collectionId = params.collection;

    if (!collectionId) {
        return json({ projects: null });
    }

    return json({ collectionId });
}



type LoaderDataProps = {
    collectionId: string;
}

interface StackMapDataProps {
    onTrigger?: (data: any) => void;
    mapData: any;
    project: string;
    projectSlot: string;
    collectionId: string;
}

const StackMapData: React.FC<StackMapDataProps> = ({ onTrigger = () => {}, mapData, project, projectSlot, collectionId }) => {
    const slotURI = useSlotURI();
    useEffect(() => {
        if (Object.keys(slotURI).length !== 0) {
            slotURI.project = project;
            slotURI.projectSlot = projectSlot;
            slotURI.collectionId = collectionId;
            onTrigger([...mapData, slotURI ]);
        }
    }, []);
    return null;
}

export default function Index() {
    const { collectionId } = useLoaderData() as LoaderDataProps;
    const { config } = useConfig();
    const [mapData, setMapData] = useState<any>([])
    const collections = config.collections;
    const collection: Collection | undefined = collections.find((collection: Collection) => collection.id === collectionId);

    if (!collection) {
        return null;
    }

    return (
        <>
            <h1 className="text-2xl uppercase font-bold">{collection.name}'s Projects</h1>
            <div className="relative mt-6">
                <ProjectMap mapData={mapData} />
            </div>
            <div className="mt-4 w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {collection.projects.map((project, index) => (
                    <ProjectAbisWrapper 
                        key={`abi_${project.slot}_${index}`} 
                        project={project}
                    >
                        <Link to={`/collections/${collection.id}/projects/${project.project}/${project.slot}`} className="hover:brightness-110">
                            <SlotURIWrapper>
                                <StackMapData mapData={mapData} projectSlot={project.slot} project={project.project} collectionId={collection.id} onTrigger={setMapData}  />
                                <ProjectImage />
                            </SlotURIWrapper>
                        </Link>
                    </ProjectAbisWrapper>
                ))}
            </div>
        </>
    )
}
