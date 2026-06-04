import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

type CurrentPostureHandoff = {
  preservedRefs?: {
    durableRefs?: unknown;
  };
  proofBoundary?: {
    handoffOperationProofRung?: unknown;
    handoffDoesNotUpgradeProof?: unknown;
    liveSwarmRunClaimedByThisHandoff?: unknown;
  };
};

const handoffPath = path.resolve(
  "proof-artifacts/current-causal-posture-handoff-2026-06-03/current-causal-posture-consumer-handoff.json",
);

const unsafeConsumerDurableRefPattern =
  /(?:^\/|^~\/|^[A-Za-z]:\\|\/home\/|\/tmp\/|\/Users\/|\.ssh|known_hosts|identity(?:[-_]?(?:file|path))?|ssh:\/\/|\b10\.\d{1,3}\.\d{1,3}\.\d{1,3}\b|\b127\.\d{1,3}\.\d{1,3}\.\d{1,3}\b|\b192\.168\.\d{1,3}\.\d{1,3}\b|\b172\.(?:1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3}\b)/i;

test("current posture handoff durable refs are sanitized for consumers", async () => {
  const handoff = JSON.parse(await readFile(handoffPath, "utf8")) as CurrentPostureHandoff;
  const durableRefs = handoff.preservedRefs?.durableRefs;

  assert.ok(Array.isArray(durableRefs), "handoff must preserve durable refs");
  assert.ok(durableRefs.length > 0, "handoff must not drop durable refs");

  for (const durableRef of durableRefs) {
    assert.equal(typeof durableRef, "string");
    assert.doesNotMatch(
      durableRef,
      unsafeConsumerDurableRefPattern,
      `unsafe consumer durable ref leaked: ${durableRef}`,
    );
  }

  assert.equal(handoff.proofBoundary?.handoffOperationProofRung, "consumer_handoff_seam");
  assert.equal(handoff.proofBoundary?.handoffDoesNotUpgradeProof, true);
  assert.equal(handoff.proofBoundary?.liveSwarmRunClaimedByThisHandoff, false);
});
