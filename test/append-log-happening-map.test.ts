import assert from "node:assert/strict";
import test from "node:test";

import {
  assertAppendLogHappeningMapArtifact,
  buildAppendLogHappeningMapArtifact,
  CAUSAL_APPEND_LOG_HAPPENING_MAP_ARTIFACT_KIND,
  CAUSAL_APPEND_LOG_HAPPENING_MAP_SCHEMA,
  CAUSAL_APPEND_LOG_HAPPENING_MAP_SCHEMA_VERSION,
} from "../src/index.js";

function platformAppendLogView() {
  return {
    ok: true,
    artifactKind: "platform_append_log_view",
    schema: "mesh-ecology-platform/dock-append-log-view/v1",
    viewHash: "a".repeat(64),
    viewHashRef: `sha256:${"a".repeat(64)}`,
    appendLogRefs: {
      entryRefs: [
        "platform-append-log-entry:platform:append-log-entry:bundle-intake:000000:r-1:abc",
        "platform-append-log-entry:platform:append-log-entry:artifact-stage:000001:r-2:def",
      ],
      entryHashRefs: [`sha256:${"b".repeat(64)}`, `sha256:${"d".repeat(64)}`],
      sourceReceiptRefs: ["platform-receipt:r-1", "platform-receipt:r-2"],
      payloadRefs: [`sha256:${"c".repeat(64)}`, `sha256:${"e".repeat(64)}`],
      artifactRefs: ["platform-artifact:artifact-1"],
    },
    posture: {
      readOnlyProjection: true,
      localStateScaffold: true,
      sourceFilesAreSubstrate: false,
      appendLogBackend: false,
      autobaseBackend: false,
      writesAppendLog: false,
      replacesSource: false,
      decentralizedTruthClaimed: false,
    },
    entries: [
      {
        artifactKind: "platform_append_log_entry",
        schema: "mesh-ecology-platform/dock-append-log-entry/v1",
        entryId: "platform:append-log-entry:bundle-intake:000000:r-1:abc",
        entryRef: "platform-append-log-entry:platform:append-log-entry:bundle-intake:000000:r-1:abc",
        entryHash: "b".repeat(64),
        entryHashRef: `sha256:${"b".repeat(64)}`,
        eventKind: "bundle-intake",
        payloadSha256: "c".repeat(64),
        payloadRef: `sha256:${"c".repeat(64)}`,
        sourceRefs: {
          receiptId: "r-1",
          receiptRef: "platform-receipt:r-1",
          artifactId: "artifact-1",
          artifactRef: "platform-artifact:artifact-1",
          sourcePath: "/tmp/dock/state/receipts/r-1.json",
          sourcePathScaffold: true,
          sourcePathIsSubstrate: false,
        },
        parentEntryRefs: [],
        parentEntryIds: [],
        parentEntryHashRefs: [],
        posture: {
          readOnlyProjection: true,
          localStateScaffold: true,
          sourceFileScaffold: true,
          sourceIsSubstrate: false,
          appendLogBackend: false,
          autobaseBackend: false,
          writesAppendLog: false,
          writesSourceState: false,
          replacesSource: false,
          decentralizedTruthClaimed: false,
          edgeAuthorityGranted: false,
          deploymentExpanded: false,
        },
      },
      {
        artifactKind: "platform_append_log_entry",
        schema: "mesh-ecology-platform/dock-append-log-entry/v1",
        entryId: "platform:append-log-entry:artifact-stage:000001:r-2:def",
        entryRef: "platform-append-log-entry:platform:append-log-entry:artifact-stage:000001:r-2:def",
        entryHash: "d".repeat(64),
        entryHashRef: `sha256:${"d".repeat(64)}`,
        eventKind: "artifact-stage",
        payloadSha256: "e".repeat(64),
        payloadRef: `sha256:${"e".repeat(64)}`,
        sourceRefs: {
          receiptId: "r-2",
          receiptRef: "platform-receipt:r-2",
          artifactId: "artifact-1",
          artifactRef: "platform-artifact:artifact-1",
          previousReceiptId: "r-1",
          previousReceiptRef: "platform-receipt:r-1",
          sourcePath: "/tmp/dock/state/receipts/r-2.json",
          sourcePathScaffold: true,
          sourcePathIsSubstrate: false,
        },
        parentEntryRefs: ["platform-append-log-entry:platform:append-log-entry:bundle-intake:000000:r-1:abc"],
        parentEntryIds: ["platform:append-log-entry:bundle-intake:000000:r-1:abc"],
        parentEntryHashRefs: [`sha256:${"b".repeat(64)}`],
        posture: {
          readOnlyProjection: true,
          localStateScaffold: true,
          sourceFileScaffold: true,
          sourceIsSubstrate: false,
          appendLogBackend: false,
          autobaseBackend: false,
          writesAppendLog: false,
          writesSourceState: false,
          replacesSource: false,
          decentralizedTruthClaimed: false,
          edgeAuthorityGranted: false,
          deploymentExpanded: false,
        },
      },
    ],
  };
}

