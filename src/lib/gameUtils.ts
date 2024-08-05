import {
  createDataItemSigner,
  message,
  result,
  dryrun,
} from "@permaweb/aoconnect";

const GamePID = "1NroE5BWvZXvoSuQLuXRvRPaHTLZS940zgAxwG_1mcA";

export const fetchSupportedTokens = async () => {
  const tokenInfo = await dryrun({
    process: GamePID,
    data: "",
    tags: [{ name: "Action", value: "TokenInfo" }],
  });
  const tokens = JSON.parse(tokenInfo.Messages[0].Data);

  for (const token of tokens) {
    const info = await dryrun({
      process: token.process,
      data: "",
      tags: [{ name: "Action", value: "Info" }],
    });
    const { Name, Ticker, Logo, Denomination } = info.Messages[0].Tags.reduce(
      (acc: any, tag: any) => {
        acc[tag.name] = tag.value;
        return acc;
      },
      {}
    );
    token.name = Name;
    token.ticker = Ticker;
    token.logo = Logo;
    token.denomination = parseInt(Denomination);
  }

  return tokens;
};

export const fetchUserBalance = async (walletAddress: string, processId: string) => {
  const balanceInfo = await dryrun({
    process: processId,
    data: '',
    tags: [
      { name: 'Action', value: 'Balance' },
      { name: 'Recipient', value: walletAddress },
    ],
  });

  const balance = parseInt(balanceInfo?.Messages[0]?.Tags?.find((tag: any) => tag.name === 'Balance')?.value);
  return balance;
};

export const fetchUserBalances = async (
  walletAddress: string,
  tokens: any[]
) => {
  const balances: { [key: string]: number } = {};

  for (const token of tokens) {
    const balanceInfo = await dryrun({
      process: token.process,
      data: "",
      tags: [
        { name: "Action", value: "Balance" },
        { name: "Recipient", value: walletAddress },
      ],
    });
    balances[token.process] = parseInt(
      balanceInfo.Messages[0].Tags.find((tag: any) => tag.name === "Balance")
        .value
    );
  }

  return balances;
};

export const fetchTokenInfo = async (processId: string) => {
  const info = await dryrun({
    process: processId,
    data: "",
    tags: [{ name: "Action", value: "Info" }],
  });
  const { Name, Ticker, Logo, Denomination } = info.Messages[0].Tags.reduce(
    (acc: any, tag: any) => {
      acc[tag.name] = tag.value;
      return acc;
    },
    {}
  );

  return {
    name: Name,
    ticker: Ticker,
    logo: Logo,
    denomination: parseInt(Denomination),
    process: processId,
  };
};

export const checkExistingGame = async (address: string) => {
  const result = await dryrun({
    process: GamePID,
    data: "",
    tags: [
      { name: "Action", value: "showState" },
      { name: "Caller", value: address },
    ],
  });
  // console.log(result);
  return result.Messages[0];
};

export const handleAction = async (
  walletAddress: string,
  action: string,
  refreshGameState: () => void
) => {
  try {
    //@ts-ignore
    const signer = createDataItemSigner(globalThis.arweaveWallet);
    const resultID = await message({
      process: GamePID,
      tags: [{ name: "Action", value: action }],
      signer,
      data: "",
    });

    await result({
      message: resultID,
      process: GamePID,
    });

    refreshGameState();
  } catch (error) {
    console.error(`Failed to ${action}:`, error);
  }
};

export const handleStartGame = async (
  walletAddress: string,
  betAmount: number,
  selectedToken: any,
  refreshGameState: () => void
) => {
  try {
    const quantity = (
      betAmount * Math.pow(10, selectedToken.denomination)
    ).toString();
    //@ts-ignore
    const signer = createDataItemSigner(globalThis.arweaveWallet);
    await message({
      process: selectedToken.process,
      tags: [
        { name: "Action", value: "Transfer" },
        { name: "Recipient", value: GamePID },
        { name: "Quantity", value: quantity },
      ],
      signer,
      data: "Start Blackjack Game",
    }).then(refreshGameState);

    refreshGameState();
  } catch (error) {
    console.error("Failed to start game:", error);
  }
};

export const handleDoubleDown = async (
  walletAddress: string,
  betAmount: number,
  selectedToken: any,
  refreshGameState: () => void
) => {
  try {
    const quantity = betAmount.toString();
    //@ts-ignore
    const signer = createDataItemSigner(globalThis.arweaveWallet);
    await message({
      process: selectedToken.process,
      tags: [
        { name: "Action", value: "Transfer" },
        { name: "Recipient", value: GamePID },
        { name: "Quantity", value: quantity },
        { name: "X-Note", value: "Double down bet" },
      ],
      signer,
      data: "Double Down Blackjack Game",
    }).then(refreshGameState);

    refreshGameState();
  } catch (error) {
    console.error("Failed to double down:", error);
  }
};

export const handleSplit = async (
  walletAddress: string,
  betAmount: number,
  selectedToken: any,
  refreshGameState: () => void
) => {
  try {
    const quantity = (
      betAmount * Math.pow(10, selectedToken.denomination)
    ).toString();
    //@ts-ignore
    const signer = createDataItemSigner(globalThis.arweaveWallet);

    await message({
      process: selectedToken.process,
      tags: [
        { name: "Action", value: "Transfer" },
        { name: "Recipient", value: GamePID },
        { name: "Quantity", value: quantity },
        { name: "X-Note", value: "Split bet" },
      ],
      signer,
      data: "Split Blackjack Game",
    }).then(refreshGameState);

    refreshGameState();
  } catch (error) {
    console.error("Failed to split:", error);
  }
};

export const handleInsurance = async (
  walletAddress: string,
  betAmount: number,
  selectedToken: any,
  refreshGameState: () => void
) => {
  try {
    const quantity = (
      betAmount * Math.pow(10, selectedToken.denomination)
    ).toString();
    //@ts-ignore
    const signer = createDataItemSigner(globalThis.arweaveWallet);

    await message({
      process: selectedToken.process,
      tags: [
        { name: "Action", value: "Transfer" },
        { name: "Recipient", value: GamePID },
        { name: "Quantity", value: quantity },
        { name: "X-Note", value: "Insurance bet" },
      ],
      signer,
      data: "Insurance Blackjack Game",
    }).then(refreshGameState);

    refreshGameState();
  } catch (error) {
    console.error("Failed to place insurance bet:", error);
  }
};

const calculateHandValue = (hand: any[]) => {
  let total = 0;
  let aces = 0;

  for (const card of hand) {
    if (card.value === 'J' || card.value === 'Q' || card.value === 'K') {
      total += 10;
    } else if (card.value === 'A') {
      aces += 1;
      total += 11;
    } else {
      total += parseInt(card.value);
    }
  }

  while (total > 21 && aces > 0) {
    total -= 10;
    aces -= 1;
  }

  return total;
};

const determineHandStatus = (hand: any, dealerHand: any, isGameOver: boolean) => {
  const handValue = calculateHandValue(hand.cards);
  const dealerHandValue = calculateHandValue(dealerHand);

  if (handValue > 21) {
    return 'Busted';
  } else if (isGameOver) {
    if (dealerHandValue > 21) {
      return 'Dealer Busted';
    } else if (handValue === dealerHandValue) {
      return 'Push';
    } else if (handValue > dealerHandValue) {
      return 'Winner';
    } else {
      return 'Dealer Wins';
    }
  } else {
    return '';
  }
};

export { calculateHandValue, determineHandStatus };
