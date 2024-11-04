import { themes as prismThemes } from 'prism-react-renderer';
import type { Config, PluginConfig } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import type { Options as DocsPluginOptions } from '@docusaurus/plugin-content-docs';
import type { Options as BlogPluginOptions } from '@docusaurus/plugin-content-blog';
import type { Footer, Navbar, NavbarItem } from '@docusaurus/theme-common';

const presets = [
    [
        '@docusaurus/preset-classic',
        {
            docs: {
                sidebarPath: './sidebars.ts',
                editUrl: 'https://github.com/jabberwocky238/jabberwocky238.github.io/',
                remarkPlugins: [remarkMath],
                rehypePlugins: [rehypeKatex],
            } satisfies DocsPluginOptions,
            blog: {
                showReadingTime: true,
                // Please change this to your repo.
                // Remove this to remove the "edit this page" links.
                editUrl: 'https://github.com/jabberwocky238/jabberwocky238.github.io/',
                // Useful options to enforce blogging best practices
                onInlineTags: 'warn',
                onInlineAuthors: 'warn',
                onUntruncatedBlogPosts: 'ignore',

                remarkPlugins: [remarkMath],
                rehypePlugins: [rehypeKatex],
            },
            theme: {
                customCss: ['./src/css/custom.css'],
            },
        } satisfies Preset.Options,
    ],
]

const plugins: PluginConfig[] = [
    [
        '@docusaurus/plugin-content-docs',
        {
            // id: 'EnglishLearning',
            path: './docs/EnglishLearning',
            routeBasePath: 'English',
            sidebarPath: './sidebars.ts',
            remarkPlugins: [remarkMath],
            rehypePlugins: [rehypeKatex],
        } satisfies DocsPluginOptions,
    ],
    [
        '@docusaurus/plugin-content-docs',
        {
            id: 'MCU',
            path: './docs/MCU',
            routeBasePath: 'MCU',
            sidebarPath: './sidebars.ts',
            remarkPlugins: [remarkMath],
            rehypePlugins: [rehypeKatex],
        } satisfies DocsPluginOptions,
    ],
    [
        '@docusaurus/plugin-content-docs',
        {
            id: 'Rust',
            path: './docs/Rust',
            routeBasePath: 'Rust',
            sidebarPath: './sidebars.ts',
            remarkPlugins: [remarkMath],
            rehypePlugins: [rehypeKatex],
        } satisfies DocsPluginOptions,
    ],
    [
        '@docusaurus/plugin-content-docs',
        {
            id: 'LTScheatsheet',
            path: './docs/LTScheatsheet',
            routeBasePath: 'LTS',
            sidebarPath: './sidebars.ts',
            remarkPlugins: [remarkMath],
            rehypePlugins: [rehypeKatex],
        } satisfies DocsPluginOptions,
    ],
    [
        '@docusaurus/plugin-content-blog',
        {
            path: './blog',
            blogSidebarCount: 20,
            blogSidebarTitle: 'All our posts',
            routeBasePath: 'blog',
            remarkPlugins: [remarkMath],
            rehypePlugins: [rehypeKatex],
            onUntruncatedBlogPosts: 'throw',
            showLastUpdateTime: false,
            exclude: [
                '**/zhihu.{js,jsx,ts,tsx,md,mdx}',
            ],
        } satisfies BlogPluginOptions,
    ],
    [
        '@docusaurus/plugin-content-pages',
        {
            path: './src/pages',
            routeBasePath: '',
            include: ['**/*.{jsx,tsx,md,mdx}'], // before: ['**/*.{js,jsx,ts,tsx,md,mdx}'],
            exclude: [
                '**/_*.{js,jsx,ts,tsx,md,mdx}',
                '**/_*/**',
                '**/*.test.{js,jsx,ts,tsx}',
                '**/__tests__/**',
            ],
            mdxPageComponent: '@theme/MDXPage',
        },
    ],
    [
        '@docusaurus/theme-classic',
        {
            customCss: './src/css/custom.css',
        },
    ],
]

