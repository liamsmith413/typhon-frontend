import { BookOpenCheck, LayoutDashboard, Database, MessageSquare, Menu, Wallet, CreditCard, User } from "lucide-react";
import { type NavItem } from "@/types";

export const NavItems: NavItem[] = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/home",
    // color: "text-sky-500",
  },
  {
    title: "Tokens",
    icon: CreditCard,
    href: "/tokens",
    // color: "text-sky-500",
  },
  {
    title: "Subscription",
    icon: Database,
    href: "/subscription",
    // color: "text-sky-500",
  },
  {
    title: "ChatService",
    icon: MessageSquare,
    href: "/chat",
    // color: "text-sky-500",
  },
  {
    title: "Account",
    icon: User,
    href: "/account",
  },
  {
    title: "Our Service",
    icon: Menu,
    href: "/powredwork",
    color: "text-orange-500",
    isChildren: true,
    children: [
      {
        title: "CryptoPortfolioManager",
        icon: Wallet,
        color: "text-red-500",
        href: "/powered-tools/portfolio-manager",
      },
      {
        title: "CryptoSecurityScanner",
        icon: BookOpenCheck,
        color: "text-red-500",
        href: "/powered-tools/crypto-security-scanner",
      },
      {
        title: "SmartContractAuditor",
        icon: BookOpenCheck,
        color: "text-red-500",
        href: "/powered-tools/smart-contract-auditor",
      },
      {
        title: "BlockchainInvestigator",
        icon: BookOpenCheck,
        color: "text-red-500",
        href: "/powered-tools/block-chain-investigator",
      },
      {
        title: "TokenEconomyOptimizer",
        icon: BookOpenCheck,
        color: "text-red-500",
        href: "/powered-tools/token-economy-optimizer",
      },
      {
        title: "NFT&CryptoCompuauion",
        icon: BookOpenCheck,
        color: "text-red-500",
        href: "/powered-tools/nft-crypto-computation",
      },
      
    ],
  },
];
