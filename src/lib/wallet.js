
export const connectWallet = async () => {
  await window.arweaveWallet.connect(['ACCESS_ADDRESS', 'SIGN_TRANSACTION', 'ACCESS_PUBLIC_KEY', 'SIGNATURE']);
  const address = await window.arweaveWallet.getActiveAddress();
  return address;
};

export const truncateAddress = (address) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const disconnectWallet = async () => {
  await window.arweaveWallet.disconnect()
}