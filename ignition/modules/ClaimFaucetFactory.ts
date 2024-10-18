

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const ClaimFaucetFactoryModule = buildModule("ClaimFaucetFactoryModule", (m) => {
  const ClaimFaucetFactory = m.contract("ClaimFaucetFactory");

  return { ClaimFaucetFactory };
});

export default ClaimFaucetFactoryModule;
