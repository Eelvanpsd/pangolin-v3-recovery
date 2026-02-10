import { useState } from "react";
import { useAccount } from "wagmi";
import type { PositionData } from "../hooks/usePositions";
import { formatTokenAmount, formatRewardAmount, isWAVAX } from "../hooks/usePositions";
import { useRemoveLiquidity } from "../hooks/useRemoveLiquidity";
import { getTokenInfo } from "../config/tokenlist";

interface PositionCardProps {
  position: PositionData;
}

export function PositionCard({ position }: PositionCardProps) {
  const { address } = useAccount();
  const [percentage, setPercentage] = useState(100);
  const {
    removeLiquidity,
    collectOnly,
    claimReward,
    hash,
    isWritePending,
    isConfirming,
    isSuccess,
    error,
    reset,
  } = useRemoveLiquidity();

  const [rewardsClaimed, setRewardsClaimed] = useState(false);

  const hasLiquidity = position.liquidity > 0n;
  const hasUncollected =
    position.tokensOwed0 > 0n || position.tokensOwed1 > 0n;
  const hasRewards = position.claimableReward > 0n;
  const containsWAVAX =
    isWAVAX(position.token0) || isWAVAX(position.token1);
  const [unwrapAVAX, setUnwrapAVAX] = useState(containsWAVAX);

  const feePercent = position.fee / 10000;

  const token0Info = getTokenInfo(position.token0);
  const token1Info = getTokenInfo(position.token1);

  const handleRemove = () => {
    if (!address) return;
    reset();

    const liquidityToRemove =
      (position.liquidity * BigInt(percentage)) / 100n;

    removeLiquidity(
      position.tokenId,
      liquidityToRemove,
      address,
      unwrapAVAX && containsWAVAX,
      position.token0 as `0x${string}`,
      position.token1 as `0x${string}`
    );
  };

  const handleCollect = () => {
    if (!address) return;
    reset();
    collectOnly(
      position.tokenId,
      address,
      unwrapAVAX && containsWAVAX,
      position.token0 as `0x${string}`,
      position.token1 as `0x${string}`
    );
  };

  const handleClaimReward = () => {
    if (!address) return;
    reset();
    setRewardsClaimed(true);
    claimReward(position.tokenId, address);
  };

  const isPending = isWritePending || isConfirming;

  return (
    <div className="position-card">
      <div className="position-header">
        <div className="token-pair">
          <div className="token-icons">
            {token0Info?.logoURI && (
              <img
                src={token0Info.logoURI}
                alt={position.token0Symbol}
                className="token-icon"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            )}
            {token1Info?.logoURI && (
              <img
                src={token1Info.logoURI}
                alt={position.token1Symbol}
                className="token-icon token-icon-overlap"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            )}
          </div>
          <span className="pair-name">
            {position.token0Symbol} / {position.token1Symbol}
          </span>
          <span className="fee-badge">{feePercent}%</span>
        </div>
        <div className="position-id">#{position.tokenId.toString()}</div>
      </div>

      <div className="position-details">
        <div className="detail-row">
          <span className="detail-label">Liquidity</span>
          <span className={`detail-value ${hasLiquidity ? "active" : "empty"}`}>
            {hasLiquidity ? "Active" : "Empty"}
          </span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Tick Range</span>
          <span className="detail-value">
            {position.tickLower} → {position.tickUpper}
          </span>
        </div>
        {hasUncollected && (
          <div className="detail-row uncollected">
            <span className="detail-label">Uncollected Fees</span>
            <div className="detail-value">
              <div>
                {formatTokenAmount(
                  position.tokensOwed0,
                  position.token0Decimals
                )}{" "}
                {position.token0Symbol}
              </div>
              <div>
                {formatTokenAmount(
                  position.tokensOwed1,
                  position.token1Decimals
                )}{" "}
                {position.token1Symbol}
              </div>
            </div>
          </div>
        )}
        {hasRewards && (
          <div className="detail-row rewards">
            <span className="detail-label">Pending Rewards</span>
            <div className="detail-value">
              {formatRewardAmount(position.claimableReward)} PNG
            </div>
          </div>
        )}
      </div>

      {hasLiquidity && (
        <div className="percentage-selector">
          <label className="slider-label">
            Remove: <strong>{percentage}%</strong>
          </label>
          <input
            type="range"
            min="1"
            max="100"
            value={percentage}
            onChange={(e) => setPercentage(Number(e.target.value))}
            className="range-slider"
          />
          <div className="preset-buttons">
            {[25, 50, 75, 100].map((p) => (
              <button
                key={p}
                className={`preset-btn ${percentage === p ? "active" : ""}`}
                onClick={() => setPercentage(p)}
              >
                {p}%
              </button>
            ))}
          </div>
        </div>
      )}

      {containsWAVAX && (
        <label className="unwrap-toggle">
          <input
            type="checkbox"
            checked={unwrapAVAX}
            onChange={(e) => setUnwrapAVAX(e.target.checked)}
          />
          <span>Receive as native AVAX instead of WAVAX</span>
        </label>
      )}

      {hasRewards && !rewardsClaimed && hasLiquidity && (
        <div className="reward-warning">
          Claim your rewards before removing liquidity, or they will be lost.
        </div>
      )}

      <div className="action-buttons">
        {hasRewards && !rewardsClaimed && (
          <button
            className="btn btn-claim"
            onClick={handleClaimReward}
            disabled={isPending}
          >
            {isWritePending
              ? "Confirm in Wallet..."
              : isConfirming
              ? "Claiming..."
              : `Claim ${formatRewardAmount(position.claimableReward)} PNG`}
          </button>
        )}
        {hasLiquidity && (
          <button
            className="btn btn-remove"
            onClick={handleRemove}
            disabled={isPending || (hasRewards && !rewardsClaimed)}
            title={hasRewards && !rewardsClaimed ? "Claim rewards first" : undefined}
          >
            {isWritePending
              ? "Confirm in Wallet..."
              : isConfirming
              ? "Removing..."
              : `Remove ${percentage}% Liquidity`}
          </button>
        )}
        {hasUncollected && (
          <button
            className="btn btn-collect"
            onClick={handleCollect}
            disabled={isPending}
          >
            {isWritePending
              ? "Confirm in Wallet..."
              : isConfirming
              ? "Collecting..."
              : "Collect Fees"}
          </button>
        )}
        {!hasLiquidity && !hasUncollected && !hasRewards && (
          <div className="empty-position">
            This position is empty — nothing to withdraw.
          </div>
        )}
      </div>

      {isSuccess && (
        <div className="tx-success">
          Transaction confirmed!{" "}
          <a
            href={`https://snowtrace.io/tx/${hash}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            View on Snowtrace →
          </a>
        </div>
      )}

      {error && (
        <div className="tx-error">
          {(error as Error).message?.slice(0, 200) ?? "Transaction failed"}
        </div>
      )}
    </div>
  );
}
