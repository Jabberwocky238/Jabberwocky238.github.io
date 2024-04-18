// import {gfm, gfmHtml} from 'micromark-extension-gfm'
// import createMDX from '@next/mdx'

/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    assetPrefix: '/', // 设置资源前缀
    pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
};
 

export default nextConfig