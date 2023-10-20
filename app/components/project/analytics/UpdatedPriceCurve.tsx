import { useContractRead } from "@starknet-react/core";
import { useEffect, useState } from "react";
import { Area, AreaChart, Label, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Subtitle } from "~/components/common/Title";
import { useProjectAbis } from "../ProjectAbisWrapper";
import { shortString } from "starknet";

export default function UpdatedPriceCurve() {
    const { yielderAbi, yielderAddress } = useProjectAbis();
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

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="px-8 pt-4 pb-4 bg-neutral-700/90 border border-neutral-500 font-inter rounded-xl">
                    <p className="text-center uppercase bold text-neutral-100">{label}</p>
                    <p className="text-left text-orange-dark mt-2">Updated price: ${Number(payload[0].value).toFixed(2)}</p>
                </div>
            );
        }
      
        return null;
    };

    useEffect(() => {
        if (updatedPriceData === undefined || updatedPriceTimesData === undefined || priceTimesData === undefined) { return; }

        const updatedPrices = (updatedPriceData as Array<string>).slice(1);
        const updatedTimes = (updatedPriceTimesData as Array<string>).slice(1);
        const priceTimes = (priceTimesData as Array<string>).slice(1);
        const lastPriceTime = new Date(Number(priceTimes[priceTimes.length - 1]) * 1000);

        updatedPrices.map(shortString.decodeShortString).join('');
        const filteredUpdatedPrices = updatedPrices.filter(price => price !== '0x0');

        const data = updatedTimes.map((time, i) => {
            const currentTime = new Date(Number(time) * 1000);
            return {
                year: new Date(Number(time) * 1000).toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }),
                updatedPrice: currentTime <= lastPriceTime ? Number(filteredUpdatedPrices[i]) : null,
                futureUpdatedPrice: currentTime >= lastPriceTime ? Number(filteredUpdatedPrices[i]): null,
            }
        });

        setGraphData(data);
    }, [updatedPriceTimesData, updatedPriceData, priceTimesData]);

    if (isLoadingTimes || isLoadingUpdatedPrices || isLoadingPriceTimes) {
        return (
            <div>Loading absorption curve...</div>
        )
    }

    if (errorTimes || errorUpdatedPrices || errorPriceTimes) {
        return (
            <div>Error loading absorption curve...</div>
        )
    }

    return (
        <>
            <Subtitle title="Updated Price Curve" />
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
                            <linearGradient id="colorUpdatedPrice" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#877B44" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#877B44" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorFutureUpdatedPrice" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#877B44" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#877B44" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="year">
                            <Label value="Date" offset={-4} position="insideBottom" style={{ textAnchor: 'middle', fontSize: '100%', fill: '#878A94' }} />
                        </XAxis>
                        <YAxis>
                            <Label value="Sell Price ($)" offset={-2}  angle={-90} position="insideLeft" style={{ textAnchor: 'middle', fontSize: '100%', fill: '#878A94' }} />
                        </YAxis>
                        <Area name="Updated Price Curve" type="stepBefore" fill={'url(#colorUpdatedPrice)'} stroke={'#877B44'} dot={false} activeDot={true} dataKey="updatedPrice" />
                        <Area name="Updated Price Curve" type="stepBefore" fill={'url(#colorFutureUpdatedPrice)'} stroke={'#877B44'} dot={false} activeDot={true} dataKey="futureUpdatedPrice" strokeDasharray="4 4" />
                        <Tooltip content={<CustomTooltip />} wrapperStyle={{ outline: "none" }} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </>
    )
}