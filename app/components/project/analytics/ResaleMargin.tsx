import { useContractRead } from "@starknet-react/core";
import { useEffect, useState } from "react";
import { Area, ComposedChart, Label, LabelList, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useProjectAbis } from "../ProjectAbisWrapper";
import { shortString } from "starknet";
import { Subtitle } from "~/components/common/Title";
import { bigIntToNumber } from "~/utils/starknet";
import { DECIMALS, FEES } from "~/types/config";
import { CustomLegend } from "~/components/common/CustomGraphLegend";

export default function ResaleMargin() {
    const { yielderAbi, yielderAddress, projectAbi, projectAddress, slot } = useProjectAbis();
    const [graphData, setGraphData] = useState([{}]);

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
            const performance = updatedPrice && Number(updatedPrice) > 0 ? (Number(updatedPrice) / Number(buyingPricePerTon)).toFixed(1) : null;

            return (
                <div className="px-8 pt-4 pb-4 bg-neutral-700/90 border border-neutral-500 font-inter rounded-xl">
                    <p className="text-center uppercase bold text-neutral-100">{label}</p>
                    <p className="text-left text-neutral-100 mt-2">Resale price: {updatedPrice ? Number(updatedPrice) > 0 ? "$" + Number(updatedPrice) : "Not sold" : "TBD"}</p>
                    <p className="text-left text-neutral-100 mt-2">Project buying price: ${Number(buyingPricePerTon).toFixed(2)}</p>
                    { performance && <p className="text-left text-greenish-500 mt-2">Performance: x{performance} </p> }
                </div>
            );
        }
      
        return null;
    };

    const renderCustomizedLabel = (props: any) => {
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

    const [legendPayload] = useState([
        {
            name: "Resale price",
            color: "#877B44",
        },
        {
            name: 'Buying Price Per Ton',
            color: "#F97316",
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
            typeof finalAbsorptionData !== 'bigint'
        ) { return; }

        const updatedPrices = (updatedPriceData as Array<string>).slice(1);
        const updatedTimes = (updatedPriceTimesData as Array<string>).slice(1);
        const priceTimes = (priceTimesData as Array<string>).slice(1);
        const lastPriceTime = new Date(Number(priceTimes[priceTimes.length - 1]) * 1000);
        const buyingPricePerTon = ((bigIntToNumber(projectValueData) * bigIntToNumber(tonEquivalentData)) / bigIntToNumber(finalAbsorptionData)) * Math.pow(10, -DECIMALS);

        updatedPrices.map(shortString.decodeShortString).join('');
        const filteredUpdatedPrices = updatedPrices.filter((price, i) => i % 2 === 0);

        const data = updatedTimes.map((updatedTime, i) => {
            const currentTime = new Date(Number(updatedTime) * 1000);
            const time = new Date(Number(updatedTime) * 1000).toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
            const updatedPrice = currentTime <= lastPriceTime ? (Number(filteredUpdatedPrices[i]) / FEES).toFixed(2) : null;
            const performance = updatedPrice && Number(updatedPrice) > 0 ? (Number(updatedPrice) / Number(buyingPricePerTon)).toFixed(1) : null;

            return {
                time: time,
                updatedPrice,
                buyingPricePerTon,
                performance
            }
        });

        setGraphData(data);
    }, [updatedPriceTimesData, updatedPriceData, priceTimesData, projectValueData, tonEquivalentData, finalAbsorptionData]);

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
            <div className="w-full min-h-[400px]">
                <ResponsiveContainer width="100%" height="100%" minHeight='400px'>
                    <ComposedChart
                        width={1000}
                        height={3000}
                        data={graphData}
                        margin={{ top: 20, right: 10, left: 20, bottom: 20 }}
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
                        </defs>
                        <XAxis dataKey="time">
                            <Label value="Date" offset={-4} position="insideBottom" style={{ textAnchor: 'middle', fontSize: '100%', fill: '#878A94' }} />
                        </XAxis>
                        <YAxis>
                            <Label value="Price ($)" offset={-2}  angle={-90} position="insideLeft" style={{ textAnchor: 'middle', fontSize: '100%', fill: '#878A94' }} />
                        </YAxis>
                        <Area name="Updated Price Curve" type="stepBefore" fill={'url(#colorUpdatedPrice)'} stroke={'#877B44'} dot={false} activeDot={true} dataKey="updatedPrice">
                            <LabelList dataKey="performance" content={renderCustomizedLabel} />
                        </Area>
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