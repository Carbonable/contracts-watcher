import { useProjectAbis } from './ProjectAbisWrapper';
import CumulativeAbsorptionCurve from './analytics/CumulativeAbsorptionCurve';
import CumulativeSaleCurve from './analytics/CumulativeSaleCurve';
import APRCurve from './analytics/APRCurve';
import { useConfig } from '~/root';
import ForecastCurve from './analytics/ForecastCurve';
import ResaleMargin from './analytics/ResaleMargin';

export default function Analytics() {
    const { projectAbi, yielderAbi } = useProjectAbis();
    const {isPublic } = useConfig();

    if (!projectAbi && !yielderAbi) {
        return (
            <div className="w-full mt-4 text-xl text-neutral-300">No analytics available yet.</div>
        )
    }

    return (
        <>
            {projectAbi && <CumulativeAbsorptionCurve />}
            {yielderAbi && 
                <>
                    <ForecastCurve />
                    <ResaleMargin />
                    { !isPublic && <CumulativeSaleCurve /> }
                    { !isPublic && <APRCurve /> }
                </>
            }
        </>
    )
}