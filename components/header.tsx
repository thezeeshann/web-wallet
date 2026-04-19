import { ModeToggle } from "./mode-toggle";
import { Wallet } from "lucide-react";

export default function Header() {
  return (
    <header className="w-full">
      <div className="flex items-center justify-between ">
        <Wallet className="cursor-pointer" />
        <ModeToggle />
      </div>
    </header>
  );
}
