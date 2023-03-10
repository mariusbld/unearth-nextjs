import React, { useState } from "react";
import Head from "next/head";
import Image from "next/image";
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
  const [radius, setRadius] = useState(1000);
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
      <div className="font-bold">
        <DeckGL
          initialViewState={INITIAL_VIEW_STATE}
          controller={true}
          layers={layers}
        >
          <Map
            mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
            mapStyle="mapbox://styles/mapbox/light-v11"
          />
          <div className="absolute bg-white text-black min-h-[200px] h-auto w-[450px] top-0 left-0 bottom-0 rounded-sm p-4">
            <div className="flex flex-col">
              <Image
                className="mb-4"
                priority
                src="/images/joe-homebuyer-logo.png"
                height={144}
                width={84}
                alt=""
              />
              <h2 className="font-bold text-xl mb-2">Layer Control</h2>
              <input
                name="radius"
                className="w-fit py-2"
                type="range"
                value={radius}
                min={500}
                step={50}
                max={10000}
              />
              <label htmlFor="radius">
                Median Home Value -{" "}
                <span className="bg-indigo-500 font-bold text-white px-2 py-1 rounded-lg">
                  ${radius}
                </span>{" "}
              </label>
            </div>
          </div>
        </DeckGL>
      </div>
    </>
  );
}
