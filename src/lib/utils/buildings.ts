export type BuildingKey =
  | "baseStation"
  | "robotAssembly"
  | "transport"
  | "powerProduction";

export interface BuildingConfig {
  /** used to look up the on‐chain field */
  key: BuildingKey;
  title: string;
  maxLevel: number;
  /** CLNY cost required to reach `level` */
  getPrice: (level: number) => number;
  /** CLNY/day reward once at `level` */
  getReward: (level: number) => number;
  /** true if `currentLevel` is at or above `building.maxLevel` */
  getIsFullyUpgraded: (level: number) => boolean;

  /** CLNY/day reward increase for each level */
  getRewardIncrease: (level: number) => number;
  contract: {
    method:
      | "buildBaseStation"
      | "buildRobotAssembly"
      | "buildTransport"
      | "buildPowerProduction";
    getArgs: (landId: string, nextLevel: number) => unknown[];
  };
}

/**
 * Exponential 2× price helper:
 * lvl 1 = basePrice, lvl 2 = 2x, lvl 3 = 4x, ...
 */
const price2x = (basePrice: number, level: number): number =>
  basePrice * Math.pow(2, level - 1);

export const BUILDINGS: BuildingConfig[] = [
  {
    key: "baseStation",
    title: "Electricity",
    maxLevel: 1,
    getPrice: (lvl) => (lvl === 1 ? 30 : Infinity),
    getReward: (lvl) => (lvl === 1 ? 1 : 0),
    getIsFullyUpgraded: (lvl) => lvl === 1,
    getRewardIncrease: () => 1,
    contract: {
      method: "buildBaseStation",
      getArgs: (landId) => [landId], // no level param needed
    },
  },
  {
    key: "robotAssembly",
    title: "Data Center",
    maxLevel: 3,
    getPrice: (lvl) => price2x(120, lvl),
    getReward: (lvl) => 1 + lvl,
    getIsFullyUpgraded: (lvl) => lvl === 3,
    getRewardIncrease: (lvl) => (lvl === 0 ? 2 : 1),
    contract: {
      method: "buildRobotAssembly",
      getArgs: (landId, nextLevel) => [landId, nextLevel],
    },
  },
  {
    key: "transport",
    title: "Node",
    maxLevel: 3,
    getPrice: (lvl) => price2x(120, lvl),
    getReward: (lvl) => 1 + lvl,
    getIsFullyUpgraded: (lvl) => lvl === 3,
    getRewardIncrease: (lvl) => (lvl === 0 ? 2 : 1),
    contract: {
      method: "buildTransport",
      getArgs: (landId, nextLevel) => [landId, nextLevel],
    },
  },
  {
    key: "powerProduction",
    title: "AI Lab",
    maxLevel: 3,
    getPrice: (lvl) => price2x(120, lvl),
    getReward: (lvl) => 1 + lvl,
    getIsFullyUpgraded: (lvl) => lvl === 3,
    getRewardIncrease: (lvl) => (lvl === 0 ? 2 : 1),
    contract: {
      method: "buildPowerProduction",
      getArgs: (landId, nextLevel) => [landId, nextLevel],
    },
  },
];
