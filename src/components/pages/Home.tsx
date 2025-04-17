import { Stats } from "~/components/Stats";
import { usePagination } from "~/lib/hooks/usePagination";
import { useLandsDetailsPaginate, useMyLands } from "~/lib/web3/hooks";
import LandComponent from "../LandComponent";
import { Pagination } from "../Pagination";
import PrizePool from "../PrizePool";
import YourLandsHeader from "../YourLandsHeader";

export default function Home() {
  const { myLands } = useMyLands();
  const { currentPage, paginatedItems, totalPages, isEmpty, handlePageChange } =
    usePagination({
      items: myLands,
      itemsPerPage: 10,
    });

  const { landsDetails, isLoadingLandsDetails } = useLandsDetailsPaginate(
    isEmpty ? [] : paginatedItems,
  );

  return (
    <div>
      <div className="space-y-6 pt-2">
        <Stats />
        <PrizePool />

        <div className="space-y-4 pt-1">
          <YourLandsHeader />

          {isEmpty ? (
            <div className="flex h-40 items-center justify-center rounded-lg border border-white/5 bg-white/5">
              <p className="text-white/70">You have no lands yet</p>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {isLoadingLandsDetails ? (
                  <div className="flex h-40 items-center justify-center">
                    <p className="text-white/70">Loading lands...</p>
                  </div>
                ) : (
                  paginatedItems.map((landId, index) => (
                    <LandComponent
                      key={landId}
                      landId={landId}
                      landDetails={landsDetails ? landsDetails[index] : undefined}
                    />
                  ))
                )}
              </div>

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
