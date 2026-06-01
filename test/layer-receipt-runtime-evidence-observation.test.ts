import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { promisify } from "node:util";

import {
  assertLayerReceiptRuntimeEvidenceObservation,
  assertLayerReceiptRuntimeEvidenceReadbackContract,
  buildLayerReceiptRuntimeEvidenceObservation,
  buildLayerReceiptRuntimeEvidenceReadbackContract,
  buildLayerReceiptRuntimeEvidenceSourceRefCompleteness,
  CAUSAL_LAYER_RECEIPT_RUNTIME_EVIDENCE_OBSERVATION_ARTIFACT_KIND,
  CAUSAL_LAYER_RECEIPT_RUNTIME_EVIDENCE_OBSERVATION_SCHEMA,
} from "../src/index.js";

const execFileAsync = promisify(execFile);
const EMITTED_AT = "2026-05-31T14:00:00.000Z";

function layerReceiptRuntimeEvidenceReport() {
  return {
    artifactKind: "layer_receipt_runtime_evidence_report",
    schemaVersion: "layer-receipt-runtime-evidence-report.v0",
    sourceRepo: "mesh-ecology-layer",
    sourceRepos: ["mesh-ecology-layer", "mesh-ecology-edge"],
    reportId: "layer-receipt-runtime-evidence-report:edge-layer-seam:linked",
    reportHash: `sha256:${"1".repeat(64)}`,
    sourceRefs: [
      "layer-receipt-runtime-evidence-report:edge-layer-seam:linked",
      `sha256:${"1".repeat(64)}`,
      "layer-report-only-edge-seam-receipt:runtime-evidence:linked",
      `sha256:${"2".repeat(64)}`,
      "edge-layer-report-only-seam-request:runtime-evidence:linked",
      `sha256:${"3".repeat(64)}`,
      "corestore:layer-runtime-receipts:receipt:linked",
      "autobase-writer:layer-runtime-receipts",
      "layer-receipt-runtime-trace:linked",
    ],
    receipt: {
      receiptId: "layer-report-only-edge-seam-receipt:runtime-evidence:linked",
      receiptHash: `sha256:${"2".repeat(64)}`,
      sourceRequestId: "edge-layer-report-only-seam-request:runtime-evidence:linked",
      sourceRequestHash: `sha256:${"3".repeat(64)}`,
      durableRef: "corestore:layer-runtime-receipts:receipt:linked",
      writerRef: "autobase-writer:layer-runtime-receipts",
    },
    runtimeEvidence: {
      runtimeEvidenceId: "layer-receipt-runtime-evidence:linked",
      runtimeEvidenceHash: `sha256:${"4".repeat(64)}`,
      runtimeTraceRef: "layer-receipt-runtime-trace:linked",
      durableReceiptRef: "corestore:layer-runtime-receipts:receipt:linked",
    },
    posture: {
      layerEvidenceAdmitted: false,
      layerAdmissionDecided: false,
      rbcInterpreted: false,
      authorityGranted: false,
      canonicalHistoryClaimed: false,
    },
    boundary: {
      reportOnly: true,
      admitsLayerEvidence: false,
      decidesLayerAdmission: false,
      interpretsRbc: false,
      grantsAuthority: false,
      claimsCanonicalHistory: false,
    },
    nonClaims: {
      layerEvidenceAdmitted: false,
      layerAdmissionDecided: false,
      rbcInterpreted: false,
      authorityGranted: false,
      canonicalHistoryClaimed: false,
    },
  };
}

