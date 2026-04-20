import { access, readFile } from "node:fs/promises";
import path from "node:path";

const REQUIRED_SECTIONS = [
  "## Metadata",
  "## Objective",
  "## Primary Doctrine Under Test",
  "## Working Defaults Used",
  "## Scenario",
  "## Implementation Posture",
  "## Expected Outcomes",
  "## Observations",
  "## Doctrine Pressure Exposed",
  "## Decision / Defer / Open Question",
  "## Follow-Up",
] as const;

const PRIORITIES = new Set(["now", "next", "later"]);
const STATUSES = new Set(["planned", "active", "completed", "blocked", "deferred"]);
const BOUNDARIES = new Set(["doc-only", "code-only", "doc-plus-code"]);
const PHASES = new Set([2, 3, 4]);

interface LabEntry {
  id: string;
  title: string;
  slug: string;
  priority: string;
  phase: number;
  status: string;
  implementationBoundary: string;
  path: string;
}

interface Registry {
  phaseCount: number;
  labs: LabEntry[];
}

async function main() {
  const repoRoot = process.cwd();
  const registryPath = path.join(repoRoot, "labs", "registry.json");
  const rawRegistry = await readFile(registryPath, "utf8");
  const registry = JSON.parse(rawRegistry) as Registry;

  const failures: string[] = [];

  if (registry.phaseCount !== 4) {
    failures.push(`expected phaseCount 4, got ${registry.phaseCount}`);
  }

  if (registry.labs.length !== 10) {
    failures.push(`expected 10 labs in registry, got ${registry.labs.length}`);
  }

  const seenIds = new Set<string>();
  const seenSlugs = new Set<string>();

  for (const lab of registry.labs) {
    validateRegistryEntry(lab, failures, seenIds, seenSlugs);
    await validateLabFile(repoRoot, lab, failures);
  }

  if (failures.length > 0) {
    console.error("Lab scaffold validation failed:");
    for (const failure of failures) {
      console.error(`- ${failure}`);
    }
    process.exitCode = 1;
    return;
  }

  console.log(
    `Lab scaffold valid: ${registry.labs.length} labs across phases 2-${registry.phaseCount}.`,
  );
}

function validateRegistryEntry(
  lab: LabEntry,
  failures: string[],
  seenIds: Set<string>,
  seenSlugs: Set<string>,
) {
  if (seenIds.has(lab.id)) {
    failures.push(`duplicate lab id: ${lab.id}`);
  }
  seenIds.add(lab.id);

  if (seenSlugs.has(lab.slug)) {
    failures.push(`duplicate lab slug: ${lab.slug}`);
  }
  seenSlugs.add(lab.slug);

  if (!PRIORITIES.has(lab.priority)) {
    failures.push(`invalid priority for ${lab.id}: ${lab.priority}`);
  }
  if (!STATUSES.has(lab.status)) {
    failures.push(`invalid status for ${lab.id}: ${lab.status}`);
  }
  if (!BOUNDARIES.has(lab.implementationBoundary)) {
    failures.push(
      `invalid implementation boundary for ${lab.id}: ${lab.implementationBoundary}`,
    );
  }
  if (!PHASES.has(lab.phase)) {
    failures.push(`invalid phase for ${lab.id}: ${lab.phase}`);
  }
  if (!lab.path.startsWith("labs/")) {
    failures.push(`lab path must stay under labs/: ${lab.id} -> ${lab.path}`);
  }
}

async function validateLabFile(repoRoot: string, lab: LabEntry, failures: string[]) {
  const filePath = path.join(repoRoot, lab.path);
  try {
    await access(filePath);
  } catch {
    failures.push(`missing lab file for ${lab.id}: ${lab.path}`);
    return;
  }

  const content = await readFile(filePath, "utf8");
  const firstLine = content.split("\n", 1)[0]?.trim();
  if (firstLine !== `# ${lab.title}`) {
    failures.push(`title mismatch for ${lab.id}: expected "# ${lab.title}"`);
  }

  for (const section of REQUIRED_SECTIONS) {
    if (!content.includes(section)) {
      failures.push(`missing section in ${lab.id}: ${section}`);
    }
  }

  if (!content.includes(`- id: \`${lab.id}\``)) {
    failures.push(`metadata id missing or mismatched in ${lab.id}`);
  }
  if (!content.includes(`- priority: \`${lab.priority}\``)) {
    failures.push(`metadata priority missing or mismatched in ${lab.id}`);
  }
  if (!content.includes(`- phase: \`${lab.phase}\``)) {
    failures.push(`metadata phase missing or mismatched in ${lab.id}`);
  }
  if (!content.includes(`- status: \`${lab.status}\``)) {
    failures.push(`metadata status missing or mismatched in ${lab.id}`);
  }
  if (!content.includes(`- implementation-boundary: \`${lab.implementationBoundary}\``)) {
    failures.push(`metadata implementation boundary missing or mismatched in ${lab.id}`);
  }
}

await main();
