/** @type {import('next').NextConfig} */
const githubOrg = process.env.GITHUB_ORG || "RADAR-base";
const githubRepo = process.env.GITHUB_REPO_NAME || "radar-self-enrolment-definitions";
const githubBranch = process.env.GITHUB_REPO_BRANCH_NAME || "main";

const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://raw.githubusercontent.com https://avatars.githubusercontent.com https://www.googletagmanager.com",
  "font-src 'self' data:",
  "connect-src 'self' https://www.googletagmanager.com https://raw.githubusercontent.com",
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "object-src 'none'",
].join('; ')

const nextConfig = {
    reactStrictMode: false,
    basePath: process.env.BASEPATH,
    poweredByHeader: false,
    env: {
      NEXT_PUBLIC_BASEPATH: process.env.BASEPATH,
      NEXT_PUBLIC_STUDY_DEFINITION_REPOSITORY: process.env.STUDY_DEFINITION_REPOSITORY || "GITHUB",
      NEXT_PUBLIC_GITHUB_RAW_BASE_URL: `https://raw.githubusercontent.com/${githubOrg}/${githubRepo}/refs/heads/${githubBranch}`,
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
                key: 'Content-Security-Policy',
                value: contentSecurityPolicy
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
          }
        ]
      } 
};

export default nextConfig;