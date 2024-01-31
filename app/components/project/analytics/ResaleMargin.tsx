import { useContractRead } from "@starknet-react/core";
import { useEffect, useState } from "react";
import { Area, Brush, ComposedChart, Label, LabelList, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useProjectAbis } from "../ProjectAbisWrapper";
import { shortString } from "starknet";
import { Subtitle } from "~/components/common/Title";
import { bigIntToNumber } from "~/utils/starknet";
import type { Forecast, Value } from "~/types/config";
import { DECIMALS, FEES , ForecastType } from "~/types/config";
import { CustomLegend } from "~/components/common/CustomGraphLegend";
import { useConfig } from "~/root";
import ForecastScenario from "~/components/common/ForecastScenario";

export default function ResaleMargin() {
    const { yielderAbi, yielderAddress, projectAbi, projectAddress, slot } = useProjectAbis();
    const [graphData, setGraphData] = useState([{}]);
    const { forecast } = useConfig();
    const [worstForecast] = useState<Forecast>(forecast.forecast.filter((prices: Forecast) => prices.type === "worst")[0]);
    const [baseForecast] = useState<Forecast>(forecast.forecast.filter((prices: Forecast) => prices.type === "base")[0]);
    const [bestForecast] = useState<Forecast>(forecast.forecast.filter((prices: Forecast) => prices.type === "best")[0]);
    const [selectedForecastType, setSelectedForecastType] = useState<ForecastType>(ForecastType.BASE);
    const [selectedForecast, setSelectedForecast] = useState<Forecast>(baseForecast);
    const [buyingPricePerTon, setBuyingPricePerTon] = useState<number>(0);

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
            const updatedPrice = payload.filter((price: any) => price.dataKey === "updatedPrice")[0]?.value ?? null;
            const buyingPricePerTon = payload.filter((price: any) => price.dataKey === "buyingPricePerTon")[0]?.value ?? null;
            const forecastPrice = payload.filter((price: any) => price.dataKey === "forecast")[0]?.value ?? null;
            const resalePerformance = updatedPrice && Number(updatedPrice) > 0 ? (Number(updatedPrice) / Number(buyingPricePerTon)).toFixed(1) : null;
            const forecastPerformance = updatedPrice === null && forecastPrice && Number(forecastPrice) > 0 ? (Number(forecastPrice) / Number(buyingPricePerTon)).toFixed(1) : null;

            return (
                <div className="px-8 pt-4 pb-4 bg-neutral-700/90 border border-neutral-500 font-inter rounded-xl">
                    <p className="text-center uppercase bold text-neutral-100">{label}</p>
                    <p className="text-left text-neutral-100 mt-2">Resale price: {updatedPrice ? Number(updatedPrice) > 0 ? "$" + Number(updatedPrice) : "Not sold" : "TBD"}</p>
                    <p className="text-left text-neutral-100 mt-2">Project buying price: ${Number(buyingPricePerTon).toFixed(2)}</p>
                    {updatedPrice === null && forecastPrice && <p className="text-left text-neutral-100 mt-2">Forecasted price: ${forecastPrice} </p>}
                    { resalePerformance && <p className="text-left text-orange-dark mt-2">Performance: x{resalePerformance} </p> }
                    { forecastPerformance && <p className="text-left text-greenish-500 mt-2">Forecasted performance: x{forecastPerformance} </p> }
                </div>
            );
        }
      
        return null;
    };

    const renderPriceLabel = (props: any) => {
        const { x, y, value, index } = props;
        const radius = 16;
        const width = 0;

        if (value === null || index % 2 === 0) { return null; }
      
        return (
          <g>
            <circle cx={x + width / 2} cy={y - radius - 10} r={radius} fill="#877B44" />
            <text x={x + width / 2} y={y - radius - 10} fill="#fff" textAnchor="middle" dominantBaseline="middle" fontSize={10}>
                x{value}
            </text>
          </g>
        );
    };

    const renderForecastLabel = (props: any) => {
        const { x, y, value, index } = props;
        const radius = 16;
        const width = 0;

        if (value === null || index % 2 === 0) { return null; }
      
        return (
          <g>
            <circle cx={x + width / 2} cy={y - radius - 10} r={radius} fill="#0AF2AD" />
            <text x={x + width / 2} y={y - radius - 10} fill="#fff" textAnchor="middle" dominantBaseline="middle" fontSize={10}>
                x{value}
            </text>
          </g>
        );
    };

    const [legendPayload] = useState([
        {
            name: "Resale price",
            color: "#877B44",
        },
        {
            name: 'Buying Price Per Ton',
            color: "#F97316",
        },
        {
            name: "Forecast",
            color: "#0AF2AD",
        }
    ]);

    useEffect(() => {
        if (
            projectValueData === undefined ||
            typeof projectValueData !== 'bigint' ||
            tonEquivalentData === undefined ||
            typeof tonEquivalentData !== 'bigint' ||
            finalAbsorptionData === undefined ||
            typeof finalAbsorptionData !== 'bigint'
        ) { return; }

        setBuyingPricePerTon(((bigIntToNumber(projectValueData) * bigIntToNumber(tonEquivalentData)) / bigIntToNumber(finalAbsorptionData)) * Math.pow(10, -DECIMALS));
    }, [projectValueData, tonEquivalentData, finalAbsorptionData]);

    useEffect(() => {
        switch (selectedForecastType) {
            case ForecastType.WORST:
                setSelectedForecast(worstForecast);
                break;
            case ForecastType.BASE:
                setSelectedForecast(baseForecast);
                break;
            case ForecastType.BEST:
                setSelectedForecast(bestForecast);
                break;
        }
    }, [selectedForecastType, worstForecast, baseForecast, bestForecast]);

    useEffect(() => {
        if (
            updatedPriceData === undefined ||
            updatedPriceTimesData === undefined ||
            priceTimesData === undefined
        ) { return; }

        const updatedPrices = (updatedPriceData as Array<string>).slice(1);
        const updatedTimes = (updatedPriceTimesData as Array<string>).slice(1);
        const priceTimes = (priceTimesData as Array<string>).slice(1);
        const lastPriceTime = new Date(Number(priceTimes[priceTimes.length - 1]) * 1000);

        updatedPrices.map(shortString.decodeShortString).join('');
        const filteredUpdatedPrices = updatedPrices.filter((price, i) => i % 2 === 0);

        const data = updatedTimes.map((updatedTime, i) => {
            const currentTime = new Date(Number(updatedTime) * 1000);
            const time = new Date(Number(updatedTime) * 1000).toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
            const updatedPrice = currentTime <= lastPriceTime ? (Number(filteredUpdatedPrices[i]) / FEES).toFixed(2) : null;
            const timeYear = time.split('/')[2];
            const forecastPrice = selectedForecast.values.filter((prices: Value) => prices.year.toString() === timeYear)[0]?.price ?? null;
            const resalePerformance = updatedPrice && Number(updatedPrice) > 0 ? (Number(updatedPrice) / Number(buyingPricePerTon)).toFixed(1) : null;
            const forecastPerformance = updatedPrice === null && forecastPrice && Number(forecastPrice) > 0 ? (Number(forecastPrice) / Number(buyingPricePerTon)).toFixed(1) : null;

            return {
                time: time,
                updatedPrice,
                buyingPricePerTon,
                resalePerformance,
                forecastPerformance,
                forecast: currentTime <= lastPriceTime ? currentTime.toDateString() === lastPriceTime.toDateString() ? Number(updatedPrice) : null : forecastPrice,
            }
        });

        setGraphData(data);
    }, [updatedPriceData, updatedPriceTimesData, priceTimesData, buyingPricePerTon, selectedForecast]);

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
            <Subtitle title="Resale margin" />
            <div className="text-right pr-4">
                <ForecastScenario 
                    selectedForecastType={selectedForecastType} 
                    setSelectedForecastType={setSelectedForecastType}
                />
            </div>
            <div className="w-full min-h-[400px]">
                <ResponsiveContainer width="100%" height="100%" minHeight='400px'>
                    <ComposedChart
                        width={1000}
                        height={3000}
                        data={graphData}
                        margin={{ top: 40, right: 10, left: 20, bottom: 20 }}
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
                            <linearGradient id="splitColor" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#0AF2AD" stopOpacity={0.8}/>
                                <stop offset="92%" stopColor="#0AF2AD" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="time" />
                        <YAxis>
                            <Label value="Price ($)" offset={-2}  angle={-90} position="insideLeft" style={{ textAnchor: 'middle', fontSize: '100%', fill: '#878A94' }} />
                        </YAxis>
                        <Area name="Updated Price Curve" type="stepBefore" fill={'url(#colorUpdatedPrice)'} stroke={'#877B44'} dot={false} activeDot={true} dataKey="updatedPrice">
                            <LabelList dataKey="resalePerformance" content={renderPriceLabel} />
                        </Area>
                        <Line name="Buying Price Per Ton" type="monotone" dataKey="buyingPricePerTon" stroke="#F97316" dot={false} activeDot={true} />
                        <Area name="Forecast" type="monotone" dataKey="forecast" stroke="#0AF2AD" dot={false} activeDot={true} strokeDasharray="4 4" fill="url(#splitColor)">
                            <LabelList dataKey="forecastPerformance" content={renderForecastLabel} />
                        </Area>
                        <Brush dataKey="time" height={30} stroke="#878A94" fill="#1F2128" endIndex={8} />
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