test("Layer receipt runtime evidence is observed as adjacent local material only", () => {
  const observation = buildLayerReceiptRuntimeEvidenceObservation({
    layerReceiptRuntimeEvidence: layerReceiptRuntimeEvidenceReport(),
    emittedAt: EMITTED_AT,
  });

  assertLayerReceiptRuntimeEvidenceObservation(observation);
  assert.equal(observation.artifactKind, CAUSAL_LAYER_RECEIPT_RUNTIME_EVIDENCE_OBSERVATION_ARTIFACT_KIND);
  assert.equal(observation.schema, CAUSAL_LAYER_RECEIPT_RUNTIME_EVIDENCE_OBSERVATION_SCHEMA);
  assert.equal(observation.reviewStatus, "layer-receipt-runtime-evidence-observation-emitted");
  assert.equal(observation.validation.status, "layer-receipt-runtime-evidence-observation-emitted");
  assert.equal(observation.validation.reportConsumed, true);
  assert.equal(observation.validation.layerSourceRepoPreserved, true);
  assert.equal(observation.validation.reportRefsPreserved, true);
  assert.equal(observation.validation.receiptRefsPreserved, true);
  assert.equal(observation.validation.runtimeRefsPreserved, true);
  assert.equal(observation.validation.durableAndWriterRefsPreserved, true);
  assert.equal(observation.validation.sourceRefsPreserved, true);
  assert.deepEqual(observation.validation.issues, []);
  assert.equal(observation.source.sourceRepo, "mesh-ecology-layer");
  assert.equal(observation.source.sourceReportId, "layer-receipt-runtime-evidence-report:edge-layer-seam:linked");
  assert.equal(observation.source.sourceReportHash, `sha256:${"1".repeat(64)}`);
  assert.equal(observation.receiptRefs.receiptId, "layer-report-only-edge-seam-receipt:runtime-evidence:linked");
  assert.equal(observation.receiptRefs.receiptHash, `sha256:${"2".repeat(64)}`);
  assert.equal(observation.receiptRefs.sourceRequestId, "edge-layer-report-only-seam-request:runtime-evidence:linked");
  assert.equal(observation.receiptRefs.sourceRequestHash, `sha256:${"3".repeat(64)}`);
  assert.equal(observation.receiptRefs.durableRef, "corestore:layer-runtime-receipts:receipt:linked");
  assert.equal(observation.receiptRefs.writerRef, "autobase-writer:layer-runtime-receipts");
  assert.deepEqual(observation.receiptRefs.sourceRepos, ["mesh-ecology-layer", "mesh-ecology-edge"]);
  assert.equal(observation.runtimeRefs.runtimeEvidenceId, "layer-receipt-runtime-evidence:linked");
  assert.equal(observation.runtimeRefs.runtimeEvidenceHash, `sha256:${"4".repeat(64)}`);
  assert.equal(observation.runtimeRefs.runtimeTraceRef, "layer-receipt-runtime-trace:linked");
  assert.equal(
    observation.proof.strongestProofRung,
    "local_causal_observation_over_supplied_layer_receipt_runtime_evidence",
  );
  assert.equal(observation.proof.normalizedProofLabel, "local_supplied_layer_receipt_runtime_evidence");
  assert.equal(observation.proof.dhtOrHyperswarmInputObservedByCausalSubstrate, false);
  assert.equal(observation.nonClaims.canonicalHistoryAccepted, false);
  assert.equal(observation.nonClaims.layerEvidenceAdmitted, false);
  assert.equal(observation.nonClaims.layerAdmissionDecided, false);
  assert.equal(observation.nonClaims.rbcInterpreted, false);
  assert.equal(observation.nonClaims.authorityGranted, false);
  assert.equal(observation.boundary.adjacentInputOnly, true);
  assert.equal(observation.boundary.callsLayer, false);
  assert.equal(observation.boundary.opensLayerRuntime, false);
  assert.equal(observation.boundary.writesLayerEvidence, false);
  assert.equal(observation.boundary.admitsLayerEvidence, false);
  assert.equal(observation.boundary.decidesLayerAdmission, false);
  assert.equal(observation.boundary.interpretsRbc, false);
  assert.equal(observation.boundary.acceptsCanonicalHistory, false);
  assert.equal(observation.boundary.grantsAuthority, false);
  assert.equal(observation.deferredAttachmentPoints.layerAdmission.status, "deferred");
  assert.equal(observation.deferredAttachmentPoints.rbcInterpretation.active, false);
  assert.equal(observation.deferredAttachmentPoints.authorityDecision.writes, false);
});

