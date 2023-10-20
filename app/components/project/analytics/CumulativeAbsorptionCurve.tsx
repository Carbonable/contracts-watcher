import { useContractRead } from "@starknet-react/core";
import { useEffect, useState } from "react";
import { Area, AreaChart, Label, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Subtitle } from "~/components/common/Title";
import { useProjectAbis } from "../ProjectAbisWrapper";
import { DECIMALS } from "~/types/config";

export default function CumulativeAbsorptionCurve() {
    const { projectAddress, projectAbi, slot } = useProjectAbis();
    const [graphData, setGraphData] = useState([{}]);

    const { data: absorptionsData, isLoading: isLoadingAbsorptions, error: errorAbsorptions } = useContractRead({
        address: projectAddress,
        abi: projectAbi,
        functionName: 'get_absorptions',
        args: [parseInt(slot)],
        parseResult: false
    });

    const { data: timesData, isLoading: isLoadingTimes, error: errorTimes } = useContractRead({
        address: projectAddress,
        abi: projectAbi,
        functionName: 'get_times',
        args: [parseInt(slot)],
        parseResult: false
    });

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="px-8 pt-4 pb-4 bg-neutral-700/90 border border-neutral-500 font-inter rounded-xl">
                    <p className="text-center uppercase bold text-neutral-100">{label}</p>
                    <p className="text-left text-greenish-500 mt-2">Absorption: t{Number(payload[0].value).toFixed(2)}</p>
                </div>
            );
        }
      
        return null;
    };

    useEffect(() => {
        if (absorptionsData === undefined || timesData === undefined) { return; }

        const absorptions = (absorptionsData as Array<string>).slice(1);
        const times = (timesData as Array<string>).slice(1);

        const data = absorptions.map((absorption, i) => {
            return {
                year: new Date(Number(times[i]) * 1000).toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }),
                absorption: Number(absorption) * Math.pow(10, -DECIMALS)
            }
        });

        setGraphData(data);
    }, [absorptionsData, timesData]);


    if (isLoadingAbsorptions || isLoadingTimes) {
        return (
            <div>Loading absorption curve...</div>
        )
    }

    if (errorAbsorptions || errorTimes) {
        return (
            <div>Error loading absorption curve...</div>
        )
    }

    return (
        <>
            <Subtitle title="Cumulative Absorption Curve" />
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
                            <linearGradient id="colorAbsorptionCurve" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#22875B" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#22875B" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="year">
                            <Label value="Date" offset={-4} position="insideBottom" style={{ textAnchor: 'middle', fontSize: '100%', fill: '#878A94' }} />
                        </XAxis>
                        <YAxis>
                            <Label value="Absorption (t)" offset={-2}  angle={-90} position="insideLeft" style={{ textAnchor: 'middle', fontSize: '100%', fill: '#878A94' }} />
                        </YAxis>
                        <Area name="Absorption curve" type="monotone" dataKey="absorption" fill={'url(#colorAbsorptionCurve)'} stroke={'#22875B'} dot={false} activeDot={true} />
                        <Tooltip content={<CustomTooltip />} wrapperStyle={{ outline: "none" }} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </>
    )
}