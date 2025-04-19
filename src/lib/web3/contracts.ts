import { NETWORK_DATA } from "../constants/network-data";
import { CLNY_ABI } from "./abi/CLNY";
import { GAME_MANAGER_ABI } from "./abi/GameManager";
import { MC_ABI } from "./abi/MC";
import { ZERO_COLONISTS_ABI } from "./abi/ZeroColonists";

export const CLNY_CONTRACT = {
  address: NETWORK_DATA.CLNY as `0x${string}`,
  abi: CLNY_ABI,
} as const;

export const GAME_MANAGER_CONTRACT = {
  address: NETWORK_DATA.GM as `0x${string}`,
  abi: GAME_MANAGER_ABI,
} as const;

export const MC_CONTRACT = {
  address: NETWORK_DATA.MC as `0x${string}`,
  abi: MC_ABI,
} as const;

export const ZERO_COLONISTS_CONTRACT = {
  address: NETWORK_DATA.ZERO_COLONISTS as `0x${string}`,
  abi: ZERO_COLONISTS_ABI,
} as const;
