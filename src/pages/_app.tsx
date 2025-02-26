import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { useMemo } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";

import "@/styles/globals.css";
import "@solana/wallet-adapter-react-ui/styles.css";

// import { api } from "@/utils/api";
import { ThemeProvider } from "next-themes";
import { Layout } from "@/components/layout";
import { Toaster } from "react-hot-toast";
import { Toaster as ShadcnToaster } from "@/components/ui/toaster";

import {
  ConnectionProvider,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { clusterApiUrl } from "@solana/web3.js";

import { AuthProvider } from "@/providers/auth-context";
import ProtectedRoute from "@/components/protected-routes";

const WalletProviderDynamic = dynamic(
  () => import("@solana/wallet-adapter-react").then((mod) => mod.WalletProvider),
  { ssr: false }
);

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const router = useRouter();
  const isHomePage = router.pathname === "/";

  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  const wallets = useMemo(() => [], []);

  return (

       <SessionProvider session={session}>


        <ConnectionProvider endpoint={endpoint}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <WalletProviderDynamic wallets={wallets} autoConnect>
              {isHomePage ? (
                <Component {...pageProps} />
              ) : (
                <Layout>
                  <Component {...pageProps} />
                  <Toaster />
                  <ShadcnToaster />
                </Layout>
              )}
            </WalletProviderDynamic>
          </ThemeProvider>
       </ConnectionProvider>
     </SessionProvider>


  );
};

export default MyApp;
