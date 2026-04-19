import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { generateMnemonic } from "bip39";
import { Keypair } from "@solana/web3.js";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function GetItems(key:string){
  return  JSON.parse(localStorage.getItem(key) || "[]")
}

export function SetItems(key:string,value:string){
  JSON.stringify(localStorage.setItem(key,value))
}

export function RemoveItems(key:string){
  localStorage.removeItem(key)
}

export function generateSeed() {
  const mnemonic = generateMnemonic();
  console.log("Generated Mnemonic:", mnemonic);
  return mnemonic;
}


export default function generateWalletKeys() {
  const keypair = Keypair.generate();
  const publicKey = keypair.publicKey.toBase58();
  const secretKey = keypair.secretKey;
  const seed = generateSeed();
  return {
    publicKey,
    secretKey,
    seed,
  };
}
