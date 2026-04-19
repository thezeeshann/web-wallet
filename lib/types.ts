export type Mode = "generate-wallet" | "wallets" | null;

export type Wallet = {
    publicKey:string;
    secretKey:string;   
    seed:string;
}