import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Hide the Next.js dev indicator (the "N" badge in the bottom-left
  // corner during development). Compile/runtime errors still show.
  devIndicators: false,
};

export default nextConfig;

import('@opennextjs/cloudflare').then(m => m.initOpenNextCloudflareForDev());
