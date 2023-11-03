import { useProjectAbis } from './ProjectAbisWrapper';
import CumulativeAbsorptionCurve from './analytics/CumulativeAbsorptionCurve';
import CumulativeSaleCurve from './analytics/CumulativeSaleCurve';
import UpdatedPriceCurve from './analytics/UpdatedPriceCurve';
import APRCurve from './analytics/APRCurve';
import { useConfig } from '~/root';

export default function Analytics() {
    const { projectAbi, yielderAbi } = useProjectAbis();
    const { displayAPR } = useConfig();

    if (!projectAbi || !yielderAbi) {
        return (
            <div>Project ABI or Yielder ABI is undefined...</div>
        )
    }

    return (
        <>
            <CumulativeAbsorptionCurve />
            <UpdatedPriceCurve />
            <CumulativeSaleCurve />
            { displayAPR && <APRCurve /> }
        </>
    )
}