test("Layer receipt runtime evidence remains incomplete when receipt and runtime refs are missing", () => {
  const report = layerReceiptRuntimeEvidenceReport();
  delete (report.receipt as Record<string, unknown>).receiptHash;
  delete (report.receipt as Record<string, unknown>).durableRef;
  delete (report.runtimeEvidence as Record<string, unknown>).runtimeEvidenceHash;
  report.sourceRefs = [
    "layer-receipt-runtime-evidence-report:edge-layer-seam:linked",
    `sha256:${"1".repeat(64)}`,
  ];

  const observation = buildLayerReceiptRuntimeEvidenceObservation({
    layerReceiptRuntimeEvidence: report,
    emittedAt: EMITTED_AT,
  });

  assertLayerReceiptRuntimeEvidenceObservation(observation);
  assert.equal(observation.reviewStatus, "layer-receipt-runtime-evidence-observation-incomplete");
  assert.equal(observation.validation.reportConsumed, true);
  assert.equal(observation.validation.layerSourceRepoPreserved, true);
  assert.equal(observation.validation.receiptRefsPreserved, false);
  assert.equal(observation.validation.runtimeRefsPreserved, false);
  assert.equal(observation.validation.durableAndWriterRefsPreserved, false);
  assert.equal(observation.validation.sourceRefsPreserved, true);
  assert.equal(observation.receiptRefs.receiptId, "layer-report-only-edge-seam-receipt:runtime-evidence:linked");
  assert.equal(observation.receiptRefs.receiptHash, undefined);
  assert.equal(observation.runtimeRefs.runtimeEvidenceId, "layer-receipt-runtime-evidence:linked");
  assert.equal(observation.runtimeRefs.runtimeEvidenceHash, undefined);
  assert.ok(observation.validation.issues.includes("receipt-refs-missing"));
  assert.ok(observation.validation.issues.includes("runtime-evidence-refs-missing"));
  assert.ok(observation.validation.issues.includes("receipt-durable-or-writer-ref-missing"));
  assert.equal(observation.nonClaims.layerEvidenceAdmitted, false);
  assert.equal(observation.nonClaims.layerAdmissionDecided, false);
  assert.equal(observation.nonClaims.rbcInterpreted, false);
  assert.equal(observation.boundary.admitsLayerEvidence, false);
  assert.equal(observation.boundary.decidesLayerAdmission, false);
  assert.equal(observation.boundary.interpretsRbc, false);
  assert.equal(observation.boundary.grantsAuthority, false);
});

test("Layer receipt runtime evidence rejects non-Layer source ownership", () => {
  const report = layerReceiptRuntimeEvidenceReport();
  report.sourceRepo = "mesh-ecology-edge";
  report.sourceRepos = ["mesh-ecology-edge"];

  const observation = buildLayerReceiptRuntimeEvidenceObservation({
    layerReceiptRuntimeEvidence: report,
    emittedAt: EMITTED_AT,
  });

  assertLayerReceiptRuntimeEvidenceObservation(observation);
  assert.equal(observation.reviewStatus, "layer-receipt-runtime-evidence-observation-guardrail-blocked");
  assert.equal(observation.validation.reportConsumed, true);
  assert.equal(observation.validation.layerSourceRepoPreserved, false);
  assert.ok(observation.validation.issues.includes("layer-source-repo-missing-or-unowned"));
  assert.equal(observation.source.sourceRepo, "mesh-ecology-edge");
  assert.deepEqual(observation.receiptRefs.sourceRepos, ["mesh-ecology-edge"]);
  assert.equal(observation.proof.layerOwnedInputObserved, false);
  assert.equal(observation.proof.dhtOrHyperswarmInputObservedByCausalSubstrate, false);
  assert.equal(observation.nonClaims.layerEvidenceAdmitted, false);
  assert.equal(observation.nonClaims.layerAdmissionDecided, false);
  assert.equal(observation.nonClaims.authorityGranted, false);
  assert.equal(observation.boundary.callsLayer, false);
  assert.equal(observation.boundary.admitsLayerEvidence, false);
  assert.equal(observation.boundary.decidesLayerAdmission, false);
  assert.equal(observation.boundary.interpretsRbc, false);
  assert.equal(observation.boundary.grantsAuthority, false);
});

