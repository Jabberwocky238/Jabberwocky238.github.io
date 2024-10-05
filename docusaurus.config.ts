import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

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
            const split = filePath.split('\\')
            if ("EnglishLearning" in split) {
                fileContent = fileContent.replace(/<([^\>]*)>\(([^)]*)\)/g, '<span class="origin-text">' + '$1' + '<span class="translated-text">' + '$2' + '</span></span>');
            }
            return fileContent
        },
    },
    presets: [
        [
            'classic',
            {
                docs: {
                    sidebarPath: './sidebars.ts',
                    editUrl: 'https://github.com/jabberwocky238/jabberwocky238.github.io/',
                    remarkPlugins: [remarkMath],
                    rehypePlugins: [rehypeKatex],
                },
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
    ],
    themes: ['@docusaurus/theme-mermaid'],
    themeConfig: {
        // Replace with your project's social card
        image: 'img/docusaurus-social-card.jpg',
        navbar: {
            title: 'JW238', // the leftest LOGO word
            logo: {
                alt: 'JW238 Site Logo',
                src: 'img/cometik.webp',
            },
            items: [
                {
                    type: 'docSidebar',
                    sidebarId: 'tutorialSidebar',
                    label: 'Notes', position: 'left',
                },
                {
                    to: '/blog',
                    label: 'Blogs', position: 'left'
                },
                {
                    to: '/docs/category/rust',
                    label: 'Rust', position: 'left'
                },
                {
                    href: 'https://space.bilibili.com/86221452',
                    label: 'Bilibili', position: 'right',
                },
                {
                    href: 'https://github.com/jabberwocky238/jabberwocky238.github.io',
                    label: 'GitHub', position: 'right',
                },
            ],
        },
        footer: {
            style: 'dark',
            links: [
                {
                    title: 'Docs',
                    items: [
                        {
                            label: 'Tutorial',
                            to: '/docs/intro',
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
        },
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
