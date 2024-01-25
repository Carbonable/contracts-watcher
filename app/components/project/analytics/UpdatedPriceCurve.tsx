import { useContractRead } from "@starknet-react/core";
import { useEffect, useState } from "react";
import { Area, ComposedChart, Label, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useProjectAbis } from "../ProjectAbisWrapper";
import { shortString } from "starknet";
import { Subtitle } from "~/components/common/Title";
import { bigIntToNumber } from "~/utils/starknet";
import { DECIMALS } from "~/types/config";
import type { Forecast, Value } from "~/types/config";
import { useConfig } from "~/root";
import { CustomLegend } from "~/components/common/CustomGraphLegend";

export default function UpdatedPriceCurve() {
    const { yielderAbi, yielderAddress, projectAbi, projectAddress, slot } = useProjectAbis();
    const [graphData, setGraphData] = useState([{}]);
    const { forecast } = useConfig();

    const { data: updatedPriceData, isLoading: isLoadingUpdatedPrices, error: errorUpdatedPrices } = useContractRead({
        address: yielderAddress,
        abi: yielderAbi,
        functionName: 'get_updated_prices',
        parseResult: false
    });

    const { data: updatedPriceTimesData, isLoading: isLoadingTimes, error: errorTimes } = useContractRead({
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

    const { data: projectValueData, isLoading: isLoadingProjectValue, error: errorProjectValue } = useContractRead({
        address: projectAddress,
        abi: projectAbi,
        functionName: 'get_project_value',
        args: [slot]
    });

    const { data: tonEquivalentData, isLoading: isLoadingTonEquivalent, error: errorTonEquivalent } = useContractRead({
        address: projectAddress,
        abi: projectAbi,
        functionName: 'get_ton_equivalent',
        args: [slot]
    });

    const { data: finalAbsorptionData, isLoading: isLoadingFinalAbsorption, error: errorFinalAbsorption } = useContractRead({
        address: projectAddress,
        abi: projectAbi,
        functionName: 'get_final_absorption',
        args: [parseInt(slot)]
    });

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            console.log(payload);
            const updatedPrice = payload.filter((price: any) => price.dataKey === "updatedPrice")[0]?.value ?? null;
            const futureUpdatedPrice = payload.filter((price: any) => price.dataKey === "futureUpdatedPrice")[0]?.value ?? null;
            const buyingPricePerTon = payload.filter((price: any) => price.dataKey === "buyingPricePerTon")[0]?.value ?? null;
            const worstPrice = payload.filter((price: any) => price.dataKey === "worstPrice")[0]?.value ?? null;
            const basePrice = payload.filter((price: any) => price.dataKey === "basePrice")[0]?.value ?? null;
            const bestPrice = payload.filter((price: any) => price.dataKey === "bestPrice")[0]?.value ?? null;

            return (
                <div className="px-8 pt-4 pb-4 bg-neutral-700/90 border border-neutral-500 font-inter rounded-xl">
                    <p className="text-center uppercase bold text-neutral-100">{label}</p>
                    <p className="text-left text-orange-dark mt-2">Updated price: ${Number(updatedPrice ? updatedPrice : futureUpdatedPrice).toFixed(2)}</p>
                    <p className="text-left text-[#787675] mt-2">Worst forecast: ${Number(worstPrice).toFixed(2) ?? "no price"}</p>
                    <p className="text-left text-[#AAC6FD] mt-2">Base forecast: ${Number(basePrice).toFixed(2) ?? "no price"}</p>
                    <p className="text-left text-[#0AF2AD] mt-2">Best forecast: ${Number(bestPrice).toFixed(2) ?? "no price"}</p>
                    <p className="text-left text-[#F97316] mt-2">Project buying price: ${Number(buyingPricePerTon).toFixed(2)}</p>
                </div>
            );
        }
      
        return null;
    };

    const [legendPayload] = useState([
        {
            name: "Sell price",
            color: "#877B44",
        },
        {
            name: 'Buying Price Per Ton',
            color: "#F97316",
        },
        {
            name: 'Worst forecast',
            color: "#787675",
        },
        {
            name: "Base forecast",
            color: "#AAC6FD",
        },
        {
            name: "Best forecast",
            color: "#0AF2AD",
        }
    ]);   

    useEffect(() => {
        if (
            updatedPriceData === undefined ||
            updatedPriceTimesData === undefined ||
            priceTimesData === undefined ||
            projectValueData === undefined ||
            typeof projectValueData !== 'bigint' ||
            tonEquivalentData === undefined ||
            typeof tonEquivalentData !== 'bigint' ||
            finalAbsorptionData === undefined ||
            typeof finalAbsorptionData !== 'bigint' ||
            forecast === undefined
        ) { return; }

        const updatedPrices = (updatedPriceData as Array<string>).slice(1);
        const updatedTimes = (updatedPriceTimesData as Array<string>).slice(1);
        const priceTimes = (priceTimesData as Array<string>).slice(1);
        const lastPriceTime = new Date(Number(priceTimes[priceTimes.length - 1]) * 1000);
        const buyingPricePerTon = ((bigIntToNumber(projectValueData) * bigIntToNumber(tonEquivalentData)) / bigIntToNumber(finalAbsorptionData)) * Math.pow(10, -DECIMALS);
        const worst = forecast.forecast.filter((prices: Forecast) => prices.type === "worst")[0];
        const base = forecast.forecast.filter((prices: Forecast) => prices.type === "base")[0]; 
        const best = forecast.forecast.filter((prices: Forecast) => prices.type === "best")[0];

        updatedPrices.map(shortString.decodeShortString).join('');
        const filteredUpdatedPrices = updatedPrices.filter((price, i) => i % 2 === 0);

        const data = updatedTimes.map((updatedTime, i) => {
            const currentTime = new Date(Number(updatedTime) * 1000);
            const time = new Date(Number(updatedTime) * 1000).toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
            const timeYear = time.split('/')[2];
            const worstPrice = worst.values.filter((prices: Value) => prices.year.toString() === timeYear)[0]?.price ?? null;
            const basePrice = base.values.filter((prices: Value) => prices.year.toString() === timeYear)[0]?.price ?? null;
            const bestPrice = best.values.filter((prices: Value) => prices.year.toString() === timeYear)[0]?.price ?? null;

            return {
                time: time,
                updatedPrice: currentTime <= lastPriceTime ? Number(filteredUpdatedPrices[i]) : null,
                futureUpdatedPrice: currentTime >= lastPriceTime ? Number(filteredUpdatedPrices[i]): null,
                buyingPricePerTon,
                worstPrice,
                basePrice,
                bestPrice
            }
        });

        setGraphData(data);
    }, [updatedPriceTimesData, updatedPriceData, priceTimesData, projectValueData, tonEquivalentData, finalAbsorptionData, forecast]);

    if (isLoadingTimes || isLoadingUpdatedPrices || isLoadingPriceTimes || isLoadingProjectValue || isLoadingTonEquivalent || isLoadingFinalAbsorption) {
        return (
            <div>Loading absorption curve...</div>
        )
    }

    if (errorTimes || errorUpdatedPrices || errorPriceTimes || errorProjectValue || errorTonEquivalent || errorFinalAbsorption) {
        return (
            <div>Error loading absorption curve...</div>
        )
    }

    return (
        <>
            <Subtitle title="Price Curve" />
            <div className="w-full min-h-[400px]">
                <ResponsiveContainer width="100%" height="100%" minHeight='400px'>
                    <ComposedChart
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
                            <linearGradient id="colorUpdatedPrice" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#877B44" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#877B44" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorFutureUpdatedPrice" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#877B44" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#877B44" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="time">
                            <Label value="Date" offset={-4} position="insideBottom" style={{ textAnchor: 'middle', fontSize: '100%', fill: '#878A94' }} />
                        </XAxis>
                        <YAxis>
                            <Label value="Sell Price ($)" offset={-2}  angle={-90} position="insideLeft" style={{ textAnchor: 'middle', fontSize: '100%', fill: '#878A94' }} />
                        </YAxis>
                        <Area name="Updated Price Curve" type="stepBefore" fill={'url(#colorUpdatedPrice)'} stroke={'#877B44'} dot={false} activeDot={true} dataKey="updatedPrice" />
                        <Area name="Updated Price Curve" type="stepBefore" fill={'url(#colorFutureUpdatedPrice)'} stroke={'#877B44'} dot={false} activeDot={true} dataKey="futureUpdatedPrice" strokeDasharray="4 4" />
                        <Line name="Worst case" type="monotone" dataKey="worstPrice" stroke="#787675" dot={false} activeDot={true} />
                        <Line name="Base case" type="monotone" dataKey="basePrice" stroke="#AAC6FD" dot={false} activeDot={true} />
                        <Line name="Best case" type="monotone" dataKey="bestPrice" stroke="#0AF2AD" dot={false} activeDot={true} />
                        <Line name="Buying Price Per Ton" type="monotone" dataKey="buyingPricePerTon" stroke="#F97316" dot={false} activeDot={true} />
                        <Tooltip content={<CustomTooltip />} wrapperStyle={{ outline: "none" }} />
                    </ComposedChart>
                </ResponsiveContainer>
                <div className="text-neutral-300 text-sm lg:text-lg font-inter text-center w-fit mx-auto md:mt-2">
                    <CustomLegend payload={legendPayload} />
                </div>
            </div>
        </>
    )
}