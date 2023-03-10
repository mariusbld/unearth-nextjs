import React from "react";
import Head from "next/head";
import Map from "react-map-gl";
import DeckGL from "@deck.gl/react/typed";
import { LineLayer } from "@deck.gl/layers/typed";

// Viewport settings
const INITIAL_VIEW_STATE = {
  longitude: -122.41669,
  latitude: 37.7853,
  zoom: 13,
  pitch: 0,
  bearing: 0,
};

// Data to be used by the LineLayer
const data = [
  {
    sourcePosition: [-122.41669, 37.7853],
    targetPosition: [-122.41669, 37.781],
  },
];

export default function Home() {
  const layers = [
    new LineLayer({
      id: "line-layer",
      data,
      getWidth: 5,
      getColor: [255, 0, 0],
    }),
  ];

  return (
    <>
      <Head>
        <title>Unearth</title>
        <meta name="description" content="Unearth GIS Analytics" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <DeckGL
          initialViewState={INITIAL_VIEW_STATE}
          controller={true}
          layers={layers}
        >
          <Map
            mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
            mapStyle="mapbox://styles/mapbox/dark-v9"
          />
        </DeckGL>
      </div>
    </>
  );
}
