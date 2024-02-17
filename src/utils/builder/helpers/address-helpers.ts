/* eslint-disable import/first */
import * as bs58check from 'bs58check';
import { sha256 } from 'js-sha256';
var Buffer = require('buffer/').Buffer; // note: the trailing slash is important!
window['Buffer'] = window['Buffer'] || Buffer;
window['bitcoin'] = window['bitcoin'] || {};
// eslint-disable-next-line import/first
//import * as ecc from '@bitcoin-js/tiny-secp256k1-asmjs';
import * as ecc from '@bitcoinerlab/secp256k1';
// eslint-disable-next-line import/first
window['bitcoin'].initEccLib(ecc);
import {
  networks,

} from "bitcoinjs-lib";
export const NETWORK = process.env.REACT_APP_ELECTRUMX_NETWORK === 'testnet' ? networks.testnet : process.env.REACT_APP_ELECTRUMX_NETWORK == "regtest" ? networks.regtest : networks.bitcoin;

var bitcoin = window['bitcoin'];
export function detectAddressTypeToScripthash(address: string): {
  output: string;
  scripthash: string;
  address: string;
} {
  // Detect legacy address
  try {
    bitcoin.address.fromBase58Check(address,NETWORK);
    const p2pkh = addressToP2PKH(address);
    const p2pkhBuf = Buffer.from(p2pkh, 'hex');
    return {
      output: p2pkh,
      scripthash: Buffer.from(sha256(p2pkhBuf), 'hex').reverse().toString('hex'),
      address,
    };
  } catch (err) {}
  const BECH32_SEGWIT_PREFIX = 'bc1';
  const BECH32_TAPROOT_PREFIX = 'bc1p';
  const TESTNET_SEGWIT_PREFIX = 'tb1';
  const REGTEST_TAPROOT_PREFIX = 'bcrt1p';


  // Detect segwit or taproot
  const detected = bitcoin.address.fromBech32(address);
  if (address.indexOf(BECH32_TAPROOT_PREFIX) === 0) {
    const output = bitcoin.address.toOutputScript(address, NETWORK);
    return {
      output,
      scripthash: Buffer.from(sha256(output), 'hex').reverse().toString('hex'),
      address,
    };
  } else if (address.indexOf(BECH32_TAPROOT_PREFIX) === 0||address.indexOf(BECH32_SEGWIT_PREFIX) === 0|| address.indexOf(TESTNET_SEGWIT_PREFIX) === 0|| address.indexOf(REGTEST_TAPROOT_PREFIX) === 0) {
    const output = bitcoin.address.toOutputScript(address, NETWORK);
    return {
      output,
      scripthash: Buffer.from(sha256(output), 'hex').reverse().toString('hex'),
      address,
    };
  }
  else{
    throw new Error('unrecognized address');
  }
}

export function detectScriptToAddressType(script: string): string {
  const address = bitcoin.address.fromOutputScript(Buffer.from(script, 'hex'),networks);
  return address;
}

export function addressToScripthash(address: string): string {
  const p2pkh = addressToP2PKH(address);
  const p2pkhBuf = Buffer.from(p2pkh, 'hex');
  return Buffer.from(sha256(p2pkhBuf), 'hex').reverse().toString('hex');
}

export function addressToP2PKH(address: string): string {
  const addressDecoded = bs58check.decode(address);
  const addressDecodedSub = addressDecoded.toString().substr(2);
  const p2pkh = `76a914${addressDecodedSub}88ac`;
  return p2pkh;
}

export function addressToHash160(address: string): string {
  const addressDecoded = bs58check.decode(address);
  const addressDecodedSub = addressDecoded.toString().substr(2);
  return addressDecodedSub;
}
export function hash160BufToAddress(hash160: Buffer): string {
  const addressEncoded = bs58check.encode(hash160);
  return addressEncoded;
}
export function hash160HexToAddress(hash160: string): string {
  const addressEncoded = bs58check.encode(Buffer.from(hash160, 'hex'));
  return addressEncoded;
}
   