test("Layer receipt runtime evidence blocks admission RBC and authority overclaims", () => {
  const report = layerReceiptRuntimeEvidenceReport();
  report.posture.layerEvidenceAdmitted = true;
  report.posture.layerAdmissionDecided = true;
  report.posture.rbcInterpreted = true;
  report.posture.authorityGranted = true;
  report.posture.canonicalHistoryClaimed = true;
  report.boundary.admitsLayerEvidence = true;
  report.boundary.decidesLayerAdmission = true;
  report.boundary.interpretsRbc = true;
  report.boundary.grantsAuthority = true;
  report.nonClaims.authorityGranted = true;

  const observation = buildLayerReceiptRuntimeEvidenceObservation({
    layerReceiptRuntimeEvidence: report,
    emittedAt: EMITTED_AT,
  });

  assertLayerReceiptRuntimeEvidenceObservation(observation);
  assert.equal(observation.reviewStatus, "layer-receipt-runtime-evidence-observation-guardrail-blocked");
  assert.equal(observation.validation.reportConsumed, true);
  assert.equal(observation.validation.reportRefsPreserved, true);
  assert.equal(observation.validation.receiptRefsPreserved, true);
  assert.equal(observation.validation.runtimeRefsPreserved, true);
  assert.ok(observation.validation.issues.includes("layer-receipt-runtime-overclaim"));
  assert.equal(observation.validation.noCanonicalHistoryClaim, true);
  assert.equal(observation.validation.noLayerAdmissionClaim, true);
  assert.equal(observation.validation.noLayerEvidenceAdmissionClaim, true);
  assert.equal(observation.validation.noRbcInterpretationClaim, true);
  assert.equal(observation.validation.noAuthorityClaim, true);
  assert.equal(observation.nonClaims.canonicalHistoryAccepted, false);
  assert.equal(observation.nonClaims.layerEvidenceAdmitted, false);
  assert.equal(observation.nonClaims.layerAdmissionDecided, false);
  assert.equal(observation.nonClaims.rbcInterpreted, false);
  assert.equal(observation.nonClaims.authorityGranted, false);
  assert.equal(observation.boundary.acceptsCanonicalHistory, false);
  assert.equal(observation.boundary.admitsLayerEvidence, false);
  assert.equal(observation.boundary.decidesLayerAdmission, false);
  assert.equal(observation.boundary.interpretsRbc, false);
  assert.equal(observation.boundary.grantsAuthority, false);
  assert.equal(observation.boundary.writesContinuityRecords, false);
});

