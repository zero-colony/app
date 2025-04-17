import Graphic from "@arcgis/core/Graphic";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import PolygonSymbol3D from "@arcgis/core/symbols/PolygonSymbol3D";
import SceneView from "@arcgis/core/views/SceneView";
import { arrow, autoUpdate, flip, offset, shift, useFloating } from "@floating-ui/react";
import { NETWORK_DATA } from "~/lib/constants";
import {
  initView,
  parseTokenNumber,
  simpleFillSymbol,
  toLat,
  toLong,
  toTokenNumber,
} from "~/lib/utils/globe";

import { useCallback, useEffect, useRef, useState } from "react";

import { parseEther } from "viem";

// Colors configuration
const COLORS = {
  availableLand: [75, 169, 143, 0.5] as [number, number, number, number],
  occupiedLand: [255, 100, 0, 0.4] as [number, number, number, number], // Orange for occupied land
  myLand: [95, 158, 131, 0.5] as [number, number, number, number], // Softer green for my land
  tooltipBackground: "rgba(0, 0, 0, 0.75)", // Black with opacity for tooltip
};

interface Props {
  allTokens: string[] | null;
  myTokens: string[] | null;

  handleClaim: (
    token: number,
    { onSuccess }: { onSuccess?: () => void },
  ) => Promise<void>;
  balanceInWei: number | bigint;
  currency: string;
}

