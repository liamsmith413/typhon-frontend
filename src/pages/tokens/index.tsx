import React, { useEffect, useState } from "react";
import Image from 'next/image';
import imgSolana from '/public/images/solana.png';
import io from 'socket.io-client';
import CopyButton from "@/components/common/copyButton";
import { useRouter } from "next/router";
import Link from "next/link"; // Import Link from Next.js
import { NEXT_PUBLIC_BACKEND_URL } from "@/config";
import { Button } from "@/components/ui/button";

const socket = io(NEXT_PUBLIC_BACKEND_URL);

// Function to shorten the token address
function cutTokenAddress(str: string) {
  const startLength = 10;
  const endLength = 10;

  if (str.length <= startLength + endLength) {
    return str; // Return the original string if it's short enough
  }

  const start = str.slice(0, startLength);
  const end = str.slice(-endLength);

  return start + '....' + end;
}

// Function to validate image URL
const isValidImageUrl = (url: string) => {
  try {
    return new URL(url).href;
  } catch (error) {
    return undefined;
  }
};

interface Token {
  address: string;
  name: string;
  icon: string;
  price: number;
  market_cap: number;
  supply: number;
}

const InfyNft = () => {
  const [trendingTokens, setTrendingTokens] = useState<Token[]>([]);
  const router = useRouter();
  useEffect(() => {
    socket.on('trendingTokens', (data) => {
      if (data.error) {
        console.error('Error fetching trending tokens:', data.error);
      } else {
        setTrendingTokens(data);
      }
    });
  }, []);

  useEffect(() => {
    socket.emit('requestTrendingTokens');
  }, []);

  return (
    <div className="font-interfont">
      <div className="relative mx-auto pt-6 flex flex-col items-center justify-center text-[#D2DADF] bg-[url('/assets/nft/infynft/gradient.svg')] bg-cover">
        <div className="flex w-full md:max-w-[1120px] flex-col gap-10 md:gap-20 px-5 xl:px-0">
          <div className="flex flex-col gap-5 md:gap-[20px]">
            <div className="flex items-center justify-between">
              <div className="text-2xl md:text-[32px] font-semibold leading-[44px] tracking-[0.01em]">
                Popular trending tokens on Solana
              </div>
            </div>

            <div>
              {trendingTokens.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full py-10">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-green-400 border-solid mb-4"></div>
                  <div className="text-center text-gray-300 text-2xl font-bold">
                    Loading Trending Tokens...
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-[24px] place-items-center">
                  {trendingTokens.map((token, index) => (
                    <div className="flex min-w-[262px] md:min-w-min flex-col items-center justify-center gap-5 rounded-[10px] border border-[#2F3548] p-3">
                      <Link
                        key={index}
                        href={`/detailtoken?token=${token.address}`}
                      >
                        <div className="w-full">
                          <div className="overflow-hidden rounded-[10px]">
                            <img
                              src={isValidImageUrl(token.icon)}
                              alt={token.name}
                              className="w-[300px] min-h-[250px] hover:scale-125 delay-200 duration-300 ease-in-out"
                              width="30px"
                              height="30px"
                            />
                          </div>
                          <div className="flex w-full flex-col gap-5">
                            <div className="w-full gap-2">
                              <div className="">
                                <div className="flex items-center gap-2 md:gap-1 lg:gap-2">
                                  <span className="lg:text-[18px] whitespace-nowrap font-normal text-[white]">
                                    <b>@{token.name}</b>
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 justify-between">
                                  <span className="text-[15px] md:text-[15px] lg:text-[15px] font-normal text-[#6B7280]">
                                    {cutTokenAddress(token.address)}
                                  </span>
                                  <CopyButton text={token.address} />
                                </div>
                              </div>
                              <div className="text-[14px] whitespace-nowrap text-ellipsis font-medium flex justify-between">
                                <span>Price</span>
                                <span>${token?.price}</span>
                              </div>
                              <div className="text-[14px] whitespace-nowrap text-ellipsis font-medium flex justify-between">
                                <span>MarketCap</span>
                                <span>{token?.market_cap}</span>
                              </div>
                              <div className="text-[14px] whitespace-nowrap text-ellipsis font-medium flex justify-between">
                                <span>Supply</span>
                                <span>{token?.supply}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>

                      <div className="flex items-center justify-between gap-4 w-full">
                        <Link
                          key={index}
                          href={`/detailtoken?token=${token.address}`}
                        >
                          <div className="flex items-center justify-center rounded p-0.5 text-sm font-semibold text-[#5EE616] bg-gradient-to-r from-green-400 to-teal-600 hover:text-[#FDFBFB] w-fit mx-auto">
                            <Button size="sm" className='w-[100px] bg-[#161616] text-thite border-2 border-white'>
                              <Image src={imgSolana} width={25} height={25} alt="solana" /> &nbsp;0.25
                            </Button>
                          </div>
                        </Link>
                        <Button size="sm" className='w-[100px] bg-[#161616] text-thite border-2 border-white'
                          onClick={(e) => {
                            e.preventDefault();
                            router.push(`/chatbot?token=${token.address}`);
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-8 w-8 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                            />
                          </svg>
                        </Button>
                        {/* <button
                          className="p-3 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 hover:from-blue-500 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center"
                          onClick={(e) => {
                            e.preventDefault();
                            router.push(`/chatbot?token=${token.address}`);
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-8 w-8 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                            />
                          </svg>
                        </button> */}
                      </div>
                    </div>

                  ))}
                </div>
              )}
            </div>

            <div className="w-full p-6 text-center">
              <Button size="sm" className='w-[200px] bg-[#161616] text-thite border-2 border-white' onClick={() => router.push("/alltokens?page=1&limit=10&order=desc&sortBy=market_cap")}>View all</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfyNft;
