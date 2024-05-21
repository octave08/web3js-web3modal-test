import { Web3ModalExtensionOptions } from "@magic-ext/web3modal-ethers5/dist/types/types";

// 1. Get projectId at https://cloud.walletconnect.com
const projectId = 'b87562395f3da5dc8f836883773f74dc';

// 2. Set chains
const mainnet = {
  chainId: 1,
  name: 'Ethereum',
  currency: 'ETH',
  explorerUrl: 'https://etherscan.io',
  rpcUrl: 'https://cloudflare-eth.com',
};

const sepolia = {
  chainId: 11155111,
  name: 'Sepolia',
  currency: 'ETH',
  explorerUrl: 'https://sepolia.etherscan.io',
  rpcUrl: 'https://ethereum-sepolia-rpc.publicnode.com',
};

// 3. Create your application's metadata object
const metadata = {
  name: 'My Website',
  description: 'My Website description',
  url: 'https://mywebsite.com', // url must match your domain & subdomain
  icons: ['https://avatars.mywebsite.com/'],
};

export const web3modalParams = {
  configOptions: metadata,
  modalOptions: {
    chains: [mainnet, sepolia],
    projectId,
    themeVariables: { "--w3m-border-radius-master": "8" },
  },
} as Web3ModalExtensionOptions;