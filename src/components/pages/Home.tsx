import { Stats } from "~/components/Stats";

import LandComponent from "../LandComponent";
import PrizePool from "../PrizePool";
import YourLandsHeader from "../YourLandsHeader";
export default function Home() {
  return (
    <div>
      <div className="space-y-6 pt-2">
        <Stats />
        <PrizePool />

        <div className="space-y-4 pt-1">
          <YourLandsHeader />
          <LandComponent />
          <LandComponent />
          <LandComponent />
        </div>
      </div>
    </div>
  );
}
