import PolygonSymbol3D from "@arcgis/core/symbols/PolygonSymbol3D";

const toRad = (phi: number): number => (phi * Math.PI) / 180;
const toDeg = (phi: number): number => (phi / Math.PI) * 180;

const cos = (value: number): number => Math.cos(toRad(value));
const acos = (value: number): number => toDeg(Math.acos(value));

export const toLongPart = (val: number): number => {
  return val % 150;
};

export const toLatPart = (val: number): number => {
  return Math.floor(val / 150);
};

export const toLong = (val: number): number => {
  return ((val - 150 / 2) / 150) * 360;
};

export const fromLong = (longitude: number): number => {
  return Math.floor((longitude / 360) * 150 + 150 / 2);
};

export const toLat = (val: number): number => {
  if (val === 70) {
    return 0;
  }
  if (val < 70) {
    return 90 - acos(cos(90) + ((70 - val) * (cos(10) - cos(90))) / 70); // > 0
  }
  if (val > 70) {
    return -toLat(140 - val); // < 0
  }
  return 0; // for ts
};

export const fromLat = (latitude: number): number | null => {
  let result: number | null = null;
  if (latitude >= 0) {
    result = Math.floor(70 - ((cos(90 - latitude) - cos(90)) * 70) / (cos(10) - cos(90)));
  }
  if (latitude < 0) {
    result = Math.floor(139 - (fromLat(-latitude) ?? 0));
  }
  if (result !== null && result >= 0 && result < 140) {
    return result;
  } else {
    return null;
  }
};

export const toTokenNumber = (lat: number, long: number): number | null => {
  const y = fromLat(lat);
  if (y !== null) {
    return y * 150 + fromLong(long) + 1;
  } else {
    return null;
  }
};

export const parseTokenNumber = (
  tokenNumber: number | string | null,
): { x: number; y: number } | null => {
  if (tokenNumber === null) {
    return null;
  }
  const y = toLatPart(+tokenNumber - 1);
  const x = toLongPart(+tokenNumber - 1);
  return { x, y };
};

export const simpleFillSymbol = (color: [number, number, number, number]) =>
  new PolygonSymbol3D({
    symbolLayers: [
      {
        type: "fill",
        material: { color },
      },
    ],
  });

export const formatWallet = (address: string): string => {
  return address.substr(0, 6) + "..." + address.substr(address.length - 6);
};

function fallbackCopyTextToClipboard(text: string) {
  const textArea = document.createElement("textarea");
  textArea.value = text;

  // Avoid scrolling to bottom
  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.position = "fixed";

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    const successful = document.execCommand("copy");
    const msg = successful ? "successful" : "unsuccessful";
  } catch (err) {}

  document.body.removeChild(textArea);
}

export async function copyTextToClipboard(text: string): Promise<void> {
  if (!navigator.clipboard) {
    fallbackCopyTextToClipboard(text);
    return;
  }
  return navigator.clipboard.writeText(text);
}

import Graphic from "@arcgis/core/Graphic";
import ElevationLayer from "@arcgis/core/layers/ElevationLayer";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import TileLayer from "@arcgis/core/layers/TileLayer";
import Map from "@arcgis/core/Map";
import SceneView from "@arcgis/core/views/SceneView";
import React from "react";

const polylineSymbol = {
  type: "simple-line",
  color: [0, 0, 0],
  width: 0.5,
};

