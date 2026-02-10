import "@rainbow-me/rainbowkit/styles.css";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { PositionList } from "./components/PositionList";
import "./App.css";

function App() {
  return (
    <div className="app">
      <div className="grain-overlay" />

      <header className="app-header">
        <div className="header-content">
          <div className="brand">
            <img
              src="/logo.svg"
              alt="Pangolin V3 Recovery"
              className="brand-logo"
            />
            <div>
              <h1 className="brand-title">Pangolin V3 Recovery</h1>
              <p className="brand-subtitle">
                Withdraw your liquidity from Pangolin V3 pools
              </p>
            </div>
          </div>
          <ConnectButton
            showBalance={true}
            chainStatus="icon"
            accountStatus="address"
          />
        </div>
      </header>

      <main className="app-main">
        <div className="info-banner">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4M12 8h.01" />
          </svg>
          <p>
            This tool helps you recover funds from Pangolin V3 concentrated
            liquidity pools. Connect your wallet, select positions, and
            withdraw your tokens safely.
          </p>
        </div>

        <PositionList />
      </main>

      <footer className="app-footer">
        <p>
          Pangolin V3 Recovery Tool — Open source, non-custodial.
          Interacts directly with{" "}
          <a
            href="https://snowtrace.io/address/0xf40937279F38D0c1f97aFA5919F1cB3cB7f06A7F"
            target="_blank"
            rel="noopener noreferrer"
          >
            Pangolin Position Manager
          </a>{" "}
          on Avalanche C-Chain.
        </p>
      </footer>
    </div>
  );
}

export default App;
