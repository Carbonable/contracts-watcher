import { useContractRead } from "@starknet-react/core";
import { useEffect, useState } from "react";
import { Area, AreaChart, Label, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChartsDescription, Subtitle } from "~/components/common/Title";
import { useProjectAbis } from "../ProjectAbisWrapper";
import { shortString } from "starknet";

export default function SellPricesCurve() {
    const { yielderAbi, yielderAddress } = useProjectAbis();
    const [graphData, setGraphData] = useState([{}]);

    const { data: sellPriceData, isLoading: isLoadingSellPrices, error: errorSellPrices } = useContractRead({
        address: yielderAddress,
        abi: yielderAbi,
        functionName: 'get_prices',
        parseResult: false
    });

    const { data: timesData, isLoading: isLoadingTimes, error: errorTimes } = useContractRead({
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
                    <p className="text-left text-blue-dark mt-2">Sell price: ${Number(payload[0].value).toFixed(2)}</p>
                </div>
            );
        }
      
        return null;
    };

    useEffect(() => {
        if (sellPriceData === undefined || timesData === undefined) { return; }

        const sellPrices = (sellPriceData as Array<string>).slice(1);
        const times = (timesData as Array<string>).slice(1);

        sellPrices.map(shortString.decodeShortString).join('');
        const filteredSellPrices = sellPrices.filter(price => price !== '0x0');

        const data = times.map((time, i) => {
            return {
                year: new Date(Number(time) * 1000).toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }),
                sellPrices: Number(filteredSellPrices[i])
            }
        });

        setGraphData(data);
    }, [sellPriceData, timesData]);


    if (isLoadingSellPrices || isLoadingTimes) {
        return (
            <div>Loading absorption curve...</div>
        )
    }

    if (errorSellPrices || errorTimes) {
        return (
            <div>Error loading absorption curve...</div>
        )
    }

    return (
        <>
            <Subtitle title="Sell Price Curve" />
            <ChartsDescription>
                This charts shows the price at which the carbon credits are sold over the time.
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
                            <linearGradient id="colorSellPrice" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#334566" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#334566" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="year">
                            <Label value="Date" offset={-4} position="insideBottom" style={{ textAnchor: 'middle', fontSize: '100%', fill: '#878A94' }} />
                        </XAxis>
                        <YAxis>
                            <Label value="Sell Price ($)" offset={-2}  angle={-90} position="insideLeft" style={{ textAnchor: 'middle', fontSize: '100%', fill: '#878A94' }} />
                        </YAxis>
                        <Area name="Sell Price Curve" type="stepBefore" dataKey="sellPrices" fill={'url(#colorSellPrice)'} stroke={'#334566'} dot={false} activeDot={true} />
                        <Tooltip content={<CustomTooltip />} wrapperStyle={{ outline: "none" }} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </>
    )
}