test("Layer receipt runtime evidence readback contract preserves JSON round-trip refs and non-claims", () => {
  const observation = buildLayerReceiptRuntimeEvidenceObservation({
    layerReceiptRuntimeEvidence: layerReceiptRuntimeEvidenceReport(),
    emittedAt: EMITTED_AT,
  });
  const roundTripped = JSON.parse(JSON.stringify(observation)) as unknown;

  const readback = buildLayerReceiptRuntimeEvidenceReadbackContract({
    observation: roundTripped,
    emittedAt: "2026-05-31T14:01:00.000Z",
  });

  assertLayerReceiptRuntimeEvidenceReadbackContract(readback);
  assert.equal(readback.reviewStatus, "layer-receipt-runtime-evidence-readback-contract-valid");
  assert.equal(readback.validation.observationArtifactConsumed, true);
  assert.equal(readback.validation.sourceReportRefsPreserved, true);
  assert.equal(readback.validation.receiptRefsPreserved, true);
  assert.equal(readback.validation.requestRefsPreserved, true);
  assert.equal(readback.validation.runtimeRefsPreserved, true);
  assert.equal(readback.validation.durableAndWriterRefsPreserved, true);
  assert.equal(readback.validation.sourceRefsPreserved, true);
  assert.equal(readback.validation.proofLabelsPreserved, true);
  assert.equal(readback.validation.nonClaimsPreserved, true);
  assert.equal(readback.validation.deferredAttachmentPointsPreserved, true);
  assert.equal(readback.source.sourceObservationArtifactId, observation.artifactId);
  assert.equal(readback.source.sourceObservationStatus, "layer-receipt-runtime-evidence-observation-emitted");
  assert.equal(
    readback.source.sourceObservationProofRung,
    "local_causal_observation_over_supplied_layer_receipt_runtime_evidence",
  );
  assert.equal(readback.source.sourceObservationNormalizedProofLabel, "local_supplied_layer_receipt_runtime_evidence");
  assert.equal(readback.source.sourceReportId, "layer-receipt-runtime-evidence-report:edge-layer-seam:linked");
  assert.equal(readback.source.sourceReportHash, `sha256:${"1".repeat(64)}`);
  assert.equal(readback.preservedRefs.receiptId, "layer-report-only-edge-seam-receipt:runtime-evidence:linked");
  assert.equal(readback.preservedRefs.receiptHash, `sha256:${"2".repeat(64)}`);
  assert.equal(readback.preservedRefs.sourceRequestId, "edge-layer-report-only-seam-request:runtime-evidence:linked");
  assert.equal(readback.preservedRefs.sourceRequestHash, `sha256:${"3".repeat(64)}`);
  assert.equal(readback.preservedRefs.runtimeEvidenceId, "layer-receipt-runtime-evidence:linked");
  assert.equal(readback.preservedRefs.runtimeEvidenceHash, `sha256:${"4".repeat(64)}`);
  assert.equal(readback.preservedRefs.runtimeTraceRef, "layer-receipt-runtime-trace:linked");
  assert.equal(readback.boundary.readbackOnly, true);
  assert.equal(readback.boundary.writesObservationArtifact, false);
  assert.equal(readback.boundary.callsLayer, false);
  assert.equal(readback.boundary.admitsLayerEvidence, false);
  assert.equal(readback.boundary.decidesLayerAdmission, false);
  assert.equal(readback.boundary.interpretsRbc, false);
  assert.equal(readback.boundary.acceptsCanonicalHistory, false);
  assert.equal(readback.boundary.grantsAuthority, false);
  assert.deepEqual(readback.rejections, []);
});

test("Layer receipt runtime evidence readback contract rejects weakened observation artifacts", () => {
  const observation = buildLayerReceiptRuntimeEvidenceObservation({
    layerReceiptRuntimeEvidence: layerReceiptRuntimeEvidenceReport(),
    emittedAt: EMITTED_AT,
  });
  const weakened = JSON.parse(JSON.stringify(observation)) as any;
  delete weakened.receiptRefs.receiptHash;
  delete weakened.runtimeRefs.runtimeEvidenceHash;
  weakened.proof.normalizedProofLabel = "dht_hyperswarm_durable_seam_history_material";
  weakened.nonClaims.rbcInterpreted = true;
  weakened.deferredAttachmentPoints.layerAdmission.active = true;

  const readback = buildLayerReceiptRuntimeEvidenceReadbackContract({
    observation: weakened,
    emittedAt: "2026-05-31T14:01:30.000Z",
  });

  assertLayerReceiptRuntimeEvidenceReadbackContract(readback);
  assert.equal(readback.reviewStatus, "layer-receipt-runtime-evidence-readback-contract-invalid");
  assert.equal(readback.validation.observationArtifactConsumed, false);
  assert.equal(readback.validation.receiptRefsPreserved, false);
  assert.equal(readback.validation.runtimeRefsPreserved, false);
  assert.equal(readback.validation.proofLabelsPreserved, false);
  assert.equal(readback.validation.nonClaimsPreserved, false);
  assert.equal(readback.validation.deferredAttachmentPointsPreserved, false);
  assert.ok(readback.validation.issues.includes("layer-receipt-runtime-observation-invalid"));
  assert.equal(readback.validation.noLayerAdmissionClaim, true);
  assert.equal(readback.validation.noRbcInterpretationClaim, true);
  assert.equal(readback.validation.noAuthorityClaim, true);
  assert.equal(readback.boundary.admitsLayerEvidence, false);
  assert.equal(readback.boundary.decidesLayerAdmission, false);
  assert.equal(readback.boundary.interpretsRbc, false);
  assert.equal(readback.boundary.grantsAuthority, false);
});

