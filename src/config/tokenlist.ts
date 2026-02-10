export interface TokenInfo {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logoURI?: string;
}

export const KNOWN_TOKENS: Record<string, TokenInfo> = {
  "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7": {
    address: "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7",
    symbol: "WAVAX",
    name: "Wrapped AVAX",
    decimals: 18,
    logoURI: "https://raw.githubusercontent.com/pangolindex/tokenlists/main/logos/43114/0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7/logo_24.png",
  },
  "0x60781C2586D68229fde47564546784ab3fACA982": {
    address: "0x60781C2586D68229fde47564546784ab3fACA982",
    symbol: "PNG",
    name: "Pangolin",
    decimals: 18,
    logoURI: "https://raw.githubusercontent.com/pangolindex/tokenlists/main/logos/43114/0x60781C2586D68229fde47564546784ab3fACA982/logo_24.png",
  },
  "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E": {
    address: "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E",
    symbol: "USDC",
    name: "USD Coin",
    decimals: 6,
    logoURI: "https://raw.githubusercontent.com/pangolindex/tokenlists/main/logos/43114/0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E/logo_24.png",
  },
  "0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7": {
    address: "0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7",
    symbol: "USDT",
    name: "TetherToken",
    decimals: 6,
    logoURI: "https://raw.githubusercontent.com/pangolindex/tokenlists/main/logos/43114/0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7/logo_24.png",
  },
  "0xc7198437980c041c805A1EDcbA50c1Ce5db95118": {
    address: "0xc7198437980c041c805A1EDcbA50c1Ce5db95118",
    symbol: "USDT.e",
    name: "Tether USD (Bridged)",
    decimals: 6,
    logoURI: "https://raw.githubusercontent.com/pangolindex/tokenlists/main/logos/43114/0xc7198437980c041c805A1EDcbA50c1Ce5db95118/logo_24.png",
  },
  "0xA7D7079b0FEaD91F3e65f86E8915Cb59c1a4C664": {
    address: "0xA7D7079b0FEaD91F3e65f86E8915Cb59c1a4C664",
    symbol: "USDC.e",
    name: "USD Coin (Bridged)",
    decimals: 6,
    logoURI: "https://raw.githubusercontent.com/pangolindex/tokenlists/main/logos/43114/0xA7D7079b0FEaD91F3e65f86E8915Cb59c1a4C664/logo_24.png",
  },
  "0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB": {
    address: "0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB",
    symbol: "WETH.e",
    name: "Wrapped Ether (Bridged)",
    decimals: 18,
    logoURI: "https://raw.githubusercontent.com/pangolindex/tokenlists/main/logos/43114/0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB/logo_24.png",
  },
  "0x50b7545627a5162F82A992c33b87aDc75187B218": {
    address: "0x50b7545627a5162F82A992c33b87aDc75187B218",
    symbol: "WBTC.e",
    name: "Wrapped BTC (Bridged)",
    decimals: 8,
    logoURI: "https://raw.githubusercontent.com/pangolindex/tokenlists/main/logos/43114/0x50b7545627a5162F82A992c33b87aDc75187B218/logo_24.png",
  },
  "0xd586E7F844cEa2F87f50152665BCbc2C279D8d70": {
    address: "0xd586E7F844cEa2F87f50152665BCbc2C279D8d70",
    symbol: "DAI.e",
    name: "Dai Stablecoin (Bridged)",
    decimals: 18,
    logoURI: "https://raw.githubusercontent.com/pangolindex/tokenlists/main/logos/43114/0xd586E7F844cEa2F87f50152665BCbc2C279D8d70/logo_24.png",
  },
  "0x6e84a6216eA6dACC71eE8E6b0a5B7322EEbC0fDd": {
    address: "0x6e84a6216eA6dACC71eE8E6b0a5B7322EEbC0fDd",
    symbol: "JOE",
    name: "JoeToken",
    decimals: 18,
    logoURI: "https://raw.githubusercontent.com/pangolindex/tokenlists/main/logos/43114/0x6e84a6216eA6dACC71eE8E6b0a5B7322EEbC0fDd/logo_24.png",
  },
  "0x2b2C81e08f1Af8835a78Bb2A90AE924ACE0eA4bE": {
    address: "0x2b2C81e08f1Af8835a78Bb2A90AE924ACE0eA4bE",
    symbol: "sAVAX",
    name: "Staked AVAX",
    decimals: 18,
    logoURI: "https://raw.githubusercontent.com/pangolindex/tokenlists/main/logos/43114/0x2b2C81e08f1Af8835a78Bb2A90AE924ACE0eA4bE/logo_24.png",
  },
  "0x152b9d0FdC40C096DE20232Db4820c92EE4756c": {
    address: "0x152b9d0FdC40C096DE20232Db4820c92EE4756c",
    symbol: "BTC.b",
    name: "Bitcoin",
    decimals: 8,
  },
};

export function getTokenInfo(address: string): TokenInfo | undefined {
  const checksummed = Object.keys(KNOWN_TOKENS).find(
    (k) => k.toLowerCase() === address.toLowerCase()
  );
  return checksummed ? KNOWN_TOKENS[checksummed] : undefined;
}
