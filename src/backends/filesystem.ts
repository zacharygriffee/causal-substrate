import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import { Substrate } from "../kernel/substrate.js";
import { SubstrateSnapshot } from "../kernel/types.js";

export async function writeSubstrateSnapshot(substrate: Substrate, filePath: string) {
  const directory = path.dirname(filePath);
  await mkdir(directory, { recursive: true });
  const snapshot = substrate.snapshot();
  await writeFile(filePath, JSON.stringify(snapshot, null, 2), "utf8");
  return snapshot;
}

export async function readSubstrateSnapshot(filePath: string) {
  const raw = await readFile(filePath, "utf8");
  return JSON.parse(raw) as SubstrateSnapshot;
}

export async function loadSubstrateFromSnapshot(filePath: string) {
  const snapshot = await readSubstrateSnapshot(filePath);
  return Substrate.fromSnapshot(snapshot);
}
