import path from "node:path";

import Corestore from "corestore";

import { DEFAULT_CORESTORE_LAYOUT, PlannedCoreLayout, PlannedCoreName } from "./corestore-layout.js";

type CorestoreInstance = any;
type HypercoreInstance = any;

interface ManagedRootEntry {
  refs: number;
  store: CorestoreInstance;
  storageDir: string;
}

export interface ManagedCorestoreLease {
  storageDir: string;
  store: CorestoreInstance;
  close: () => Promise<void>;
}

export interface OpenConcernOptions {
  storageDir: string;
  concern: string;
  namespaceParts?: string[] | undefined;
  layout?: PlannedCoreLayout[] | undefined;
}

export interface OpenConcernHandle {
  storageDir: string;
  concern: string;
  namespaceParts: string[];
  lease: ManagedCorestoreLease;
  session: CorestoreInstance;
  cores: Record<PlannedCoreName, HypercoreInstance>;
  close: () => Promise<void>;
}

const roots = new Map<string, ManagedRootEntry>();
const openings = new Map<string, Promise<ManagedRootEntry>>();

export function buildDeterministicNamespace(
  concern: string,
  namespaceParts: string[] = [],
): string[] {
  return ["causal-substrate", "v1", concern, ...namespaceParts];
}

export function activeManagedCorestoreCount() {
  return roots.size;
}

export function getManagedCorestoreRefCount(storageDir: string) {
  const resolved = path.resolve(storageDir);
  return roots.get(resolved)?.refs ?? 0;
}

export async function acquireManagedCorestore(storageDir: string): Promise<ManagedCorestoreLease> {
  const resolved = path.resolve(storageDir);
  const root = await getOrOpenRoot(resolved);
  root.refs += 1;

  let closed = false;

  return {
    storageDir: resolved,
    store: root.store,
    close: async () => {
      if (closed) return;
      closed = true;
      await releaseManagedCorestore(resolved);
    },
  };
}

export async function openConcernCores(
  options: OpenConcernOptions,
): Promise<OpenConcernHandle> {
  const lease = await acquireManagedCorestore(options.storageDir);
  const namespaceParts = buildDeterministicNamespace(
    options.concern,
    options.namespaceParts ?? [],
  );
  const session = namespaceStore(lease.store, namespaceParts);
  const layout = options.layout ?? DEFAULT_CORESTORE_LAYOUT;

  const cores = {} as Record<PlannedCoreName, HypercoreInstance>;

  try {
    for (const entry of layout) {
      const core = session.get({ name: entry.name, valueEncoding: "json" });
      await core.ready();
      cores[entry.name] = core;
    }
  } catch (error) {
    await safeCloseSession(session);
    await lease.close();
    throw error;
  }

  let closed = false;

  return {
    storageDir: lease.storageDir,
    concern: options.concern,
    namespaceParts,
    lease,
    session,
    cores,
    close: async () => {
      if (closed) return;
      closed = true;
      await safeCloseSession(session);
      await lease.close();
    },
  };
}

export async function appendConcernRecord(
  handle: OpenConcernHandle,
  coreName: PlannedCoreName,
  record: unknown,
) {
  const core = handle.cores[coreName];
  if (!core) {
    throw new Error(`unknown concern core: ${coreName}`);
  }
  await core.append(record);
  return core.length;
}

export async function readConcernRecords(
  handle: OpenConcernHandle,
  coreName: PlannedCoreName,
) {
  const core = handle.cores[coreName];
  if (!core) {
    throw new Error(`unknown concern core: ${coreName}`);
  }

  const records = [];
  for (let i = 0; i < core.length; i += 1) {
    records.push(await core.get(i));
  }
  return records;
}

async function getOrOpenRoot(storageDir: string) {
  const existing = roots.get(storageDir);
  if (existing) {
    return existing;
  }

  const opening = openings.get(storageDir);
  if (opening) {
    return opening;
  }

  const promise = openRoot(storageDir);
  openings.set(storageDir, promise);

  try {
    const root = await promise;
    roots.set(storageDir, root);
    return root;
  } finally {
    openings.delete(storageDir);
  }
}

async function openRoot(storageDir: string): Promise<ManagedRootEntry> {
  const store = new Corestore(storageDir);
  await store.ready();

  return {
    refs: 0,
    store,
    storageDir,
  };
}

async function releaseManagedCorestore(storageDir: string) {
  const root = roots.get(storageDir);
  if (!root) return;

  root.refs -= 1;

  if (root.refs > 0) {
    return;
  }

  roots.delete(storageDir);
  await root.store.close();
}

function namespaceStore(store: CorestoreInstance, namespaceParts: string[]) {
  return namespaceParts.reduce((session, part) => session.namespace(part), store);
}

async function safeCloseSession(session: CorestoreInstance) {
  try {
    await session.close();
  } catch {
    // Closing is best-effort here; the root lease will still be released.
  }
}