const footer: Footer = {
    style: 'dark',
    links: [
        {
            title: 'Docs',
            items: [
                {
                    label: 'Tutorial',
                    to: '/intro',
                },
            ],
        },
        {
            title: 'Community',
            items: [
                {
                    label: 'Stack Overflow',
                    href: 'https://stackoverflow.com/questions/tagged/docusaurus',
                },
                {
                    label: 'Discord',
                    href: 'https://discordapp.com/invite/docusaurus',
                },
                {
                    label: 'Twitter',
                    href: 'https://twitter.com/docusaurus',
                },
            ],
        },
        {
            title: 'More',
            items: [
                {
                    label: 'Blog',
                    to: '/blog',
                },
                {
                    label: 'GitHub',
                    href: 'https://github.com/facebook/docusaurus',
                },
            ],
        },
    ],
    copyright: `Copyright © ${new Date().getFullYear()} JW238, Inc. Built with Docusaurus.`,
}

const navbar: Navbar = {
    style: 'dark',
    hideOnScroll: false,
    title: 'JW238', // the leftest LOGO word
    logo: {
        alt: 'JW238 Site Logo',
        src: 'img/cometik.webp',
    },
    items: [
        // {
        //     type: 'docSidebar',
        //     sidebarId: 'tutorialSidebar',
        //     label: 'Notes', position: 'left',
        // },
        {
            to: '/blog',
            label: 'Blogs', position: 'left'
        },
        {
            to: '/English',
            label: 'English', position: 'left'
        },
        {
            to: '/MCU',
            label: 'MCU', position: 'left'
        },
        {
            to: '/Rust',
            label: 'Rust', position: 'left'
        },
        {
            to: '/LTS',
            label: 'LTS', position: 'left'
        },
        {
            href: 'https://space.bilibili.com/86221452',
            label: 'Bilibili', position: 'right',
        },
        {
            href: 'https://github.com/jabberwocky238/jabberwocky238.github.io',
            label: 'GitHub', position: 'right',
        },
    ] satisfies NavbarItem[],
}

const config: Config = {
    title: 'JW238 Site',
    tagline: 'Dinosaurs are cool',
    favicon: 'img/cometik.webp',

    // Set the production url of your site here
    url: 'https://jabberwocky238.github.io/',
    // Set the /<baseUrl>/ pathname under which your site is served
    // For GitHub pages deployment, it is often '/<projectName>/'
    baseUrl: '/',
    trailingSlash: false,

    // GitHub pages deployment config.
    // If you aren't using GitHub pages, you don't need these.
    organizationName: 'Jabberwocky238', // Usually your GitHub org/user name.
    projectName: 'Jabberwocky238.github.io', // Usually your repo name.
    deploymentBranch: 'gh-pages',

    // "log" | "warn" | "ignore" | "throw"
    onBrokenLinks: 'warn',
    onBrokenAnchors: 'warn',
    onBrokenMarkdownLinks: 'throw',

    // Even if you don't use internationalization, you can use this field to set
    // useful metadata like html lang. For example, if your site is Chinese, you
    // may want to replace "en" with "zh-Hans".
    i18n: {
        defaultLocale: 'zh-Hans',
        locales: ['zh-Hans'],
    },
    markdown: {
        format: 'md',
        mermaid: true,
        preprocessor: ({ filePath, fileContent }) => {
            const split = filePath.split('\\') as String[];
            // console.log(split)
            if (split.includes("EnglishLearning")) {
                fileContent = fileContent.replace(/<([^\>]*)>\(([^)]*)\)/g, '<span class="origin-text">' + '$1' + '<span class="translated-text">' + '$2' + '</span></span>');
                // fileContent = fileContent.replace(/==([\W']+)==/g, '<strong>$1</strong>');
            }
            if (split.includes("Summary.md")) {
                fileContent = fileContent.replace(/==([‘’\w' \u4e00-\u9fa5\u3000-\u303f\uff00-\uffef]+)==/g, '<mark>$1</mark>');
            }
            return fileContent
        },
    },

    plugins: plugins,
    themes: ['@docusaurus/theme-mermaid'],
    themeConfig: {
        // Replace with your project's social card
        image: 'img/docusaurus-social-card.jpg',
        navbar: navbar,
        footer: footer,
        prism: {
            theme: prismThemes.github,
            darkTheme: prismThemes.dracula,
        },
        colorMode: {
            defaultMode: 'dark',
            disableSwitch: false,
            respectPrefersColorScheme: true,
        },
    } satisfies Preset.ThemeConfig,
};

export default config;
