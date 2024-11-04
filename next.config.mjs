/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    compiler: {
        styledComponents: true,
      },
      images: {
        domains: ["upload.wikimedia.org"],
        remotePatterns: [{
          protocol: 'https',
          hostname: 'avatars.githubusercontent.com',
          port: '',
          pathname: '/u/**'
        },
        {
          protocol: 'https',
          hostname: 'upload.wikimedia.org',
          port: '',
          pathname: 'wikipedia/commons/b/b6/**'
        }]
     
      },
      experimental: { missingSuspenseWithCSRBailout: false, }
};

export default nextConfig;