import { useContractRead } from "@starknet-react/core";
import { useEffect, useState } from "react";
import { Area, AreaChart, Label, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChartsDescription, Subtitle } from "~/components/common/Title";
import { useProjectAbis } from "../ProjectAbisWrapper";
import { shortString } from "starknet";
import { SECONDS_PER_YEAR } from "~/types/config";
import { bigIntToNumber } from "~/utils/starknet";

export default function APRCurve() {
    const { yielderAbi, yielderAddress, minterAbi, minterAddress, projectAbi, projectAddress, slot } = useProjectAbis();
    const [graphData, setGraphData] = useState([{}]);

    const { data: cumSaleData, isLoading: isLoadingCumSale, error: errorCumSale } = useContractRead({
        address: yielderAddress,
        abi: yielderAbi,
        functionName: 'get_cumsales',
        parseResult: false
    });

    const { data: cumSaleTimesData, isLoading: isLoadingTimes, error: errorTimes } = useContractRead({
        address: yielderAddress,
        abi: yielderAbi,
        functionName: 'get_cumsale_times',
        parseResult: false
    });

    const { data: priceTimesData, isLoading: isLoadingPriceTimes, error: errorPriceTimes } = useContractRead({
        address: yielderAddress,
        abi: yielderAbi,
        functionName: 'get_price_times',
        parseResult: false
    });

    const { data: unitPriceData, isLoading: isLoadingUnitPrice, error: errorUnitPrice } = useContractRead({
        address: minterAddress,
        abi: minterAbi,
        functionName: 'get_unit_price',
    });

    const { data: projectValueData, isLoading: isLoadingProjectValue, error: errorProjectValue } = useContractRead({
        address: projectAddress,
        abi: projectAbi,
        functionName: 'get_project_value',
        args: [slot],
    });

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="px-8 pt-4 pb-4 bg-neutral-700/90 border border-neutral-500 font-inter rounded-xl">
                    <p className="text-center uppercase bold text-neutral-100">{label}</p>
                    <p className="text-left text-[#ffe4c4] mt-2">APR: {Number(payload[0].value).toFixed(2)}%</p>
                </div>
            );
        }
      
        return null;
    };

    useEffect(() => {
        if (cumSaleTimesData === undefined || cumSaleData === undefined || priceTimesData === undefined || unitPriceData === undefined || projectValueData === undefined) { return; }

        const cumSale = (cumSaleData as Array<string>).slice(1);
        const times = (cumSaleTimesData as Array<string>).slice(1);

        cumSale.map(shortString.decodeShortString).join('');
        const filteredCumSale = cumSale.filter((price, i) => price !== '0x0' || i === 0);
        const priceTimes = (priceTimesData as Array<string>).slice(1);
        const lastPriceTime = new Date(Number(priceTimes[priceTimes.length - 1]) * 1000);

        const data = times.map((time, i) => {
            const currentTime = new Date(Number(time) * 1000);
            
            const num = i === 0 ? null : (Number(filteredCumSale[i]) - Number(filteredCumSale[i - 1])) * SECONDS_PER_YEAR;
            const den  = i === 0 ? null : (bigIntToNumber(unitPriceData as bigint) * bigIntToNumber(projectValueData as bigint)) * (Number(times[i]) - Number(times[i - 1]));
            const apr = num && den ? num / den * 100 : 0;

            return {
                year: new Date(Number(time) * 1000).toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }),
                apr: currentTime <= lastPriceTime ? apr : null,
                future_apr: currentTime >= lastPriceTime ? apr : null,
            }
        });
        setGraphData(data);
    }, [cumSaleTimesData, cumSaleData, priceTimesData, unitPriceData, projectValueData]);


    if (isLoadingTimes || isLoadingCumSale || isLoadingPriceTimes || isLoadingUnitPrice || isLoadingProjectValue) {
        return (
            <div>Loading absorption curve...</div>
        )
    }

    if (errorTimes || errorCumSale || errorPriceTimes || errorUnitPrice || errorProjectValue) {
        return (
            <div>Error loading absorption curve...</div>
        )
    }

    return (
        <>
            <Subtitle title="APR Curve" />
            <ChartsDescription>
                This charts shows the APR curve of the project. Past values represents the real APR while future values are the expected APR based on expected sell prices and project absorption.
            </ChartsDescription>
            <div className="w-full min-h-[400px]">
                <ResponsiveContainer width="100%" height="100%" minHeight='400px'>
                    <AreaChart
                        width={1000}
                        height={3000}
                        data={graphData}
                        margin={{ top: 10, right: 10, left: 20, bottom: 20 }}
                        style={{
                            fontSize: '14px',
                            fontFamily: 'Inter',
                        }}
                    >
                        <defs>
                            <linearGradient id="colorAPR" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#ffe4c4" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#ffe4c4" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorFutureAPR" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#ffe4c4" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#ffe4c4" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="year">
                            <Label value="Date" offset={-4} position="insideBottom" style={{ textAnchor: 'middle', fontSize: '100%', fill: '#878A94' }} />
                        </XAxis>
                        <YAxis>
                            <Label value="APR (%)" offset={-2}  angle={-90} position="insideLeft" style={{ textAnchor: 'middle', fontSize: '100%', fill: '#878A94' }} />
                        </YAxis>
                        <Area name="APR curve" type="monotone" dataKey="apr" fill={'url(#colorAPR)'} stroke={'#ffe4c4'} dot={false} activeDot={true} />
                        <Area name="APR curve" type="monotone" dataKey="future_apr" fill={'url(#colorFutureAPR)'} stroke={'#ffe4c4'} dot={false} activeDot={true} strokeDasharray="4 4" />
                        <Tooltip content={<CustomTooltip />} wrapperStyle={{ outline: "none" }} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </>
    )
}