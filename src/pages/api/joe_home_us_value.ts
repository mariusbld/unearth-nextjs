import type { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import { promises as fs } from "fs";
import { Storage } from "@google-cloud/storage";

const storage = new Storage();

// gs://geo-files/joe_home_us_value.geojson
const bucket = storage.bucket("geo-files");
const fileName = "joe_home_us_value.geojson";

async function readFromGs(path: string) {
  const file = bucket.file(path);
  const [exists] = await file.exists();
  if (!exists) {
    throw new Error("File does not exist");
  }
  const [data] = await file.download();
  return JSON.parse(data.toString());
}

async function readFromFs(filePath: string) {
  const dataDir = path.join(process.cwd(), "data");
  const fileContents = await fs.readFile(dataDir + "/" + filePath, "utf8");
  const geoJson = JSON.parse(fileContents);
  return geoJson;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const geoJson = await readFromGs(fileName);
  res.status(200).json(geoJson);
}

export const config = {
  api: {
    responseLimit: false,
  },
};