test("append-log happening map preserves entries as causal happening refs only", () => {
  const artifact = buildAppendLogHappeningMapArtifact({
    appendLogView: platformAppendLogView(),
    sourceRepo: "mesh-ecology-platform",
    sourcePath: "dock/state/append-log-view.json",
    emittedAt: "2026-05-14T18:00:00.000Z",
  });

  assertAppendLogHappeningMapArtifact(artifact);
  assert.equal(artifact.artifactKind, CAUSAL_APPEND_LOG_HAPPENING_MAP_ARTIFACT_KIND);
  assert.equal(artifact.schema, CAUSAL_APPEND_LOG_HAPPENING_MAP_SCHEMA);
  assert.equal(artifact.schemaVersion, CAUSAL_APPEND_LOG_HAPPENING_MAP_SCHEMA_VERSION);
  assert.equal(artifact.reviewStatus, "append-log-happening-map-emitted");
  assert.equal(artifact.validation.status, "append-log-view-valid");
  assert.equal(artifact.validation.entriesPreservedAsReferences, true);
  assert.equal(artifact.validation.sourceFilesRemainScaffold, true);
  assert.equal(artifact.validation.noBackendWriteClaim, true);
  assert.equal(artifact.source.sourceRepo, "mesh-ecology-platform");
  assert.equal(artifact.source.sourceSchema, "mesh-ecology-platform/dock-append-log-view/v1");
  assert.equal(artifact.sourceViewRef, "a".repeat(64));
  assert.equal(artifact.sourceViewHashRef, `sha256:${"a".repeat(64)}`);
  assert.deepEqual(artifact.appendLogRefs.sourceReceiptRefs, ["platform-receipt:r-1", "platform-receipt:r-2"]);
  assert.deepEqual(artifact.appendLogRefs.entryHashRefs, [`sha256:${"b".repeat(64)}`, `sha256:${"d".repeat(64)}`]);
  assert.equal(artifact.happeningRefs.length, 2);
  assert.match(artifact.happeningRefs[0]?.happeningId ?? "", /^causal-append-log-happening:[a-f0-9]{16}$/);
  assert.equal(artifact.happeningRefs[0]?.happeningLabel, "bundle-intake");
  assert.equal(artifact.happeningRefs[0]?.sourceEntryId, "platform:append-log-entry:bundle-intake:000000:r-1:abc");
  assert.equal(artifact.happeningRefs[0]?.sourceEntryRef, "platform-append-log-entry:platform:append-log-entry:bundle-intake:000000:r-1:abc");
  assert.equal(artifact.happeningRefs[0]?.sourceEntryHashRef, `sha256:${"b".repeat(64)}`);
  assert.equal(artifact.happeningRefs[0]?.payloadSha256, "c".repeat(64));
  assert.equal(artifact.happeningRefs[0]?.payloadRef, `sha256:${"c".repeat(64)}`);
  assert.equal(artifact.happeningRefs[0]?.sourceRefs.receiptId, "r-1");
  assert.equal(artifact.happeningRefs[0]?.sourceReceiptRef, "platform-receipt:r-1");
  assert.equal(artifact.happeningRefs[0]?.sourceArtifactRef, "platform-artifact:artifact-1");
  assert.deepEqual(artifact.happeningRefs[1]?.parentEntryRefs, [
    "platform-append-log-entry:platform:append-log-entry:bundle-intake:000000:r-1:abc",
  ]);
  assert.deepEqual(artifact.happeningRefs[1]?.parentEntryHashRefs, [`sha256:${"b".repeat(64)}`]);
  assert.equal(artifact.happeningRefs[1]?.acceptedAsCanonicalHistory, false);
  assert.equal(artifact.boundary.replaysAppendLog, false);
  assert.equal(artifact.boundary.writesContinuityRecords, false);
  assert.equal(artifact.boundary.acceptsCanonicalHistory, false);
  assert.equal(artifact.boundary.claimsCausalTruth, false);
  assert.deepEqual(artifact.rejections, []);
});

