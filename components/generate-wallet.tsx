import { toast } from "sonner";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Mode } from "@/lib/types";
import { generateSeed, generateKeyFromDrivePath } from "@/lib/utils";
import bs58 from "bs58";
import { SetItems } from "@/lib/utils";
import { useState } from "react";

type GenerateWalletProps = {
  setSelectMode: (mode: Mode) => void;
};

export default function GenerateWallet({ setSelectMode }: GenerateWalletProps) {
  const [seed, setSeed] = useState("");
  function handleGenerateWallet() {
    const finalSeed = seed.trim() !== "" ? seed.trim() : generateSeed();
    try {
      const { publicKey, secretKey } = generateKeyFromDrivePath(finalSeed, 0);
      const secretKeyString = bs58.encode(secretKey);
      SetItems(
        "wallet",
        JSON.stringify([{ publicKey, secretKey: secretKeyString, seed: finalSeed }]),
      );
      setSelectMode("wallets");
      toast.success("Wallet generated successfully!");
    } catch (error) {
      toast.error("Invalid seed phrase");
    }
  }

  return (
    <div className="mt-5">
      <h1 className="font-semibold text-lg">Secret Recovery Phrase</h1>
      <p className="font-semibold text-neutral-400 ">
        Save these words in a safe place.
      </p>
      <div className="mt-2 flex flex-row ">
        <Input
          className="p-2"
          placeholder="Enter your secret phrase (or leave a black to generate)"
          name="wallet"
          type="text"
          value={seed}
          onChange={(e) => setSeed(e.target.value)}
        />
        <Button
          className="cursor-pointer"
          onClick={() => handleGenerateWallet()}
        >
          Generate Wallet
        </Button>
      </div>
    </div>
  );
}
