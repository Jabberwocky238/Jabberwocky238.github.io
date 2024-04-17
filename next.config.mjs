// import {gfm, gfmHtml} from 'micromark-extension-gfm'
// import createMDX from '@next/mdx'

/** @type {import('next').NextConfig} */
const nextConfig = {
    assetPrefix: '/', // 设置资源前缀
    pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
    experimental: {
      mdxRs: true,
    },
};
 
// const withMDX = createMDX({
//   // Add markdown plugins here, as desired
//   options: {
//     remarkPlugins: [gfm()],
//     rehypePlugins: [gfmHtml()],
//   },
// })
 
// Wrap MDX and Next.js config with each other
// export default withMDX(nextConfig)
export default nextConfig