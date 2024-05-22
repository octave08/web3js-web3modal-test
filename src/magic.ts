import { Web3ModalExtension } from "@magic-ext/web3modal-ethers5";
import { Magic } from "magic-sdk";
import { web3modalParams } from "./web3modal-utils";

function initializeMagic() {
  let params = new URL((document as any).location).searchParams;
  let apiKey = params.get("api_key") || 'pk_live_C3D0E30205EBD73A';
  const magic = new Magic(apiKey, {
    extensions: [new Web3ModalExtension(web3modalParams)],
    network: 'sepolia',
  });
  magic.web3modal.initialize();
  return magic;
}

export const magic = initializeMagic();