/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    basePath: process.env.BASEPATH,
    env: {
      NEXT_PUBLIC_BASEPATH: process.env.BASEPATH,
    },
    compiler: {
        styledComponents: true,
      },
      images: {
        remotePatterns: [{
          protocol: 'https',
          hostname: 'avatars.githubusercontent.com',
          port: '',
          pathname: '/u/**'
        },
        {
          protocol: 'https',
          hostname: 'upload.wikimedia.org',
          pathname: '**',
        }]
     
      },
      experimental: { missingSuspenseWithCSRBailout: false, },
      output: "standalone",
      headers: async () => {
        return [
          {
            source: '/:path*',
            headers: [
              {
                key: 'X-Frame-Options',
                value: 'SAMEORIGIN'
              }
            ]
          }
        ]
      } 
};

export default nextConfig;