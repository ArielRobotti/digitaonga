import { Ed25519KeyIdentity } from "@dfinity/identity";
import { Principal } from "@dfinity/principal";
import { env } from "./env";
import { mnemonicToSeedSync } from "bip39";

/**
 * Returns a shortened version of a Principal string by slicing it and adding ellipsis.
 *
 * @param {string} p - The Principal string to be shortened.
 * @param {number} [limiter=4] - The number of characters to keep from the start and end of the string.
 * @returns {string} - The shortened Principal string with ellipsis.
 */
export const shortP = (p, limiter = 4) => p.slice(0, limiter) + "..." + p.slice(-(limiter - 1));

/**
 * Converts a Principal object to a string.
 *
 * @param {Principal} p - The Principal object to be converted.
 * @returns {string} The converted string.
 */
export const p2str = (p) => p.toString();

/**
 * Converts a string to a Principal object.
 *
 * @param {string} p - The string to convert to a Principal object.
 * @returns {Principal} The converted Principal object.
 */
export const str2p = (p) => Principal.fromText(p);

/**
 * Copies the given text to the clipboard.
 *
 * @param {string} text - The text to copy.
 * @returns {Promise<void>} A promise that resolves when the text is copied.
 */
export const copyToClipboard = async (text) => {
  if (navigator?.clipboard) await navigator.clipboard.writeText(text);
};

export const identityFromSeed = () => {
  let seed = mnemonicToSeedSync(env.AUTHORITY_SEED);
  seed = Array.from(seed);
  seed = seed.splice(0, 32);
  seed = new Uint8Array(seed);

  return Ed25519KeyIdentity.generate(seed);
};
