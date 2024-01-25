import { useContractRead } from "@starknet-react/core";
import { useEffect, useState } from "react";
import { Area, AreaChart, Label, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Subtitle } from "~/components/common/Title";
import { useProjectAbis } from "../ProjectAbisWrapper";
import { shortString } from "starknet";
import { DECIMALS, FEES } from "~/types/config";

export default function CumulativeSaleCurve() {
    const { yielderAbi, yielderAddress } = useProjectAbis();
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

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="px-8 pt-4 pb-4 bg-neutral-700/90 border border-neutral-500 font-inter rounded-xl">
                    <p className="text-center uppercase bold text-neutral-100">{label}</p>
                    <p className="text-left text-blue-dark mt-2">Cumulative sale: ${Number(payload[0].value).toFixed(2)}</p>
                </div>
            );
        }
      
        return null;
    };

    useEffect(() => {
        if (cumSaleTimesData === undefined || cumSaleData === undefined || priceTimesData === undefined) { return; }

        const cumSale = (cumSaleData as Array<string>).slice(1);
        const times = (cumSaleTimesData as Array<string>).slice(1);

        cumSale.map(shortString.decodeShortString).join('');
        const filteredCumSale = cumSale.filter((price, i) => i % 2 === 0);
        const priceTimes = (priceTimesData as Array<string>).slice(1);
        const lastPriceTime = new Date(Number(priceTimes[priceTimes.length - 1]) * 1000);

        const data = times.map((time, i) => {
            const currentTime = new Date(Number(time) * 1000);
            return {
                year: new Date(Number(time) * 1000).toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }),
                cumSale: currentTime <= lastPriceTime ? Number(filteredCumSale[i]) * Math.pow(10, -DECIMALS) / FEES : null,
                futureCumSale: currentTime >= lastPriceTime ? Number(filteredCumSale[i]) * Math.pow(10, -DECIMALS) / FEES : null,
            }
        });
        setGraphData(data);
    }, [cumSaleTimesData, cumSaleData, priceTimesData]);


    if (isLoadingTimes || isLoadingCumSale || isLoadingPriceTimes) {
        return (
            <div>Loading absorption curve...</div>
        )
    }

    if (errorTimes || errorCumSale || errorPriceTimes) {
        return (
            <div>Error loading absorption curve...</div>
        )
    }

    return (
        <>
            <Subtitle title="Cumulative Sale Curve" />
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
                            <linearGradient id="colorCumSalePrice" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#334566" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#334566" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorFutureCumSalePrice" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#334566" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#334566" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="year">
                            <Label value="Date" offset={-4} position="insideBottom" style={{ textAnchor: 'middle', fontSize: '100%', fill: '#878A94' }} />
                        </XAxis>
                        <YAxis>
                            <Label value="Sell Price ($)" offset={-2}  angle={-90} position="insideLeft" style={{ textAnchor: 'middle', fontSize: '100%', fill: '#878A94' }} />
                        </YAxis>
                        <Area name="Cumulative Sale curve" type="monotone" dataKey="cumSale" fill={'url(#colorCumSalePrice)'} stroke={'#334566'} dot={false} activeDot={true} />
                        <Area name="Cumulative Sale curve" type="monotone" dataKey="futureCumSale" fill={'url(#colorFutureCumSalePrice)'} stroke={'#334566'} dot={false} activeDot={true} strokeDasharray="4 4" />
                        <Tooltip content={<CustomTooltip />} wrapperStyle={{ outline: "none" }} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </>
    )
}