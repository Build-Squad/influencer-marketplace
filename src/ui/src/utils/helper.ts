import { getAssociatedTokenAddress } from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";
import parse from "html-react-parser";

export function stringToColor(string: string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

export function htmlStringToComponent(htmlString: string) {
  if (htmlString) {
    return parse(htmlString);
  }
}

export function isUrl(url: string) {
  try {
    new URL(url);
    return true;
  } catch (_) {
    return false;
  }
}

export const findATA = (
  walletKey: PublicKey,
  mintKey: PublicKey
): Promise<PublicKey> => {
  return getAssociatedTokenAddress(
    mintKey,
    walletKey,
    true // allowOwnerOffCurve aka PDA
  );
};
