import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { generateMnemonic, validateMnemonic, mnemonicToSeedSync } from "bip39";
import { Keypair } from "@solana/web3.js";
import { derivePath } from "ed25519-hd-key";

export const derivationPath = [
  {
    name: "Solana",
    pattern: "m/44'/501'/0'/0'",
  },
];

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function GetItems(key: string) {
  return JSON.parse(localStorage.getItem(key) || "[]");
}

export function SetItems(key: string, value: string) {
  JSON.stringify(localStorage.setItem(key, value));
}

export function RemoveItems(key: string) {
  localStorage.removeItem(key);
}

export function generateSeed() {
  const mnemonic = generateMnemonic();
  if (!validateMnemonic(mnemonic)) {
    throw new Error("Generated mnemonic is invalid");
  }
  return mnemonic;
}

export function generateKeyFromDrivePath(inputSeed: string, accountIndex: number = 0) {
  if (!validateMnemonic(inputSeed)) {
    throw new Error("Invalid seed phrase");
  }
  const seed = mnemonicToSeedSync(inputSeed);
  const path = `m/44'/501'/${accountIndex}'/0'`;
  const driveSeed = derivePath(path, seed.toString("hex")).key;
  const keypair = Keypair.fromSeed(driveSeed);
  const publicKey = keypair.publicKey.toBase58();
  const secretKey = keypair.secretKey;

  return {
    publicKey,
    secretKey,
    path,
  };
}

export function generateMultipleWallets(inputSeed: string, count: number) {
  const wallets = [];
  for (let i = 0; i < count; i++) {
    wallets.push(generateKeyFromDrivePath(inputSeed, i));
  }
  return wallets;
}
