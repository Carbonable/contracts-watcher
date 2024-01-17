import { useLocation, useNavigate } from "@remix-run/react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function Back() {
    const resolvedPath = useLocation();
    const navigate = useNavigate();

    return (
        <>
            { 
                resolvedPath.pathname.split( '/' ).length > 2 && 
                <div className="flex items-center w-min mb-8">
                    <span className="flex cursor-pointer text-neutral-200 hover:text-neutral-100" onClick={() => navigate(-1)}>
                        <ArrowLeftIcon className="w-4 mr-2" />
                        Back
                    </span>
                </div>
            }
        </>
    )
}