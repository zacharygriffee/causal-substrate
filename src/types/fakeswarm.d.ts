declare module "fakeswarm" {
  export interface FakeSwarmDiscovery {
    leave: () => void;
    destroy: () => void;
    refresh: () => Promise<void>;
    flushed: () => Promise<void>;
  }

  export interface FakeSwarm {
    id: string;
    join: (topic: Buffer, opts?: Record<string, unknown>) => FakeSwarmDiscovery | void;
    leave: (topic: Buffer) => void;
    flush: (timeoutMs?: number) => Promise<void>;
    close: () => Promise<void>;
    destroy: (opts?: Record<string, unknown>) => Promise<void>;
    on: (event: "connection", listener: (socket: unknown, peerInfo: unknown) => void) => void;
    off: (event: "connection", listener: (socket: unknown, peerInfo: unknown) => void) => void;
  }

  export function createFakeSwarm(
    seedOrOpts?: Buffer | Record<string, unknown>,
    topicsArg?: Map<string, unknown>,
  ): FakeSwarm;

  export default createFakeSwarm;
}
