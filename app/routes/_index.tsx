import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import ProjectImage from "~/components/project/ProjectImage";
import ProjectAbisWrapper from "~/components/project/ProjectAbisWrapper";
import SlotURIWrapper from "~/components/project/SlotURI";
import { useConfig } from "~/root";

export const meta: MetaFunction = () => {
  return [
    { title: "Carbonable Smart Contracts Watcher" },
    { name: "description", content: "Monitor Carbonable Smart Contracts" },
  ];
};

export default function Index() {
  const { projects } = useConfig();

    return (
        <>
            <h1 className="text-2xl uppercase font-bold">Projects</h1>
            <div className="mt-4 w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {projects.map((project, index) => (
                    <ProjectAbisWrapper 
                        key={`abi_${project.slot}_${index}`} 
                        projectAddress={project.project}
                        slot={project.slot}
                    >
                        <Link to={`/projects/${project.project}/${project.slot}`} className="hover:brightness-110">
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
