import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { avalanche } from "wagmi/chains";

export const config = getDefaultConfig({
  appName: "Pangolin V3 Recovery",
  projectId: "b1e8f230c535b03a7f1e634eb13f0495",
  chains: [avalanche],
});
