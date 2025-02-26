import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { CardHeader, CardTitle, CardContent, CardDescription, Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { NEXT_PUBLIC_BACKEND_URL } from "@/config";

// Define image paths
const imgTyphonToken = "/images/typhon_token.png";
const imgCopy = "/images/copy.png";

// Define the backend URL (replace with your actual backend URL)

interface Activity {
    block_id: number;
    trans_id: string;
    block_time: number;
    activity_type: string;
    from_address: string;
    sources: string[];
    platform: string[];
    value: number;
    routers: any;
    time: string;
}

const DetailToken: React.FC = () => {
    const router = useRouter();
    const { query } = router;
    const tokenId = typeof query.token === "string" ? query.token : "";

    const [tokenData, setTokenData] = useState<any>(null);
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState<boolean>(true); // Loading state
    const [error, setError] = useState<string | null>(null); // Error state

    const parseUSDCData = (data: any) => {
        if (!data || !data.metadata?.success || !data.prices?.success) {
            throw new Error("Invalid data structure");
        }
        console.log(data);

        const tokenInfo = {
            address: data.metadata.data.address,
            name: data.metadata.data.name,
            symbol: data.metadata.data.symbol,
            icon: data.metadata.data.icon,
            decimals: data.metadata.data.decimals,
            holderCount: data.metadata.data.holder,
            supply: data.metadata.data.supply,
            marketCap: data.metadata.data.market_cap,
            priceChange24h: data.metadata.data.price_change_24h,
            firstMintTx: data.metadata.data.first_mint_tx,
            mintAuthority: data.metadata.data.mint_authority,
            freezeAuthority: data.metadata.data.freeze_authority,
        };

        const priceHistory = data.prices.data.map((entry: any) => ({
            date: entry.date,
            price: entry.price,
        }));

        return { tokenInfo, priceHistory };
    };

    const getTokenData = async (tokenId: string): Promise<void> => {
        try {
            setLoading(true);
            setError(null);

            // Fetch token data from the backend
            const response = await fetch(`${NEXT_PUBLIC_BACKEND_URL}/api/token?token=${tokenId}`);
            if (!response.ok) {
                throw new Error("Token not found");
            }
            const data = await response.json();
            if (!data || data.length === 0) {
                throw new Error("Token data not found");
            }

            // Parse and set the token data
            setTokenData(parseUSDCData(data[0]));
            setActivities(data[0].activities);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            setError("Error fetching token data: " + errorMessage);
            console.error("Error fetching token data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (tokenId) {
            getTokenData(tokenId);
        }
    }, [tokenId]);

    const renderActivities = () => {
        if (activities.length === 0) {
            return <p>No recent activities found.</p>;
        }

        return (
            <>
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    TimeStamp
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    <div className="flex items-center">
                                        TransactionId
                                        <a href="#"><svg className="w-3 h-3 ms-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                                        </svg></a>
                                    </div>
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    <div className="flex items-center">
                                        FromAddress
                                        <a href="#"><svg className="w-3 h-3 ms-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                                        </svg></a>
                                    </div>
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    <div className="flex items-center">
                                        Value
                                        <a href="#"><svg className="w-3 h-3 ms-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                                        </svg></a>
                                    </div>
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    <div className="flex items-center">
                                        Platform
                                        <a href="#"><svg className="w-3 h-3 ms-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                                        </svg></a>
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {activities.map((activity) => (

                                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">

                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        {new Date(activity.time).toLocaleString()}

                                    </th>

                                    <td className="px-6 py-4">
                                        {activity.trans_id.slice(0, 15)}...
                                    </td>

                                    <td className="px-6 py-4">
                                        {activity.from_address.slice(0, 15)}...
                                    </td>
                                    <td className="px-6 py-4">
                                        {activity.value}

                                    </td>

                                    <td className="px-6 py-4">
                                        {activity.platform.slice(0, 15)}...
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {/* {activities.map((activity) => (
                    <li key={activity.trans_id} className="shadow-lg rounded-lg p-4 mb-4 border border-gray-200">
                        <div className="flex items-center mb-2">
                            <strong className="text-lg text-white">
                                Transaction ID:{" "}
                                <a
                                    href={`https://solscan.io/tx/${activity.trans_id}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline text-sm"
                                >
                                    {activity.trans_id}
                                </a>
                            </strong>
                        </div>
                        <div className="mb-2">
                            <strong className="text-white">Type:</strong>
                            <span className="text-sm text-white">{formatActivityType(activity.activity_type)}</span>
                        </div>
                        <div className="mb-2">
                            <strong className="text-white">From Address:</strong>
                            <a
                                href={`https://solscan.io/tx/${activity.from_address}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline text-sm"
                            >
                                {activity.from_address}
                            </a>
                        </div>
                        <div className="mb-2">
                            <strong className="text-white">Value:</strong>
                            <span className="text-sm text-white">{activity.value}</span>
                        </div>
                        <div className="mb-2">
                            <strong className="text-white">Time:</strong>
                            <span className="text-sm text-white">{new Date(activity.time).toLocaleString()}</span>
                        </div>
                        <div className="mb-2">
                            <strong className="text-white">Platform:</strong>
                            <span className="text-sm text-white">{activity.platform.join(", ")}</span>
                        </div>
                    </li>
                ))} */}
            </>

        );
    };

    const formatActivityType = (activityType: string) => {
        const activityTypes: { [key: string]: string } = {
            ACTIVITY_AGG_TOKEN_SWAP: "Aggregated Token Swap",
            ACTIVITY_TOKEN_SWAP: "Token Swap",
            ACTIVITY_TOKEN_ADD_LIQ: "Token Added to Liquidity Pool",
            ACTIVITY_TOKEN_REMOVE_LIQ: "Token Removed from Liquidity Pool",
            ACTIVITY_SPL_TOKEN_STAKE: "Token Staked (SPL)",
            ACTIVITY_SPL_TOKEN_UNSTAKE: "Token Unstaked (SPL)",
            ACTIVITY_SPL_TOKEN_WITHDRAW_STAKE: "Withdrawn Staked Token (SPL)",
            ACTIVITY_SPL_INIT_MINT: "Initial Token Mint (SPL)",
            ACTIVITY_TOKEN_DEPOSIT_VAULT: "Token Deposited to Vault",
        };

        return activityTypes[activityType] || activityType;
    };

    // Function to format numbers with commas
    const formatNumberWithCommas = (number: number) => {
        return new Intl.NumberFormat().format(number);
    };

    if (loading) {
        return (
            <>
                <div className="flex justify-center items-center h-screen bg-gray-900">
                    <div className="text-2xl font-mono text-green-400 animate-pulse tracking-wide">
                        Loading token data...
                    </div>
                </div>
            </>
        );
    }

    if (error) {
        return <div>{error}</div>; // Error screen
    }

    return (
        <div className="flex h-full flex-col bg-[#161616]">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <div className="flex items-center justify-between space-y-2">

                </div>

                <div className="w-full">
                    <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-2">
                            <div className="w-full flex items-center">
                                <Image
                                    src={tokenData?.tokenInfo.icon || imgTyphonToken}
                                    alt={tokenData?.tokenInfo.symbol || "mytoken"}
                                    width={100}
                                    height={100}
                                    className="mr-4"
                                />
                                <div>
                                    <h2 className="text-3xl font-bold tracking-tight mb-3">{tokenData?.tokenInfo.name || "Typhon"}</h2>
                                    <hr />
                                    <div className="flex p-2 items-center">
                                        <span className="text-lg">{tokenData?.tokenInfo.address.slice(0, 10) || "N/A"}</span>
                                        <button
                                            className="ml-2"
                                            onClick={() => {
                                                navigator.clipboard.writeText(tokenData?.tokenInfo.address || "");
                                            }}
                                        >
                                            <Image src={imgCopy} alt="copy" width={20} height={20} />
                                        </button>
                                    </div>
                                    <p className="text-sm text-white">Symbol: {tokenData?.tokenInfo.symbol || "N/A"}</p>
                                    <p className="text-sm text-white">Supply: {tokenData?.tokenInfo.supply ? formatNumberWithCommas(tokenData.tokenInfo.supply) : "N/A"}</p>
                                    <p className="text-sm text-white">Market Cap: {tokenData?.tokenInfo.marketCap ? formatNumberWithCommas(tokenData.tokenInfo.marketCap) : "N/A"}</p>
                                    <p className="text-sm text-white">Price Change (24h): {tokenData?.tokenInfo.priceChange24h ? formatNumberWithCommas(tokenData.tokenInfo.priceChange24h) : "N/A"}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <Tabs defaultValue="overview" className="space-y-4">
                    <TabsList className="mytabs">
                        <TabsTrigger value="overview">TokenInfo</TabsTrigger>
                        <TabsTrigger value="analytics">PriceHistory</TabsTrigger>
                        <TabsTrigger value="reports">RecentTransaction</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Token Information</CardTitle>
                                <CardDescription>Basic metadata of the selected token.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p><strong>Name:</strong> {tokenData?.tokenInfo.name || "N/A"}</p>
                                <p><strong>Symbol:</strong> {tokenData?.tokenInfo.symbol || "N/A"}</p>
                                <p><strong>First Mint Transaction:</strong> {tokenData?.tokenInfo.firstMintTx || "N/A"}</p>
                                <p><strong>Mint Authority:</strong> {tokenData?.tokenInfo.mintAuthority || "N/A"}</p>
                                <p><strong>Freeze Authority:</strong> {tokenData?.tokenInfo.freezeAuthority || "N/A"}</p>
                                <p><strong>Price Change (24h):</strong> {tokenData?.tokenInfo.priceChange24h || "N/A"}</p>
                                <p><strong>Market Cap:</strong> {tokenData?.tokenInfo.marketCap ? formatNumberWithCommas(tokenData.tokenInfo.marketCap) : "N/A"}</p>
                                <p><strong>Holder Count:</strong> {tokenData?.tokenInfo.holderCount ? formatNumberWithCommas(tokenData.tokenInfo.holderCount) : "N/A"}</p>
                                <p><strong>Supply:</strong> {tokenData?.tokenInfo.supply ? formatNumberWithCommas(tokenData.tokenInfo.supply) : "N/A"}</p>
                            </CardContent>
                        </Card>

                    </TabsContent>

                    <TabsContent value="analytics">
                        {/* Price History Chart */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Price History</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={tokenData?.priceHistory || []}>
                                        <XAxis dataKey="date" />
                                        <YAxis />
                                        <Tooltip />
                                        <Line type="monotone" dataKey="price" stroke="#8884d8" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="reports">
                        <Card>
                            <CardHeader>
                                <CardTitle>Recent Transactions</CardTitle>
                                <CardDescription>Recent transactions involving this token.</CardDescription>
                            </CardHeader>
                            <CardContent>{renderActivities()}</CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default DetailToken;