import { createCivicAuthPlugin } from "@civic/auth-web3/nextjs"

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
};

const withCivicAuth = createCivicAuthPlugin({
  clientId: "525067cb-81b0-4fc8-a2e6-a9634ac634eb"
});

export default withCivicAuth(nextConfig);
