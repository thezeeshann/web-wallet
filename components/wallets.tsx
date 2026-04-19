"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Trash } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import DeleteWallets from "./delete-wallets";
import { useState } from "react";
import { Mode } from "@/lib/types";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { GetItems, RemoveItems, SetItems, generateKeyFromDrivePath } from "@/lib/utils";
import bs58 from "bs58";
import { Wallet } from "@/lib/types";

type WalletsProps = {
  setSelectMode: (mode: Mode) => void;
};

export default function Wallets({ setSelectMode }: WalletsProps) {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [targetDeleteIndex, setTargetDeleteIndex] = useState<number | null>(null);
  const [showSecretKey, setShowSecretKey] = useState<Record<number, boolean>>(
    {},
  );
  const [wallets, setWallets] = useState<Wallet[]>(GetItems("wallet"));

  function handleDelete() {
    if (targetDeleteIndex === null) {
      RemoveItems("wallet");
      setSelectMode(null);
      toast.success("All wallets cleared.");
    } else {
      const updatedWallets = wallets.filter((_, i) => i !== targetDeleteIndex);
      if (updatedWallets.length === 0) {
        RemoveItems("wallet");
        setSelectMode(null);
        toast.success("All wallets cleared.");
      } else {
        setWallets(updatedWallets);
        SetItems("wallet", JSON.stringify(updatedWallets));
        toast.success(`Wallet ${targetDeleteIndex + 1} removed.`);
      }
    }
    setIsDeleteOpen(false);
    setTargetDeleteIndex(null);
  }

  function handleAddWallet() {
    if (wallets.length === 0) return;
    try {
      const seed = wallets[0].seed;
      if (!seed) throw new Error("No seed found in the root wallet");
      const newWallet = generateKeyFromDrivePath(seed, wallets.length);
      const secretKeyString = bs58.encode(newWallet.secretKey);
      const newWalletData = { 
        publicKey: newWallet.publicKey, 
        secretKey: secretKeyString, 
        seed: seed 
      };
      const updatedWallets = [...wallets, newWalletData];
      setWallets(updatedWallets);
      SetItems("wallet", JSON.stringify(updatedWallets));
      toast.success("New wallet added!");
    } catch (error) {
      toast.error("Failed to add wallet");
    }
  }

  return (
    <div className="mt-8">
      <Accordion type="single" collapsible defaultValue="item-1">
        <AccordionItem value="item-1">
          <AccordionTrigger className="cursor-pointer hover:no-underline font-semibold text-lg">
            Your Secret Phrase
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4 h-40">
            {wallets.map((wallet: Wallet, walletIndex: number) => (
              <div
                key={walletIndex}
                className="grid grid-cols-3 md:grid-cols-4 gap-2"
              >
                {wallet.seed?.split(" ").map((word: string, index: number) => (
                  <Badge
                    key={index}
                    className="p-4 text-center text-[14px] rounded flex justify-center flex-row gap-2"
                    variant="secondary"
                  >
                    {word}
                  </Badge>
                ))}
                <p className="mt-3 font-semibold ">Copy</p>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="flex flex-row justify-between mt-5">
        <p className="font-semibold text-lg">Solana Wallet</p>
        <div className="flex flex-row gap-3">
          <Button onClick={handleAddWallet} className="cursor-pointer p-5" variant={"default"}>
            Add Wallet
          </Button>
          <Button
            onClick={() => {
              setTargetDeleteIndex(null);
              setIsDeleteOpen(true);
            }}
            className="cursor-pointer p-5"
            variant={"destructive"}
          >
            Clear Wallets
          </Button>
        </div>
      </div>

      {wallets.map((wallet: Wallet, index: number) => (
        <Card className="mt-5" key={index}>
          <CardHeader>
            <div className="flex flex-row justify-between">
              <CardTitle className=" opacity-70 font-semibold text-2xl">
                Wallet {index + 1}
              </CardTitle>
              <CardDescription>
                <Trash
                  onClick={() => {
                    setTargetDeleteIndex(index);
                    setIsDeleteOpen(true);
                  }}
                  className="cursor-pointer opacity-70 text-red-500"
                />
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <p className="font-semibold text-lg">Public Key</p>
            <p className="mt-1">{wallet.publicKey}</p>
            <p className="font-semibold text-lg mt-3">Private Key</p>
            <div className="flex flex-row justify-between">
              <p className="mt-1">
                {showSecretKey[index]
                  ? wallet.secretKey
                  : "••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••"}
              </p>
              {showSecretKey[index] ? (
                <EyeOff
                  className="cursor-pointer"
                  onClick={() =>
                    setShowSecretKey({ ...showSecretKey, [index]: false })
                  }
                />
              ) : (
                <Eye
                  className="cursor-pointer"
                  onClick={() =>
                    setShowSecretKey({ ...showSecretKey, [index]: true })
                  }
                />
              )}
            </div>
          </CardContent>
        </Card>
      ))}
      <DeleteWallets
        open={isDeleteOpen}
        setIsDeleteOpen={(open) => {
          setIsDeleteOpen(open);
          if (!open) setTargetDeleteIndex(null);
        }}
        handleDelete={handleDelete}
        title={targetDeleteIndex !== null ? `Are you sure you want to delete Wallet ${targetDeleteIndex + 1}?` : undefined}
        description={targetDeleteIndex !== null ? "This will remove the wallet from this device." : undefined}
      />
    </div>
  );
}
