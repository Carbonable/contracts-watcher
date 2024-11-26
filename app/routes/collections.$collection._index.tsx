import { Link, useLoaderData } from "@remix-run/react";
import ProjectImage from "~/components/project/ProjectImage";
import ProjectAbisWrapper from "~/components/project/ProjectAbisWrapper";
import SlotURIWrapper from "~/components/project/SlotURI";
import { json, type LoaderFunctionArgs } from "@remix-run/node";
import type { Collection } from "~/types/config";
import { useConfig } from "~/root";
import { ProjectDetailSkeleton } from "~/components/common/ProjectDetailsSkeleton";

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

export default function Index() {
    const { collectionId } = useLoaderData() as LoaderDataProps;
    const { config } = useConfig();
    const collections = config.collections;
    const collection: Collection | undefined = collections.find((collection: Collection) => collection.id === collectionId);

    if (!collection) {
        return <ProjectDetailSkeleton/>
    }

    return (
        <>
            <h1 className="text-2xl uppercase font-bold">{collection.name}'s Projects</h1>
            <div className="mt-4 w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {collection.projects.map((project, index) => (
                    <ProjectAbisWrapper 
                        key={`abi_${project.slot}_${index}`} 
                        project={project}
                    >
                        <Link to={`/collections/${collection.id}/projects/${project.project}/${project.slot}`} className="hover:brightness-110">
                            <SlotURIWrapper>
                                <ProjectImage />
                            </SlotURIWrapper>
                        </Link>
                    </ProjectAbisWrapper>
                ))}
            </div>
        </>
    )
}
