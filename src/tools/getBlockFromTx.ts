import { ethers } from "ethers";
import { getJsonRpcUrl } from "forta-agent";
require("dotenv").config();

async function main() {
  const hash = process.argv[2];
  if (!hash) {
    console.error("Usage: node dist/tools/getBlockFromTx.js <txHash>");
    process.exit(1);
  }

  const rpcUrl = process.env.JSON_RPC_URL || getJsonRpcUrl();
  if (!rpcUrl) {
    console.error(
      "No RPC URL found. Set JSON_RPC_URL in .env or forta.config.json."
    );
    process.exit(1);
  }

  const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
  try {
    const tx = await provider.getTransaction(hash);
    if (!tx) {
      console.error(
        "Transaction not found (maybe on a different network or pruned)."
      );
      process.exit(1);
    }
    if (tx.blockNumber == null) {
      console.log("pending");
    } else {
      console.log(String(tx.blockNumber));
    }
  } catch (err: any) {
    console.error(`Error: ${err.message || err}`);
    process.exit(1);
  }
}

main();