export const MarsGlobe = ({
  allTokens,
  myTokens,
  balanceInWei,
  currency,
  handleClaim,
}: Props) => {
  const tokenRef = useRef<string | null>(null);
  const hoverLayer = useRef<GraphicsLayer>(null);
  const view = useRef<SceneView | null>(null);
  const tokensLayer = useRef<GraphicsLayer | null>(null);
  const arrowRef = useRef(null);

  const address = "";

  console.log("rerendering");

  // Tooltip state
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const [tooltipData, setTooltipData] = useState<{
    longitudes: number[];
    latitudes: number[];
    token: number;
  } | null>(null);

  // Setup floating UI
  const { refs, floatingStyles, context, update } = useFloating({
    placement: "bottom",
    middleware: [
      offset(10),
      flip({
        fallbackPlacements: ["top", "left", "right"],
        padding: 10,
      }),
      shift({
        padding: { left: 82, top: 10, right: 10, bottom: 10 },
      }),

      // eslint-disable-next-line react-compiler/react-compiler
      arrow({
        element: arrowRef,
      }),
    ],
    whileElementsMounted: autoUpdate,
    open: isTooltipOpen,
    onOpenChange: setIsTooltipOpen,
  });

  useEffect(() => {
    if (view.current && view.current.popup) {
      view.current.popup.defaultPopupTemplateEnabled = false;
      view.current.popup.dockOptions = {
        buttonEnabled: false, // Disables the dock button
        breakpoint: false, // Prevents responsive docking
      };
    }
  }, []);

  useEffect(() => {
    if (!view.current) return;
    const realView = view.current;

    realView.on("click", (evt) => {
      const point = realView.toMap({ x: evt.x, y: evt.y });

      if (!point) return;
      const { latitude, longitude } = point;

      if (
        latitude === undefined ||
        latitude === null ||
        longitude === undefined ||
        longitude === null
      )
        return;

      const token = toTokenNumber(latitude, longitude) as number;

      // If clicking on the same token that's already open, keep the tooltip open
      if (tooltipData?.token === token && isTooltipOpen) {
        return;
      }

      setTooltipData({
        longitudes: [longitude, longitude + 1],
        latitudes: [latitude, latitude + 1],
        token: token,
      });

      refs.setPositionReference({
        getBoundingClientRect() {
          return {
            width: 0,
            height: 0,
            x: evt.x,
            y: evt.y,
            top: evt.y,
            right: evt.x,
            bottom: evt.y,
            left: evt.x,
          };
        },
      });

      setIsTooltipOpen(true);
    });

    realView.on("drag", () => {
      setIsTooltipOpen(false);
    });

    realView.on("mouse-wheel", () => {
      setIsTooltipOpen(false);
    });

    realView.on("key-down", (event) => {
      // Hide tooltip on arrow keys, +/- keys, etc.
      if (event.key.includes("Arrow") || event.key === "+" || event.key === "-") {
        setIsTooltipOpen(false);
      }
    });
  }, [tooltipData, isTooltipOpen]);

  const lastTokenRef = useRef<string | null>(null);

  const createPolygon = useCallback((x: number, y: number) => {
    const latitudes: [number, number] = [toLat(y), toLat(y + 1)];
    const longitudes: [number, number] = [toLong(x), toLong(x + 1)];

    return {
      type: "polygon",
      rings: [
        [longitudes[0], latitudes[0]],
        [longitudes[0], latitudes[1]],
        [longitudes[1], latitudes[1]],
        [longitudes[1], latitudes[0]],
      ],
      spatialReference: { wkid: 104971 },
    };
  }, []);

  const getSymbolForToken = useCallback(
    (token: string) => {
      return !allTokens?.includes(token)
        ? simpleFillSymbol(COLORS.availableLand) // Green for available
        : simpleFillSymbol(COLORS.occupiedLand); // Orange for occupied
    },
    [allTokens],
  );

  const createGraphicForToken = useCallback(
    (token: string) => {
      const { x, y } = parseTokenNumber(token) ?? {};
      if (x === undefined || y === undefined) return null;

      const polygon = createPolygon(x, y);
      const symbol = getSymbolForToken(token);

      return new Graphic({
        // @ts-expect-error some types
        geometry: polygon,
        symbol: symbol,
      });
    },
    [createPolygon, getSymbolForToken],
  );

  const updateHoverLayer = useCallback(() => {
    if (!hoverLayer.current) return;

    const curToken = tokenRef.current;

    if (curToken !== lastTokenRef.current) {
      lastTokenRef.current = curToken;
      const firstGraphic = hoverLayer.current.graphics.at(0);
      if (firstGraphic) {
        hoverLayer.current.remove(firstGraphic);
      }

      if (curToken !== null) {
        const graphic = createGraphicForToken(curToken);
        if (graphic) {
          hoverLayer.current.add(graphic);
        }
      }
    }
  }, [createGraphicForToken]);

  useEffect(() => {
    if (myTokens === null || allTokens === null || !hoverLayer.current) return;

    const intervalId = setInterval(updateHoverLayer, 50);

    return () => {
      clearInterval(intervalId);
    };
  }, [allTokens, myTokens, updateHoverLayer]);
  useEffect(() => {
    tokensLayer.current?.removeAll();
    // STEP 1 - render a view as soon as possible
    if (view.current === null) {
      const {
        tokenLayer: _tl,
        hoverLayer: _hl,
        view: _view,
      } = initView(tokenRef, (token) => {
        tokenRef.current = token;
      });
      tokensLayer.current = _tl;
      hoverLayer.current = _hl;
      view.current = _view;
    }

    // STEP 2 - render my tokens as soon as we get them
    // STEP 3 - render all other tokens as soon we get them
    if (myTokens !== null && allTokens !== null) {
      const simpleFillSymbolOrange = simpleFillSymbol(COLORS.occupiedLand);
      const simpleFillSymbolGreen = new PolygonSymbol3D({
        symbolLayers: [
          {
            type: "fill",
            material: { color: COLORS.myLand },
          },
        ],
      });

      // first draw myTokens in green, then allTokens in orange
      for (const tokens of NETWORK_DATA.SOLDOUT ? [myTokens] : [myTokens, allTokens]) {
        for (const token of Array.from(tokens)) {
          const { x, y } = parseTokenNumber(token) ?? {};
          if (x !== undefined && y !== undefined && y >= 0 && y < 140) {
            const latitudes: [number, number] = [toLat(y), toLat(y + 1)];
            const longitudes: [number, number] = [toLong(x), toLong(x + 1)];

            const polygon = {
              type: "polygon",
              rings: [
                [longitudes[0], latitudes[0]],
                [longitudes[0], latitudes[1]],
                [longitudes[1], latitudes[1]],
                [longitudes[1], latitudes[0]],
              ],
              spatialReference: { wkid: 104971 },
            };

            const polygonGraphic = new Graphic({
              // @ts-expect-error some ts error again
              geometry: polygon,
              symbol: myTokens.includes(token)
                ? simpleFillSymbolGreen
                : simpleFillSymbolOrange,
            });
            tokensLayer.current?.add(polygonGraphic);
          }
        }
      }
    }
  }, [allTokens, myTokens, tokensLayer]);

  const isMyToken =
    tooltipData?.token && myTokens?.includes(tooltipData.token.toString());

  const isAvailable =
    tooltipData?.token && !allTokens?.includes(tooltipData.token.toString());

  const isEnoughBalance = balanceInWei >= parseEther("0.009");

  const handleClaimToken = () => {
    if (!tooltipData?.token) return;

    handleClaim(tooltipData.token, {
      onSuccess: () => {
        setIsTooltipOpen(false);
      },
    });
  };

  return (
    <div className="contrast-[1.1] hue-rotate-[325deg] saturate-[1.7] filter">
      <div id="viewDiv" ref={refs.setReference} />
      {/* Tooltip
      {isTooltipOpen && tooltipData && (
        <div
          id="floating-tooltip"
          className="relative rounded-lg bg-black/75 p-4 text-white backdrop-blur-xs"
          ref={refs.setFloating}
          style={floatingStyles}
        >
          <FloatingArrow ref={arrowRef} context={context} fill={COLORS.tooltipBackground} />

          <button
            className="absolute top-0 right-0 cursor-pointer p-4"
            onClick={() => setIsTooltipOpen(false)}
          >
            <svg
              className="size-4 text-zinc-400"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>

          <div className="flex flex-col gap-4">
            <div className="text-lg leading-none font-bold">
              Land plot #{tooltipData.token}
            </div>

            <div className="flex gap-6">
              <img
                src={generateBlockie(tooltipData.token).toDataURL()}
                className="h-40 w-40"
              />

              <div className="flex flex-col justify-between gap-4">
                <div className="grid grid-cols-2 gap-x-6 gap-y-2 font-medium">
                  <div>
                    <div className="text-sm font-normal text-zinc-400">Longitudes</div>
                    {tooltipData.longitudes[0].toFixed(2)} ..{" "}
                    {tooltipData.longitudes[1].toFixed(2)}
                  </div>
                  <div>
                    <div className="text-sm font-normal text-zinc-400">Latitudes</div>
                    {tooltipData.latitudes[0].toFixed(2)} ..{" "}
                    {tooltipData.latitudes[1].toFixed(2)}
                  </div>

                  <div>
                    <div className="text-sm font-normal text-zinc-400">Status</div>
                    {isAvailable && !isMyToken && "Available"}
                    {isMyToken && "Your land"}
                    {!isAvailable && !isMyToken && "Occupied"}
                  </div>
                </div>

                <div>
                  {isAvailable && !isMyToken && (
                    <button
                      className={cn(
                        "bg-primary w-full cursor-pointer rounded-md px-4 py-2 font-bold uppercase",
                        !isEnoughBalance &&
                          "cursor-not-allowed bg-white/10 text-sm !text-white/50",
                      )}
                      disabled={!isEnoughBalance}
                      onClick={handleClaimToken}
                    >
                      {isEnoughBalance ? "Claim for 0.009 ETH" : "Insufficient balance"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
};
