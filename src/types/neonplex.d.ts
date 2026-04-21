declare module "@neonloom/plex" {
  interface PlexDuplex {
    once(event: string, listener: (value: any) => void): this;
    resume(): this;
    destroy(error?: Error): void;
    write(data: any): boolean;
    isConnected(): boolean;
  }

  interface PlexConfig {
    stream: any;
    id: Uint8Array;
    encoding?: any;
    handshakeEncoding?: any;
    handshakeMessage?: any;
  }

  export function listen(config: PlexConfig): PlexDuplex;
  export function connect(config: PlexConfig): PlexDuplex;
}

declare module "@neonloom/plex/codec" {
  export function makeCodec(name: string): any;
}

declare module "@neonloom/plex/dev/pair" {
  export function createDuplexPair(): [any, any];
}
