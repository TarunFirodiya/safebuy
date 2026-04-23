import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// `defineCloudflareConfig` does not forward `buildCommand`, so we set it on the
// returned config directly. Without this, OpenNext defaults to `pnpm build`,
// which re-invokes this same package script and recurses forever.
const config = defineCloudflareConfig({});

export default {
  ...config,
  buildCommand: "pnpm exec next build",
};
