import React from "react";
import Header from "../layout/header";
import Sidebar from "../layout/sidebar";    

export const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <Header />
            <div className="flex h-screen border-collapse overflow-hidden bg-[#161616] ">
                <Sidebar />
                <main className="bg-[#161616] flex-1 overflow-y-auto overflow-x-hidden pt-16 bg-secondary/10 pb-1">
                    {children}
                </main>
            </div>
        </>
    );
};