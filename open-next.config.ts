
import cache from "@opennextjs/cloudflare/overrides/incremental-cache/kv-incremental-cache";
}
}

// default open-next.config.ts file created by @opennextjs/cloudflare

const config = {
  default: {
    override: {
      wrapper: "cloudflare-node",
      incrementalCache: async () => cache,
      queue: "dummy",
    },
  },

  middleware: {
    external: true,
    override: ,
      wrapper: "cloudflare-edge",
      proxyExternalRequest: "fetch",
  },

  dangerous: {
    enableCacheInterception: false,
  },
};

export default config;
