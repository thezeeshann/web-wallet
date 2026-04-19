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
import { GetItems, RemoveItems } from "@/lib/utils";
import { Wallet } from "@/lib/types";

type WalletsProps = {
  setSelectMode: (mode: Mode) => void;
};

export default function Wallets({ setSelectMode }: WalletsProps) {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [showSecretKey, setShowSecretKey] = useState<Record<number, boolean>>(
    {},
  );
  const wallets = GetItems("wallet");
  function handleDelete() {
    RemoveItems("wallet");
    setSelectMode(null);
    toast.success("All wallets cleared.");
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
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="flex flex-row justify-between mt-5">
        <p className="font-semibold text-lg">Solana Wallet</p>
        <div className="flex flex-row gap-3">
          <Button className="cursor-pointer p-5" variant={"default"}>
            Add Wallet
          </Button>
          <Button
            onClick={() => setIsDeleteOpen(true)}
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
                  onClick={() => setIsDeleteOpen(true)}
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
        setIsDeleteOpen={setIsDeleteOpen}
        handleDelete={handleDelete}
      />
    </div>
  );
}
