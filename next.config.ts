import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['192.168.15.55'],
  sassOptions: {
    includePaths: [path.join(process.cwd(), "src/styles")],
    additionalData: (content: string, loaderContext: { resourcePath: string }) => {
      if (/_(variables|mixins)\.scss$/.test(loaderContext.resourcePath)) {
        return content;
      }
      return `@use 'variables' as *;\n@use 'mixins' as *;\n${content}`;
    },
  },
};

export default nextConfig;
