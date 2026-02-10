import { useAccount } from "wagmi";
import { useAllPositions } from "../hooks/usePositions";
import { PositionCard } from "./PositionCard";

export function PositionList() {
  const { address, isConnected } = useAccount();
  const { positions, isLoading, positionCount } = useAllPositions(
    address as `0x${string}` | undefined
  );

  if (!isConnected) {
    return (
      <div className="connect-prompt">
        <div className="prompt-icon">
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
            <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
            <path d="M18 12a2 2 0 0 0 0 4h4v-4h-4z" />
          </svg>
        </div>
        <h2>Connect Your Wallet</h2>
        <p>
          Connect your wallet to view and manage your Pangolin V3 liquidity
          positions.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="loading-state">
        <div className="spinner" />
        <p>Loading your positions...</p>
      </div>
    );
  }

  if (positionCount === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M8 15h8M9 9h.01M15 9h.01" />
          </svg>
        </div>
        <h2>No Positions Found</h2>
        <p>
          This wallet doesn't have any Pangolin V3 liquidity positions on
          Avalanche.
        </p>
      </div>
    );
  }

  const activePositions = positions.filter((p) => p.liquidity > 0n);
  const closedPositions = positions.filter(
    (p) => p.liquidity === 0n && (p.tokensOwed0 > 0n || p.tokensOwed1 > 0n)
  );
  const emptyPositions = positions.filter(
    (p) =>
      p.liquidity === 0n &&
      p.tokensOwed0 === 0n &&
      p.tokensOwed1 === 0n &&
      p.totalReward === 0n
  );

  return (
    <div className="positions-container">
      <div className="positions-summary">
        <h2>Your Positions</h2>
        <div className="summary-stats">
          <span className="stat">
            <strong>{positionCount}</strong> Total
          </span>
          <span className="stat active">
            <strong>{activePositions.length}</strong> Active
          </span>
          {closedPositions.length > 0 && (
            <span className="stat pending">
              <strong>{closedPositions.length}</strong> With Uncollected Fees
            </span>
          )}
          {positions.filter((p) => p.totalReward > 0n).length > 0 && (
            <span className="stat rewards-stat">
              <strong>{positions.filter((p) => p.totalReward > 0n).length}</strong> With Rewards
            </span>
          )}
        </div>
      </div>

      {activePositions.length > 0 && (
        <div className="position-section">
          <h3 className="section-title">Active Positions</h3>
          <div className="positions-grid">
            {activePositions.map((pos) => (
              <PositionCard key={pos.tokenId.toString()} position={pos} />
            ))}
          </div>
        </div>
      )}

      {closedPositions.length > 0 && (
        <div className="position-section">
          <h3 className="section-title">Positions with Uncollected Fees</h3>
          <div className="positions-grid">
            {closedPositions.map((pos) => (
              <PositionCard key={pos.tokenId.toString()} position={pos} />
            ))}
          </div>
        </div>
      )}

      {emptyPositions.length > 0 && (
        <div className="position-section">
          <h3 className="section-title dim">Empty Positions</h3>
          <div className="positions-grid">
            {emptyPositions.map((pos) => (
              <PositionCard key={pos.tokenId.toString()} position={pos} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
