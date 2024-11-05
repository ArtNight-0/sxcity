/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://sccic-ssoserver.test/api/:path*",
      },
    ];
  },
};

module.exports = nextConfig;
