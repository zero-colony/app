import { Stats } from "~/components/Stats";
import { usePagination } from "~/lib/hooks/usePagination";
import { useLandsDetails, useMyLands } from "~/lib/web3/hooks";
import Land from "../Land";
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

  const tokens = isEmpty ? [] : paginatedItems;
  const { landsDetails, isLoadingLandsDetails } = useLandsDetails(tokens);

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
                    <Land
                      key={landId}
                      landId={landId}
                      landDetails={landsDetails![index]}
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
