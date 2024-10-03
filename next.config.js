/** @type {import('next').NextConfig} */
module.exports = {
  experimental: {
    // Used to guard against accidentally leaking SANITY_API_READ_TOKEN to the browser
    taint: true,
  },
  logging: {
    fetches: { fullUrl: false },
  },
  images: {
		domains: ['cdn.sanity.io']
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.module.rules.push({
      test: /\.gltf$/,
      type: "asset/resource"
    });
    return config;
  },
  async redirects() {
    return [
      {
        source: '/projects', // Die Route, die umgeleitet werden soll
        destination: '/', // Ziel-URL für die Umleitung
        permanent: true, // Setze auf true für eine permanente Umleitung (301)
      },
    ];
  },
};