export const initView = (
  tokenRef: React.MutableRefObject<string | null>,
  setCurToken: React.Dispatch<React.SetStateAction<string | null>>,
): {
  tokenLayer: GraphicsLayer;
  hoverLayer: GraphicsLayer;
  view: SceneView;
} => {
  const tokenLayer = new GraphicsLayer();
  const hoverLayer = new GraphicsLayer();
  const gridLayer = new GraphicsLayer();

  if (localStorage.getItem("land_disabled")) {
    return {
      tokenLayer,
      hoverLayer,
      view: new SceneView(),
    };
  }

  const marsImagery = new TileLayer({
    url: "https://astro.arcgis.com/arcgis/rest/services/OnMars/MDIM/MapServer",
    title: "Imagery",
    copyright: "USGS Astrogeology Science Center, NASA, JPL, Esri",
  });

  const marsElevation = new ElevationLayer({
    url: "https://astro.arcgis.com/arcgis/rest/services/OnMars/MDEM200M/ImageServer",
    copyright:
      "NASA, ESA, HRSC, Goddard Space Flight Center, USGS Astrogeology Science Center, Esri",
  });

  const cratersLayer = new FeatureLayer({
    url: "https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/Mars_Nomenclature_Mountains/FeatureServer",
    definitionExpression: "type = 'Crater, craters'",
    title: "Craters",
    renderer: {
      // @ts-ignore
      type: "simple",
      symbol: {
        type: "polygon-3d",
        symbolLayers: [
          {
            type: "fill",
            material: { color: [255, 255, 255, 0.1] },
            outline: {
              color: [0, 0, 0, 0.4],
              size: 2,
            },
          },
        ],
      },
    },
    labelingInfo: [
      {
        labelPlacement: "above-center",
        labelExpressionInfo: { expression: "$feature.NAME" },
        symbol: {
          type: "label-3d",
          symbolLayers: [
            {
              // @ts-ignore
              type: "text",
              material: {
                color: [255, 255, 255, 0.9],
              },
              halo: {
                size: 0.5,
                color: [0, 0, 0, 0.7],
              },
              font: {
                size: 8,
              },
            },
          ],
          verticalOffset: {
            screenLength: 40,
            maxWorldLength: 500000,
            minWorldLength: 0,
          },
          callout: {
            type: "line",
            size: 0.5,
            color: [255, 255, 255, 0.9],
            border: {
              color: [0, 0, 0, 0.3],
            },
          },
        },
      },
    ],
  });

  for (let x = 0; x < 150; x++) {
    const long = toLong(x);
    const polyline = {
      type: "polyline",
      paths: [
        [long, toLat(0)],
        [long, -toLat(0)],
      ],
      spatialReference: { wkid: 104971 },
    };
    const polygonGraphic = new Graphic({
      geometry: polyline,
      symbol: polylineSymbol,
    });
    gridLayer.add(polygonGraphic);
  }

  for (let y = 0; y <= 140; y++) {
    const lat = toLat(y);
    const polyline = {
      type: "polyline",
      paths: [
        [toLong(0), lat],
        [-toLong(0), lat],
      ],
      spatialReference: { wkid: 104971 },
    };
    const polygonGraphic = new Graphic({
      geometry: polyline,
      symbol: polylineSymbol,
    });
    gridLayer.add(polygonGraphic);
  }

  const map = new Map({
    ground: { layers: [marsElevation] },
    layers: [marsImagery, gridLayer],
  });

  map.add(tokenLayer);
  map.add(hoverLayer);
  map.add(cratersLayer);

  const view = new SceneView({
    map: map,
    container: "viewDiv",
    qualityProfile: "high",
    spatialReference: { wkid: 104971 },
    camera: {
      position: {
        x: -51,
        y: -29.6,
        z: 6000000,
        spatialReference: { wkid: 104971 },
      },
      heading: 350,
      tilt: 12.3,
    },
    environment: {
      lighting: {
        directShadowsEnabled: false,
        ambientOcclusionEnabled: false,
        // cameraTrackingEnabled: false,
      },
    },
  });
  // @ts-ignore
  window.view = view;
  view.on("pointer-move", (evt) => {
    const point = view.toMap({ x: evt.x, y: evt.y }) ?? {};

    const { latitude, longitude } = point;

    const token = toTokenNumber(latitude, longitude);
    setCurToken(token === null ? null : token.toString());
    tokenRef.current = token === null ? null : token.toString();
  });

  return {
    tokenLayer,
    hoverLayer,
    view,
  };
};
