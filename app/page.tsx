"use client";

import Header from "@/components/header";
import { useState } from "react";
import { Mode } from "@/lib/types";
import SelectChain from "@/components/select-chain";
import GenerateWallet from "@/components/generate-wallet";
import Wallets from "@/components/wallets";
import { SetItems, RemoveItems } from "@/lib/utils";

export default function Home() {
  const [selectMode, setSelectMode] = useState<Mode>(null);

  const handleSetSelectMode = (mode: Mode) => {
    setSelectMode(mode);
    if (mode) {
      SetItems("selectMode", mode);
    } else {
      RemoveItems("selectMode");
    }
  };

  return (
    <div className="flex flex-col bg-zinc-50 font-sans dark:bg-black ">
      <main className="py-10 max-h-full px-24">
        <Header />
        {selectMode === null && (
          <SelectChain setSelectMode={handleSetSelectMode} />
        )}

        {selectMode === "generate-wallet" && (
          <GenerateWallet setSelectMode={handleSetSelectMode} />
        )}
        {selectMode === "wallets" && (
          <Wallets setSelectMode={handleSetSelectMode} />
        )}
      </main>
    </div>
  );
}
