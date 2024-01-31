import { ForecastType } from "~/types/config";
import * as ToggleGroup from '@radix-ui/react-toggle-group';

export default function ForecastScenario({selectedForecastType, setSelectedForecastType}: {selectedForecastType: ForecastType, setSelectedForecastType: (forecastType: ForecastType) => void}) {
    const toggleGroupItemClasses = 'hover:bg-neutral-700/50 data-[state=on]:bg-neutral-600/70 px-4 py-2 first:rounded-l-xl last:rounded-r-xl';

    return (
        <>
        <ToggleGroup.Root
            className="inline-flex rounded-xl border border-neutral-600"
            type="single"
            defaultValue={ForecastType.BASE}
            value={selectedForecastType}
            onValueChange={(value) => {
            if (value) setSelectedForecastType(value as ForecastType);
            }}
        >
            <ToggleGroup.Item value={ForecastType.WORST} className={toggleGroupItemClasses}>
                {ForecastType.WORST}
            </ToggleGroup.Item>
            <ToggleGroup.Item value={ForecastType.BASE} className={toggleGroupItemClasses}>
                {ForecastType.BASE}
            </ToggleGroup.Item>
            <ToggleGroup.Item value={ForecastType.BEST} className={toggleGroupItemClasses}>
                {ForecastType.BEST}
            </ToggleGroup.Item>
        </ToggleGroup.Root>
        </>
    )
}