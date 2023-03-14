import MultiRangeSlider from "@/components/ui/MultiRangeSlider";
import { PickingInfo } from "@deck.gl/core/typed";
import { GeoJsonLayer } from "@deck.gl/layers/typed";
import DeckGL from "@deck.gl/react/typed";
import Head from "next/head";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import Map from "react-map-gl";
import useSWR from "swr";
import { currencyFormatter } from "@/utils/format";
import SelectMenu from "@/components/ui/SelectMenu";
import { EyeIcon } from "@heroicons/react/24/outline";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const INITIAL_VIEW_STATE = {
  longitude: -96.93821288851717,
  latitude: 36.49104884499897,
  zoom: 4,
  pitch: 0,
  bearing: 0,
};

interface range {
  min: number;
  max: number;
}

export default function Home() {
  const { data, error } = useSWR("/api/joe_home_us_value", fetcher);
  const [dataRange, setDataRange] = useState<range>({ min: 0, max: 100 });
  const [selectedRange, setSelectedRange] = useState<range>({
    min: 0,
    max: 100,
  });

  useEffect(() => {
    if (data) {
      const min = Math.min(
        ...data.features.map((f: any) => f.properties.home_value)
      );
      const max = Math.max(
        ...data.features.map((f: any) => f.properties.home_value)
      );
      setDataRange({ min, max });
    }
  }, [data]);

  const selectedFeatures = useMemo(() => {
    if (!data) return [];
    return data.features.filter(
      (f: any) =>
        f.properties.home_value >= selectedRange.min &&
        f.properties.home_value <= selectedRange.max
    );
  }, [data, selectedRange]);

  const [hoverInfo, setHoverInfo] = useState<PickingInfo>();

  // if (error) return <div>failed to load</div>;
  // if (!geoData) return <div>loading...</div>;

  const layers = [
    new GeoJsonLayer({
      id: "geojson-layer",
      data: selectedFeatures,
      pickable: true,
      stroked: true,
      filled: true,
      extruded: false,
      pointType: "circle",
      lineWidthScale: 1,
      lineWidthMinPixels: 1,
      getFillColor: (d) => {
        if (!d.properties) return [0, 0, 0];
        const val = (d.properties.home_value / 700_000) * 255;
        const inverse = 255 - val;
        return [255, inverse, inverse];
      },
      getLineColor: [255, 200, 140],
      getPointRadius: 100,
      getLineWidth: 1,
      getElevation: 30,
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
        {hoverInfo && hoverInfo.object && (
          <div
            style={{
              position: "absolute",
              zIndex: 1,
              pointerEvents: "none",
              left: hoverInfo.x + 8 + 360,
              top: hoverInfo.y + 8,
            }}
          >
            <div className="w-48 h-20 bg-gray-50 pl-4 pt-4 rounded-md drop-shadow-md text-sm">
              <p className="pb-2">
                <span className="pr-1 font-bold">County:</span>
                {hoverInfo.object.properties.NAME}
              </p>
              <p>
                <span className="pr-1 font-bold">Home Value:</span>
                {currencyFormatter.format(
                  Number.parseFloat(hoverInfo.object.properties.home_value)
                )}
              </p>
            </div>
          </div>
        )}
        <div className="absolute bg-white text-gray-700 min-h-[200px] h-auto w-[360px] top-0 left-0 bottom-0 rounded-sm p-8 z-10 drop-shadow-md">
          <div className="flex flex-col">
            <Image
              className="mb-4"
              priority
              src="/images/joe-homebuyer-logo.png"
              height={144}
              width={84}
              alt=""
            />
            <h2 className="font-bold text-xl my-4">Layer Control</h2>
            <div className="mb-2">
              Data
              <div className="ml-3 text-sm leading-6">
                <span className="font-medium text-gray-900">
                  Median Home Value
                </span>
              </div>
            </div>
            <div className="mb-2">
              Teritory
              <div className="ml-3 text-sm leading-6">
                <SelectMenu />
              </div>
            </div>
            <h2 className="font-bold text-xl my-4 mt-8">Define Criteria</h2>
            <div className="mb-1">Median Home Value</div>
            <MultiRangeSlider
              min={dataRange.min}
              max={dataRange.max}
              onChange={setSelectedRange}
            />
          </div>
        </div>
        <DeckGL
          style={{ left: "360px" }}
          width={"calc(100vw - 360px)"}
          initialViewState={INITIAL_VIEW_STATE}
          controller={true}
          layers={layers}
          onHover={(info) => setHoverInfo(info)}
        >
          <Map
            mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
            mapStyle="mapbox://styles/mapbox/light-v11"
          />
        </DeckGL>
      </div>
    </>
  );
}
