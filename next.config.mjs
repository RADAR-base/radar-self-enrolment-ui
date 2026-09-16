/** @type {import('next').NextConfig} */
const githubOrg = process.env.GITHUB_ORG || "RADAR-base";
const githubRepo = process.env.GITHUB_REPO_NAME || "radar-self-enrolment-definitions";
const githubBranch = process.env.GITHUB_REPO_BRANCH_NAME || "main";

const nextConfig = {
    reactStrictMode: false,
    assetPrefix: process.env.ASSET_PREFIX || undefined,
    poweredByHeader: false,
    env: {
      NEXT_PUBLIC_STUDY_DEFINITION_REPOSITORY: process.env.STUDY_DEFINITION_REPOSITORY || "GITHUB",
      NEXT_PUBLIC_GITHUB_RAW_BASE_URL: `https://raw.githubusercontent.com/${githubOrg}/${githubRepo}/refs/heads/${githubBranch}`,
    },
      images: {
        remotePatterns: [{
          protocol: 'https',
          hostname: 'avatars.githubusercontent.com',
          port: '',
          pathname: '/u/**'
        }]
      },
      output: "standalone",
      headers: async () => {
        return [
          {
            source: '/:path*',
            headers: [
              {
                key: 'X-Frame-Options',
                value: 'SAMEORIGIN'
              },
              {
                key: 'Referrer-Policy',
                value: 'strict-origin-when-cross-origin'
              },
              {
                key: 'Permissions-Policy',
                value: 'camera=(), microphone=(), geolocation=(), payment=()'
              }
            ]
          },
          {
            source: '/api/:path*',
            headers: [
              {
                key: 'Cache-Control',
                value: 'no-store'
              }
            ]
          }
        ]
      }
};

export default nextConfig;