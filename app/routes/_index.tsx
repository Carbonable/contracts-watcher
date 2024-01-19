import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import Card from "~/components/collection/Card";
import { useConfig } from "~/root";

export const meta: MetaFunction = () => {
  return [
    { title: "RWA Smart Contracts Watcher" },
    { name: "description", content: "Monitor Real World Assets Smart Contracts on Starknet" },
  ];
};

export default function Index() {
    const { config } = useConfig();
    const collections = config.collections;

    return (
        <>
            <h1 className="text-2xl uppercase font-bold">Collections</h1>
            <div className="mt-4 w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {collections.map((collection) => (
                    <Link to={`/collections/${collection.id}`} className="hover:brightness-110" key={collection.id}>
                        <Card collectionId={collection.id} />
                    </Link>
                ))}
            </div>
        </>
    )
}
