import assert from "node:assert/strict";
import test from "node:test";

import { connect, listen } from "@neonloom/plex";
import { makeCodec } from "@neonloom/plex/codec";
import { createDuplexPair } from "@neonloom/plex/dev/pair";

import {
  CapabilityExchangeDecision,
  CapabilitySurface,
  negotiateCapabilityExchange,
} from "../src/index.js";

const jsonCodec = makeCodec("json");
const channelId = new TextEncoder().encode("capability-surface-lab-v1");

test("lab-15: neonplex handshake carries capability surfaces before bounded exchange", async () => {
  const [left, right] = createDuplexPair();

  const localSurface: CapabilitySurface = {
    id: "observer-a-capability-surface",
    peerRole: "observer-witness",
    basisId: "visual-rgb",
    sourceBranchId: "observer-a-branch",
    primaryContextId: "room-context",
    visibleContextIds: ["hallway-context"],
    supportedDimensions: ["shape", "red", "blue"],
    missingDimensions: ["green"],
    offer: {
      artifactKinds: ["view", "receipt"],
      exchangeModes: ["view-only", "receipt-only"],
      branchRoles: ["observer", "referent"],
      concernTags: ["camera"],
    },
    request: {
      artifactKinds: ["view", "receipt"],
      preferredExchangeModes: ["view-only", "receipt-only"],
      branchRoles: ["observer", "referent"],
      concernTags: ["camera"],
    },
  };

  const remoteSurface: CapabilitySurface = {
    id: "observer-b-capability-surface",
    peerRole: "observer-witness",
    basisId: "visual-rgb-full",
    sourceBranchId: "observer-b-branch",
    primaryContextId: "room-context",
    visibleContextIds: [],
    supportedDimensions: ["shape", "red", "green", "blue"],
    offer: {
      artifactKinds: ["view", "receipt", "state-estimate"],
      exchangeModes: ["view-only", "receipt-only"],
      branchRoles: ["observer", "referent"],
      concernTags: ["camera"],
    },
    request: {
      artifactKinds: ["view", "receipt"],
      preferredExchangeModes: ["view-only", "receipt-only"],
      branchRoles: ["observer", "referent"],
      concernTags: ["camera"],
    },
  };

  const listener = listen({
    stream: left,
    id: channelId,
    encoding: jsonCodec,
    handshakeEncoding: jsonCodec,
    handshakeMessage: localSurface,
  });
  const connector = connect({
    stream: right,
    id: channelId,
    encoding: jsonCodec,
    handshakeEncoding: jsonCodec,
    handshakeMessage: remoteSurface,
  });

  try {
    const listenerHandshake = waitForEvent<CapabilitySurface>(listener, "connection");
    const connectorHandshake = waitForEvent<CapabilitySurface>(connector, "connection");

    listener.resume();
    connector.resume();

    const [receivedByListener, receivedByConnector] = await Promise.all([
      listenerHandshake,
      connectorHandshake,
    ]);

    assert.deepEqual(receivedByListener, remoteSurface);
    assert.deepEqual(receivedByConnector, localSurface);
    assert.equal(listener.isConnected(), true);
    assert.equal(connector.isConnected(), true);

    const listenerDecision = negotiateCapabilityExchange(
      localSurface,
      receivedByListener,
    );
    const connectorDecision = negotiateCapabilityExchange(
      remoteSurface,
      receivedByConnector,
    );

    assertCapabilityMediation(listenerDecision);
    assert.equal(connectorDecision.accepted, true);
    assert.equal(connectorDecision.requiresMediation, true);
    assert.equal(
      connectorDecision.reason,
      "capability overlap supports bounded exchange",
    );
    assert.deepEqual(connectorDecision.matchedArtifactKinds, ["view", "receipt"]);
    assert.deepEqual(connectorDecision.matchedExchangeModes, ["view-only", "receipt-only"]);

    const boundedDecisionArtifact = {
      accepted: listenerDecision.accepted,
      reason: listenerDecision.reason,
      matchedArtifactKinds: listenerDecision.matchedArtifactKinds,
    };
    const receivedArtifact = waitForEvent<Record<string, unknown>>(connector, "data");

    listener.write(boundedDecisionArtifact);

    assert.deepEqual(await receivedArtifact, boundedDecisionArtifact);
  } finally {
    listener.destroy();
    connector.destroy();
  }
});

function assertCapabilityMediation(decision: CapabilityExchangeDecision) {
  assert.equal(decision.accepted, true);
  assert.equal(decision.requiresMediation, true);
  assert.equal(
    decision.reason,
    "capability mismatch narrows exchange to mediated artifacts",
  );
  assert.deepEqual(decision.matchedArtifactKinds, ["view", "receipt"]);
  assert.deepEqual(decision.matchedExchangeModes, ["view-only", "receipt-only"]);
}

function waitForEvent<T>(target: {
  once(event: string, listener: (value: T) => void): void;
}, event: string, timeoutMs = 1_000) {
  return new Promise<T>((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error(`timed out waiting for ${event}`));
    }, timeoutMs);

    target.once(event, (value: T) => {
      clearTimeout(timeout);
      resolve(value);
    });
  });
}
