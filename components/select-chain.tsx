import { Mode } from "@/lib/types";
import { Button } from "./ui/button";
import { toast } from "sonner";

type SelectChainProps = {
  setSelectMode: (mode: Mode) => void;
};

export default function SelectChain({ setSelectMode }: SelectChainProps) {
  return (
    <div>
      <h1 className="mt-5 font-semibold text-xl text-neutral-400">
        Choose a blockchain to get started.
      </h1>
      <div className="flex flex-row mt-5">
        <Button
          className="cursor-pointer p-5"
          onClick={() => {
            setSelectMode("generate-wallet");
            toast.success(
              "Wallet selected. Please generate a wallet to continue.",
            );
          }}
        >
          Solana
        </Button>
      </div>
    </div>
  );
}
