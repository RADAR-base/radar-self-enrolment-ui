/** @type {import('next').NextConfig} */
const githubOrg = process.env.GITHUB_ORG || "RADAR-base";
const githubRepo = process.env.GITHUB_REPO_NAME || "radar-self-enrolment-definitions";
const githubBranch = process.env.GITHUB_REPO_BRANCH_NAME || "main";

const nextConfig = {
    reactStrictMode: false,
    basePath: process.env.BASEPATH,
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
              }
            ]
          }
        ]
      } 
};

export default nextConfig;