test("Layer receipt runtime evidence CLI writes local observation and readback artifacts", async () => {
  const tempRoot = await mkdtemp(path.join(tmpdir(), "causal-layer-receipt-runtime-cli-"));
  const inputPath = path.join(tempRoot, "layer-receipt-runtime-evidence.json");
  const outputPath = path.join(tempRoot, "layer-receipt-runtime-observation.json");
  const readbackPath = path.join(tempRoot, "layer-receipt-runtime-readback.json");
  try {
    await writeFile(inputPath, JSON.stringify(layerReceiptRuntimeEvidenceReport(), null, 2), "utf8");
    const { stdout, stderr } = await execFileAsync("npx", [
      "tsx",
      "scripts/observe-layer-receipt-runtime-evidence.ts",
      "--input",
      inputPath,
      "--output",
      outputPath,
      "--readback-output",
      readbackPath,
      "--emitted-at",
      "2026-05-31T14:02:00.000Z",
      "--readback-emitted-at",
      "2026-05-31T14:02:01.000Z",
    ], {
      cwd: path.resolve("."),
    });

    assert.equal(stdout, "");
    assert.equal(stderr, "");
    const observation = JSON.parse(await readFile(outputPath, "utf8"));
    const readback = JSON.parse(await readFile(readbackPath, "utf8"));

    assertLayerReceiptRuntimeEvidenceObservation(observation);
    assertLayerReceiptRuntimeEvidenceReadbackContract(readback);
    assert.equal(observation.reviewStatus, "layer-receipt-runtime-evidence-observation-emitted");
    assert.equal(observation.proof.strongestProofRung, "local_causal_observation_over_supplied_layer_receipt_runtime_evidence");
    assert.equal(observation.proof.normalizedProofLabel, "local_supplied_layer_receipt_runtime_evidence");
    assert.equal(observation.proof.dhtOrHyperswarmInputObservedByCausalSubstrate, false);
    assert.equal(observation.boundary.callsLayer, false);
    assert.equal(observation.boundary.admitsLayerEvidence, false);
    assert.equal(observation.boundary.decidesLayerAdmission, false);
    assert.equal(observation.boundary.interpretsRbc, false);
    assert.equal(observation.boundary.grantsAuthority, false);
    assert.equal(readback.reviewStatus, "layer-receipt-runtime-evidence-readback-contract-valid");
    assert.equal(readback.source.sourceObservationArtifactId, observation.artifactId);
    assert.equal(readback.validation.proofLabelsPreserved, true);
    assert.equal(readback.boundary.readbackOnly, true);
    assert.equal(readback.boundary.admitsLayerEvidence, false);
    assert.equal(readback.boundary.interpretsRbc, false);
    assert.equal(readback.boundary.grantsAuthority, false);
  } finally {
    await rm(tempRoot, { recursive: true, force: true });
  }
});

