import { Web3ModalExtension } from "@magic-ext/web3modal-ethers5";
import { Magic } from "magic-sdk";
import { web3modalParams } from "./web3modal-utils";

function initializeMagic() {
  const magic = new Magic('pk_live_79389E9CFEDB2ED8', {
    extensions: [new Web3ModalExtension(web3modalParams)],
  });
  magic.web3modal.initialize();
  return magic;
}

export const magic = initializeMagic();