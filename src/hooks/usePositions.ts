import { useReadContract, useReadContracts } from "wagmi";
import { POSITION_MANAGER_ABI } from "../abi/NonfungiblePositionManager";
import { ERC20_ABI } from "../abi/ERC20";
import { POSITION_MANAGER_ADDRESS, WAVAX_ADDRESS } from "../config/contracts";
import { getTokenInfo } from "../config/tokenlist";
import { formatUnits } from "viem";

export interface PositionData {
  tokenId: bigint;
  token0: string;
  token1: string;
  fee: number;
  tickLower: number;
  tickUpper: number;
  liquidity: bigint;
  tokensOwed0: bigint;
  tokensOwed1: bigint;
  token0Symbol: string;
  token1Symbol: string;
  token0Decimals: number;
  token1Decimals: number;
  token0Name: string;
  token1Name: string;
  hasRewards: boolean;
}

export function usePositionCount(address: `0x${string}` | undefined) {
  return useReadContract({
    address: POSITION_MANAGER_ADDRESS,
    abi: POSITION_MANAGER_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });
}

export function usePositionTokenIds(
  address: `0x${string}` | undefined,
  count: number
) {
  const contracts = Array.from({ length: count }, (_, i) => ({
    address: POSITION_MANAGER_ADDRESS as `0x${string}`,
    abi: POSITION_MANAGER_ABI,
    functionName: "tokenOfOwnerByIndex" as const,
    args: [address!, BigInt(i)] as const,
  }));

  return useReadContracts({
    contracts,
    query: { enabled: !!address && count > 0 },
  });
}

export function usePositionDetails(tokenIds: bigint[]) {
  const contracts = tokenIds.map((tokenId) => ({
    address: POSITION_MANAGER_ADDRESS as `0x${string}`,
    abi: POSITION_MANAGER_ABI,
    functionName: "positions" as const,
    args: [tokenId] as const,
  }));

  return useReadContracts({
    contracts,
    query: { enabled: tokenIds.length > 0 },
  });
}

export function usePositionRewards(tokenIds: bigint[]) {
  const contracts = tokenIds.map((tokenId) => ({
    address: POSITION_MANAGER_ADDRESS as `0x${string}`,
    abi: POSITION_MANAGER_ABI,
    functionName: "positionReward" as const,
    args: [tokenId] as const,
  }));

  return useReadContracts({
    contracts,
    query: { enabled: tokenIds.length > 0 },
  });
}

export function useTokenMetadata(addresses: string[]) {
  const unique = [...new Set(addresses.map((a) => a.toLowerCase()))];

  const contracts = unique.flatMap((addr) => [
    {
      address: addr as `0x${string}`,
      abi: ERC20_ABI,
      functionName: "symbol" as const,
    },
    {
      address: addr as `0x${string}`,
      abi: ERC20_ABI,
      functionName: "decimals" as const,
    },
    {
      address: addr as `0x${string}`,
      abi: ERC20_ABI,
      functionName: "name" as const,
    },
  ]);

  return useReadContracts({
    contracts,
    query: { enabled: unique.length > 0 },
  });
}

export function useAllPositions(address: `0x${string}` | undefined) {
  const { data: balanceData, isLoading: balanceLoading } =
    usePositionCount(address);
  const count = balanceData ? Number(balanceData) : 0;

  const { data: tokenIdsData, isLoading: idsLoading } = usePositionTokenIds(
    address,
    count
  );

  const tokenIds: bigint[] = (tokenIdsData ?? [])
    .filter((r) => r.status === "success")
    .map((r) => r.result as bigint);

  const { data: positionsData, isLoading: positionsLoading } =
    usePositionDetails(tokenIds);

  const { data: rewardsData, isLoading: rewardsLoading } =
    usePositionRewards(tokenIds);

  const allTokenAddresses: string[] = [];
  if (positionsData) {
    for (const result of positionsData) {
      if (result.status === "success") {
        const pos = result.result as unknown as [
          bigint, string, string, string, number, number, number,
          bigint, bigint, bigint, bigint, bigint
        ];
        allTokenAddresses.push(pos[2], pos[3]);
      }
    }
  }

  const { data: metadataData, isLoading: metaLoading } =
    useTokenMetadata(allTokenAddresses);

  const metadataMap = new Map<
    string,
    { symbol: string; decimals: number; name: string }
  >();

  if (metadataData && allTokenAddresses.length > 0) {
    const unique = [...new Set(allTokenAddresses.map((a) => a.toLowerCase()))];
    for (let i = 0; i < unique.length; i++) {
      const symbolResult = metadataData[i * 3];
      const decimalsResult = metadataData[i * 3 + 1];
      const nameResult = metadataData[i * 3 + 2];

      const known = getTokenInfo(unique[i]);

      metadataMap.set(unique[i], {
        symbol:
          known?.symbol ??
          (symbolResult?.status === "success"
            ? (symbolResult.result as string)
            : "???"),
        decimals:
          known?.decimals ??
          (decimalsResult?.status === "success"
            ? Number(decimalsResult.result)
            : 18),
        name:
          known?.name ??
          (nameResult?.status === "success"
            ? (nameResult.result as string)
            : "Unknown"),
      });
    }
  }

  const positions: PositionData[] = [];

  if (positionsData) {
    for (let i = 0; i < positionsData.length; i++) {
      const result = positionsData[i];
      if (result.status !== "success") continue;

      const pos = result.result as unknown as [
        bigint, string, string, string, number, number, number,
        bigint, bigint, bigint, bigint, bigint
      ];

      const token0Addr = pos[2].toLowerCase();
      const token1Addr = pos[3].toLowerCase();
      const meta0 = metadataMap.get(token0Addr) ?? {
        symbol: "???",
        decimals: 18,
        name: "Unknown",
      };
      const meta1 = metadataMap.get(token1Addr) ?? {
        symbol: "???",
        decimals: 18,
        name: "Unknown",
      };

      let hasRewards = false;
      if (rewardsData && rewardsData[i]?.status === "success") {
        const rewardResult = rewardsData[i].result as unknown as [
          bigint, number, number, bigint
        ];
        hasRewards = (rewardResult[3] as bigint) > 0n;
      }

      positions.push({
        tokenId: tokenIds[i],
        token0: pos[2],
        token1: pos[3],
        fee: Number(pos[4]),
        tickLower: Number(pos[5]),
        tickUpper: Number(pos[6]),
        liquidity: pos[7] as bigint,
        tokensOwed0: pos[10] as bigint,
        tokensOwed1: pos[11] as bigint,
        token0Symbol: meta0.symbol,
        token1Symbol: meta1.symbol,
        token0Decimals: meta0.decimals,
        token1Decimals: meta1.decimals,
        token0Name: meta0.name,
        token1Name: meta1.name,
        hasRewards,
      });
    }
  }

  return {
    positions,
    isLoading: balanceLoading || idsLoading || positionsLoading || metaLoading || rewardsLoading,
    positionCount: count,
  };
}

export function formatTokenAmount(
  amount: bigint,
  decimals: number
): string {
  const formatted = formatUnits(amount, decimals);
  const num = parseFloat(formatted);
  if (num === 0) return "0";
  if (num < 0.0001) return "<0.0001";
  if (num < 1) return num.toFixed(6);
  if (num < 1000) return num.toFixed(4);
  return num.toLocaleString("en-US", { maximumFractionDigits: 2 });
}

export function isWAVAX(address: string): boolean {
  return address.toLowerCase() === WAVAX_ADDRESS.toLowerCase();
}