test("Layer receipt runtime evidence CLI writes bounded negative observations without overclaims", async () => {
  const tempRoot = await mkdtemp(path.join(tmpdir(), "causal-layer-receipt-runtime-negative-cli-"));
  try {
    const incomplete = layerReceiptRuntimeEvidenceReport();
    delete (incomplete.receipt as Record<string, unknown>).receiptHash;
    delete (incomplete.runtimeEvidence as Record<string, unknown>).runtimeEvidenceHash;
    incomplete.sourceRefs = [
      "layer-receipt-runtime-evidence-report:edge-layer-seam:linked",
      `sha256:${"1".repeat(64)}`,
      "layer-report-only-edge-seam-receipt:runtime-evidence:linked",
      "edge-layer-report-only-seam-request:runtime-evidence:linked",
      `sha256:${"3".repeat(64)}`,
      "corestore:layer-runtime-receipts:receipt:linked",
      "autobase-writer:layer-runtime-receipts",
      "layer-receipt-runtime-trace:linked",
    ];

    const overclaim = layerReceiptRuntimeEvidenceReport();
    overclaim.posture.layerEvidenceAdmitted = true;
    overclaim.posture.rbcInterpreted = true;
    overclaim.boundary.decidesLayerAdmission = true;
    overclaim.boundary.grantsAuthority = true;

    const cases = [
      {
        name: "incomplete",
        input: incomplete,
        expectedStatus: "layer-receipt-runtime-evidence-observation-incomplete",
        expectedReadbackStatus: "layer-receipt-runtime-evidence-readback-contract-invalid",
        expectedIssues: ["receipt-refs-missing", "runtime-evidence-refs-missing"],
      },
      {
        name: "overclaim",
        input: overclaim,
        expectedStatus: "layer-receipt-runtime-evidence-observation-guardrail-blocked",
        expectedReadbackStatus: "layer-receipt-runtime-evidence-readback-contract-valid",
        expectedIssues: ["layer-receipt-runtime-overclaim"],
      },
    ] as const;

    for (const cliCase of cases) {
      const inputPath = path.join(tempRoot, `${cliCase.name}-input.json`);
      const outputPath = path.join(tempRoot, `${cliCase.name}-observation.json`);
      const readbackPath = path.join(tempRoot, `${cliCase.name}-readback.json`);
      await writeFile(inputPath, JSON.stringify(cliCase.input, null, 2), "utf8");

      const { stdout, stderr } = await execFileAsync("npx", [
        "tsx",
        "scripts/observe-layer-receipt-runtime-evidence.ts",
        "--input",
        inputPath,
        "--output",
        outputPath,
        "--readback-output",
        readbackPath,
        "--emitted-at",
        "2026-05-31T14:03:00.000Z",
        "--readback-emitted-at",
        "2026-05-31T14:03:01.000Z",
      ], {
        cwd: path.resolve("."),
      });

      assert.equal(stdout, "");
      assert.equal(stderr, "");
      const observation = JSON.parse(await readFile(outputPath, "utf8"));
      const readback = JSON.parse(await readFile(readbackPath, "utf8"));

      assertLayerReceiptRuntimeEvidenceObservation(observation);
      assertLayerReceiptRuntimeEvidenceReadbackContract(readback);
      assert.equal(observation.reviewStatus, cliCase.expectedStatus);
      assert.equal(readback.reviewStatus, cliCase.expectedReadbackStatus);
      for (const issue of cliCase.expectedIssues) {
        assert.ok(observation.validation.issues.includes(issue));
      }
      assert.equal(observation.source.sourceReportId, "layer-receipt-runtime-evidence-report:edge-layer-seam:linked");
      assert.equal(observation.receiptRefs.receiptId, "layer-report-only-edge-seam-receipt:runtime-evidence:linked");
      assert.equal(observation.receiptRefs.sourceRequestId, "edge-layer-report-only-seam-request:runtime-evidence:linked");
      assert.equal(observation.proof.strongestProofRung, "local_causal_observation_over_supplied_layer_receipt_runtime_evidence");
      assert.equal(observation.proof.dhtOrHyperswarmInputObservedByCausalSubstrate, false);
      assert.equal(observation.nonClaims.canonicalHistoryAccepted, false);
      assert.equal(observation.nonClaims.layerEvidenceAdmitted, false);
      assert.equal(observation.nonClaims.layerAdmissionDecided, false);
      assert.equal(observation.nonClaims.rbcInterpreted, false);
      assert.equal(observation.nonClaims.authorityGranted, false);
      assert.equal(observation.boundary.admitsLayerEvidence, false);
      assert.equal(observation.boundary.decidesLayerAdmission, false);
      assert.equal(observation.boundary.interpretsRbc, false);
      assert.equal(observation.boundary.acceptsCanonicalHistory, false);
      assert.equal(observation.boundary.grantsAuthority, false);
      assert.equal(readback.boundary.admitsLayerEvidence, false);
      assert.equal(readback.boundary.interpretsRbc, false);
      assert.equal(readback.boundary.grantsAuthority, false);
    }
  } finally {
    await rm(tempRoot, { recursive: true, force: true });
  }
});