test("Platform append-log happening map requires explicit ref semantics", () => {
  const view = platformAppendLogView();
  delete (view as Record<string, unknown>).viewHashRef;
  delete (view as Record<string, unknown>).appendLogRefs;
  delete (view.entries[0] as Record<string, unknown>).entryRef;
  delete (view.entries[0] as Record<string, unknown>).entryHashRef;
  delete (view.entries[0] as Record<string, unknown>).payloadRef;
  delete (view.entries[0]!.sourceRefs as Record<string, unknown>).receiptRef;

  const artifact = buildAppendLogHappeningMapArtifact({
    appendLogView: view,
    sourceRepo: "mesh-ecology-platform",
    emittedAt: "2026-05-16T20:00:00.000Z",
  });

  assert.equal(artifact.reviewStatus, "append-log-view-incomplete");
  assert.equal(artifact.validation.platformRefSemanticsPresent, false);
  assert.ok(artifact.rejections.includes("platform-ref-semantics-missing"));
  assert.equal(artifact.boundary.claimsCausalTruth, false);
});

test("append-log happening map blocks source-as-substrate and backend write claims", () => {
  const view = platformAppendLogView();
  view.posture.sourceFilesAreSubstrate = true;
  view.entries[0]!.posture.sourceIsSubstrate = true;
  view.entries[1]!.posture.writesAppendLog = true;

  const artifact = buildAppendLogHappeningMapArtifact({
    appendLogView: view,
    sourceRepo: "mesh-ecology-platform",
    emittedAt: "2026-05-14T18:05:00.000Z",
  });

  assert.equal(artifact.reviewStatus, "append-log-guardrail-blocked");
  assert.equal(artifact.validation.status, "append-log-guardrail-blocked");
  assert.deepEqual(artifact.happeningRefs, []);
  assert.ok(artifact.rejections.includes("source-files-treated-as-substrate"));
  assert.ok(artifact.rejections.includes("backend-write-claim"));
  assert.equal(artifact.boundary.writesContinuityRecords, false);
  assert.equal(artifact.boundary.claimsCausalTruth, false);
});

test("append-log happening map treats malformed input as non-accepted evidence", () => {
  const artifact = buildAppendLogHappeningMapArtifact({
    appendLogView: "not-json",
    sourceRepo: "mesh-ecology-edge",
    emittedAt: "2026-05-14T18:10:00.000Z",
  });

  assert.equal(artifact.reviewStatus, "append-log-view-malformed");
  assert.equal(artifact.validation.parseableObject, false);
  assert.deepEqual(artifact.happeningRefs, []);
  assert.deepEqual(artifact.rejections, ["append-log-view-not-object"]);
});
