import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/providers/auth-context";

const protectedRoutes = ["/account", "/tokens", "/alltokens", "/subscription", "/chat", "/powered-tools/portfolio-manager", "/powered-tools/crypto-security-scanner", "/powered-tools/smart-contract-auditor", "/powered-tools/block-chain-investigator", "/powered-tools/token-economy-optimizer", "/powered-tools/nft-crypto-computation"]; 

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // if (pathname === "/") {
    //   if (user) {
    //     router.replace("/home");  
    //   }
    // } 
    // else if (pathname === "/home") {
    //   if (!user) {
    //     router.replace("/");  
    //   }
    // }
    // else if (protectedRoutes.includes(pathname)) {
    //   if (!user) {
    //     router.replace("/");  
    //   }
    // }
  }, [user, pathname, router]);

  return <>{children}</>;
};

export default ProtectedRoute;