test("Layer receipt runtime evidence source-ref completeness reports complete and incomplete material", () => {
  const complete = buildLayerReceiptRuntimeEvidenceSourceRefCompleteness(layerReceiptRuntimeEvidenceReport());

  assert.equal(complete.reportKind, "layer_receipt_runtime_evidence_source_ref_completeness");
  assert.equal(complete.complete, true);
  assert.equal(complete.sourceRefsPresent, true);
  assert.equal(complete.layerOwnedSourceRepoPresent, true);
  assert.deepEqual(complete.missingRefKinds, []);
  assert.equal(complete.requiredRefs.reportId, true);
  assert.equal(complete.requiredRefs.reportHash, true);
  assert.equal(complete.requiredRefs.sourceRepos, true);
  assert.equal(complete.requiredRefs.receiptId, true);
  assert.equal(complete.requiredRefs.receiptHash, true);
  assert.equal(complete.requiredRefs.sourceRequestId, true);
  assert.equal(complete.requiredRefs.sourceRequestHash, true);
  assert.equal(complete.requiredRefs.receiptDurableRef, true);
  assert.equal(complete.requiredRefs.receiptWriterRef, true);
  assert.equal(complete.requiredRefs.runtimeEvidenceId, true);
  assert.equal(complete.requiredRefs.runtimeEvidenceHash, true);
  assert.equal(complete.requiredRefs.runtimeTraceRef, true);
  assert.equal(complete.requiredRefs.durableReceiptRef, true);
  assert.equal(complete.preservedRefs.receiptId, "layer-report-only-edge-seam-receipt:runtime-evidence:linked");
  assert.equal(complete.preservedRefs.sourceRequestId, "edge-layer-report-only-seam-request:runtime-evidence:linked");
  assert.equal(complete.preservedRefs.runtimeEvidenceId, "layer-receipt-runtime-evidence:linked");
  assert.equal(complete.boundary.reportOnly, true);
  assert.equal(complete.boundary.metadataOnly, true);
  assert.equal(complete.boundary.admitsLayerEvidence, false);
  assert.equal(complete.boundary.decidesLayerAdmission, false);
  assert.equal(complete.boundary.interpretsRbc, false);
  assert.equal(complete.boundary.acceptsCanonicalHistory, false);
  assert.equal(complete.boundary.grantsAuthority, false);

  const incompleteMaterial = layerReceiptRuntimeEvidenceReport();
  incompleteMaterial.sourceRepo = "mesh-ecology-edge";
  incompleteMaterial.sourceRefs = [];
  delete (incompleteMaterial.receipt as Record<string, unknown>).receiptHash;
  delete (incompleteMaterial.receipt as Record<string, unknown>).sourceRequestHash;
  delete (incompleteMaterial.receipt as Record<string, unknown>).writerRef;
  delete (incompleteMaterial.runtimeEvidence as Record<string, unknown>).runtimeEvidenceHash;
  delete (incompleteMaterial.runtimeEvidence as Record<string, unknown>).durableReceiptRef;
  const incomplete = buildLayerReceiptRuntimeEvidenceSourceRefCompleteness(incompleteMaterial);

  assert.equal(incomplete.complete, false);
  assert.equal(incomplete.sourceRefsPresent, true);
  assert.equal(incomplete.layerOwnedSourceRepoPresent, false);
  assert.equal(incomplete.requiredRefs.receiptHash, false);
  assert.equal(incomplete.requiredRefs.sourceRequestHash, false);
  assert.equal(incomplete.requiredRefs.receiptWriterRef, false);
  assert.equal(incomplete.requiredRefs.runtimeEvidenceHash, false);
  assert.equal(incomplete.requiredRefs.durableReceiptRef, false);
  assert.ok(incomplete.missingRefKinds.includes("receiptHash"));
  assert.ok(incomplete.missingRefKinds.includes("sourceRequestHash"));
  assert.ok(incomplete.missingRefKinds.includes("receiptWriterRef"));
  assert.ok(incomplete.missingRefKinds.includes("runtimeEvidenceHash"));
  assert.ok(incomplete.missingRefKinds.includes("durableReceiptRef"));
  assert.ok(incomplete.missingRefKinds.includes("layerOwnedSourceRepo"));
  assert.equal(incomplete.boundary.admitsLayerEvidence, false);
  assert.equal(incomplete.boundary.interpretsRbc, false);
  assert.equal(incomplete.boundary.grantsAuthority, false);
});
