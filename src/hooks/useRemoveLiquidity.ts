import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { POSITION_MANAGER_ABI } from "../abi/NonfungiblePositionManager";
import {
  POSITION_MANAGER_ADDRESS,
  WAVAX_ADDRESS,
} from "../config/contracts";
import { encodeFunctionData } from "viem";

const MAX_UINT128 = BigInt("340282366920938463463374607431768211455");

export function useRemoveLiquidity() {
  const {
    writeContract,
    data: hash,
    isPending: isWritePending,
    error: writeError,
    reset,
  } = useWriteContract();

  const {
    isLoading: isConfirming,
    isSuccess,
    error: confirmError,
  } = useWaitForTransactionReceipt({ hash });

  function removeLiquidity(
    tokenId: bigint,
    liquidity: bigint,
    recipient: `0x${string}`,
    unwrapNative: boolean,
    token0: `0x${string}`,
    token1: `0x${string}`
  ) {
    const deadline = BigInt(Math.floor(Date.now() / 1000) + 1800);

    const decreaseData = encodeFunctionData({
      abi: POSITION_MANAGER_ABI,
      functionName: "decreaseLiquidity",
      args: [
        {
          tokenId,
          liquidity,
          amount0Min: 0n,
          amount1Min: 0n,
          deadline,
        },
      ],
    });

    const collectData = encodeFunctionData({
      abi: POSITION_MANAGER_ABI,
      functionName: "collect",
      args: [
        {
          tokenId,
          recipient: unwrapNative ? POSITION_MANAGER_ADDRESS : recipient,
          amount0Max: MAX_UINT128,
          amount1Max: MAX_UINT128,
        },
      ],
    });

    const calls: `0x${string}`[] = [decreaseData, collectData];

    if (unwrapNative) {
      // Unwrap WAVAX to native AVAX
      const unwrapData = encodeFunctionData({
        abi: POSITION_MANAGER_ABI,
        functionName: "unwrapWETH9",
        args: [0n, recipient],
      });
      calls.push(unwrapData);

      // Sweep the other (non-WAVAX) token back to recipient
      const otherToken =
        token0.toLowerCase() === WAVAX_ADDRESS.toLowerCase() ? token1 : token0;
      const sweepData = encodeFunctionData({
        abi: POSITION_MANAGER_ABI,
        functionName: "sweepToken",
        args: [otherToken, 0n, recipient],
      });
      calls.push(sweepData);
    }

    writeContract({
      address: POSITION_MANAGER_ADDRESS,
      abi: POSITION_MANAGER_ABI,
      functionName: "multicall",
      args: [calls],
    });
  }

  function claimReward(
    tokenId: bigint,
    recipient: `0x${string}`
  ) {
    writeContract({
      address: POSITION_MANAGER_ADDRESS,
      abi: POSITION_MANAGER_ABI,
      functionName: "claimReward",
      args: [tokenId, recipient],
    });
  }

  function collectOnly(
    tokenId: bigint,
    recipient: `0x${string}`,
    unwrapNative: boolean,
    token0: `0x${string}`,
    token1: `0x${string}`
  ) {
    const collectData = encodeFunctionData({
      abi: POSITION_MANAGER_ABI,
      functionName: "collect",
      args: [
        {
          tokenId,
          recipient: unwrapNative ? POSITION_MANAGER_ADDRESS : recipient,
          amount0Max: MAX_UINT128,
          amount1Max: MAX_UINT128,
        },
      ],
    });

    const calls: `0x${string}`[] = [collectData];

    if (unwrapNative) {
      const unwrapData = encodeFunctionData({
        abi: POSITION_MANAGER_ABI,
        functionName: "unwrapWETH9",
        args: [0n, recipient],
      });
      calls.push(unwrapData);

      const otherToken =
        token0.toLowerCase() === WAVAX_ADDRESS.toLowerCase() ? token1 : token0;
      const sweepData = encodeFunctionData({
        abi: POSITION_MANAGER_ABI,
        functionName: "sweepToken",
        args: [otherToken, 0n, recipient],
      });
      calls.push(sweepData);
    }

    writeContract({
      address: POSITION_MANAGER_ADDRESS,
      abi: POSITION_MANAGER_ABI,
      functionName: "multicall",
      args: [calls],
    });
  }

  return {
    removeLiquidity,
    collectOnly,
    claimReward,
    hash,
    isWritePending,
    isConfirming,
    isSuccess,
    error: writeError || confirmError,
    reset,
  };
}
