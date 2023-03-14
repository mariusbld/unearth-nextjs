import type { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import { promises as fs } from "fs";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const dataDir = path.join(process.cwd(), "data");
  const fileContents = await fs.readFile(
    dataDir + "/joe_home_us_value.geojson",
    "utf8"
  );
  const geoJson = JSON.parse(fileContents);
  res.status(200).json(geoJson);
}

export const config = {
  api: {
    responseLimit: false,
  },
};
