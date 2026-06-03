import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

test("causal public observer lifecycle stays below swarm proof", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "causal-public-observer-lifecycle-"));
  try {
    const descriptorPath = path.join(root, "layer-descriptor.json");
    const statePath = path.join(root, "observer-state.json");
    const statusPath = path.join(root, "observer-status.json");
    const stoppedPath = path.join(root, "observer-stopped.json");
    await writeFile(descriptorPath, JSON.stringify({ descriptor: "layer-public-participant" }), "utf8");

    await execFileAsync("npx", [
      "tsx",
      "scripts/causal-public-observer.ts",
      "up",
      "--layer-descriptor",
      descriptorPath,
      "--state-output",
      statePath,
      "--emitted-at",
      "2026-06-03T20:00:00.000Z",
    ]);
    await execFileAsync("npx", [
      "tsx",
      "scripts/causal-public-observer.ts",
      "status",
      "--state",
      statePath,
      "--status-output",
      statusPath,
      "--emitted-at",
      "2026-06-03T20:01:00.000Z",
    ]);
    await execFileAsync("npx", [
      "tsx",
      "scripts/causal-public-observer.ts",
      "down",
      "--state",
      statePath,
      "--status-output",
      stoppedPath,
      "--emitted-at",
      "2026-06-03T20:02:00.000Z",
    ]);

    const state = JSON.parse(await readFile(statePath, "utf8"));
    const status = JSON.parse(await readFile(statusPath, "utf8"));
    const stopped = JSON.parse(await readFile(stoppedPath, "utf8"));

    assert.equal(state.artifactKind, "causal-public-observer-lifecycle-state");
    assert.equal(state.observerStatus, "ready_for_public_swarm_observe");
    assert.equal(state.operationProofRung, "local_artifact_seam");
    assert.equal(state.higherRungPressure, "durable_replicated_public_swarm_seam");
    assert.equal(state.proofGate.lifecycleStateDoesNotClaimSwarmProof, true);
    assert.equal(state.boundary.writesEdgeState, false);
    assert.equal(state.boundary.writesLayerState, false);
    assert.equal(state.boundary.admitsLayerEvidence, false);
    assert.equal(state.boundary.interpretsRbc, false);
    assert.equal(state.descriptorRefs[0].role, "layer_descriptor");
    assert.match(state.descriptorRefs[0].sha256, /^[0-9a-f]{64}$/);

    assert.equal(status.publicSwarmProofClaimedNow, false);
    assert.equal(status.operationProofRung, "local_artifact_seam");
    assert.equal(status.observedState.observerStatus, "ready_for_public_swarm_observe");
    assert.equal(stopped.observerStatus, "stopped");
    assert.equal(stopped.nextPressure, "public_observer_stopped_no_swarm_claim");
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("causal public observer observe emits instructions until real public swarm is enabled", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "causal-public-observer-instructions-"));
  try {
    const instructionsPath = path.join(root, "instructions.json");
    await execFileAsync("npx", [
      "tsx",
      "scripts/causal-public-observer.ts",
      "observe",
      "--instructions-output",
      instructionsPath,
      "--emitted-at",
      "2026-06-03T20:03:00.000Z",
    ]);

    const instructions = JSON.parse(await readFile(instructionsPath, "utf8"));
    assert.equal(instructions.artifactKind, "causal-public-observer-instructions");
    assert.equal(instructions.instructionsOnly, true);
    assert.equal(instructions.publicSwarmProofClaimedNow, false);
    assert.equal(instructions.operationProofRung, "local_artifact_seam");
    assert.match(instructions.commands.observe, /CAUSAL_SUBSTRATE_REAL_HYPERSWARM=1/);
    assert.equal(instructions.boundary.writesEdgeState, false);
    assert.equal(instructions.boundary.writesLayerState, false);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("causal public observer rejects configured bootstrap for public proof", async () => {
  const { stderr } = await execFileAsync("npx", [
    "tsx",
    "scripts/causal-public-observer.ts",
    "observe",
    "--manifest",
    "missing-manifest.json",
    "--report-output",
    "unused-report.json",
    "--storage-dir",
    "unused-storage",
  ], {
    env: {
      ...process.env,
      CAUSAL_SUBSTRATE_REAL_HYPERSWARM: "1",
      CAUSAL_SUBSTRATE_HYPERSWARM_PUBLIC: "1",
      CAUSAL_SUBSTRATE_HYPERSWARM_BOOTSTRAP: "127.0.0.1:12345",
    },
  }).then(
    () => {
      throw new Error("expected configured bootstrap rejection");
    },
    (error: { stderr?: string }) => ({ stderr: error.stderr ?? "" }),
  );

  assert.match(stderr, /configured_bootstrap_deferred_for_causal_public_observer/);
});

test("causal public observer preflights descriptor-only live observe without claiming swarm proof", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "causal-public-observer-preflight-"));
  try {
    const layerDescriptor = path.join(root, "layer-public-endpoint.json");
    const reportPath = path.join(root, "preflight-report.json");
    await writeFile(
      layerDescriptor,
      JSON.stringify({
        artifactKind: "layer_owned_edge_seam_public_endpoint_projection",
        proofBoundary: {
          publicSwarmProof: true,
        },
      }),
      "utf8",
    );

    await execFileAsync("npx", [
      "tsx",
      "scripts/causal-public-observer.ts",
      "observe",
      "--layer-descriptor",
      layerDescriptor,
      "--report-output",
      reportPath,
      "--emitted-at",
      "2026-06-03T20:04:00.000Z",
    ], {
      env: {
        ...process.env,
        CAUSAL_SUBSTRATE_REAL_HYPERSWARM: "1",
        CAUSAL_SUBSTRATE_HYPERSWARM_PUBLIC: "1",
        CAUSAL_SUBSTRATE_HYPERSWARM_BOOTSTRAP: "",
      },
    });

    const report = JSON.parse(await readFile(reportPath, "utf8"));
    assert.equal(report.artifactKind, "causal-public-observer-descriptor-preflight-report");
    assert.equal(report.operationProofRung, "local_artifact_seam");
    assert.equal(report.status, "blocked_waiting_for_causal_observable_source_manifest");
    assert.equal(report.publicSwarmProofClaimedNow, false);
    assert.equal(report.opensSwarmNow, false);
    assert.equal(report.opensCorestoreNow, false);
    assert.equal(report.descriptorRefs[0].role, "layer_descriptor");
    assert.match(report.descriptorRefs[0].sha256, /^[0-9a-f]{64}$/);
    assert.ok(report.unresolvedFindings.includes("observe_requires_causal_observable_source_manifest_before_swarm_can_open"));
    assert.ok(report.overclaimFindings.includes("retained_endpoint_or_descriptor_material_is_not_live_causal_public_swarm_observation"));
    assert.equal(report.boundary.admitsLayerEvidence, false);
    assert.equal(report.boundary.grantsAuthority, false);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("causal public observer rejects non-Causal source manifests before opening swarm", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "causal-public-observer-wrong-manifest-"));
  try {
    const manifestPath = path.join(root, "layer-manifest.json");
    const reportPath = path.join(root, "preflight-report.json");
    await writeFile(
      manifestPath,
      JSON.stringify({
        artifactKind: "layer_owned_edge_seam_readback_manifest",
        schema: "layer-owned-edge-seam-readback-manifest.v0",
        publicEndpoint: {
          proofBoundary: {
            publicSwarmProof: true,
          },
        },
      }),
      "utf8",
    );

    await execFileAsync("npx", [
      "tsx",
      "scripts/causal-public-observer.ts",
      "observe",
      "--manifest",
      manifestPath,
      "--report-output",
      reportPath,
      "--storage-dir",
      path.join(root, "storage"),
      "--emitted-at",
      "2026-06-03T20:05:00.000Z",
    ], {
      env: {
        ...process.env,
        CAUSAL_SUBSTRATE_REAL_HYPERSWARM: "1",
        CAUSAL_SUBSTRATE_HYPERSWARM_PUBLIC: "1",
        CAUSAL_SUBSTRATE_HYPERSWARM_BOOTSTRAP: "",
      },
    });

    const report = JSON.parse(await readFile(reportPath, "utf8"));
    assert.equal(report.status, "blocked_waiting_for_causal_observable_source_manifest");
    assert.equal(report.publicSwarmProofClaimedNow, false);
    assert.equal(report.opensSwarmNow, false);
    assert.equal(report.manifestRef.role, "source_manifest");
    assert.ok(report.unresolvedFindings.includes("source_manifest_artifact_kind_mismatch"));
    assert.ok(report.unresolvedFindings.includes("source_manifest_schema_mismatch"));
    assert.ok(report.unresolvedFindings.includes("source_manifest_source_missing"));
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
