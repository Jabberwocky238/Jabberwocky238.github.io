import { DocusaurusContext } from "@docusaurus/types";
import { PluginOptions } from "@docusaurus/types";
import { PluginContentLoadedActions } from "@docusaurus/types";

export default function (context: DocusaurusContext, options: PluginOptions) {
    return {
        name: 'docusaurus-feedback-plugin',
        async loadContent() {
            return 1 + Math.floor(Math.random() * 10);
        },
        async contentLoaded({ content, actions }: { content: number, actions: PluginContentLoadedActions }) {
            const { createData, addRoute, setGlobalData } = actions;
            // Create friends.json
            const friends = ['Yangshun', 'Sebastien'];
            const friendsJsonPath = await createData(
                'friends.json',
                JSON.stringify(friends),
            );

            // Add the '/friends' routes, and ensure it receives the friends props
            addRoute({
                path: '/friends',
                component: '@site/src/components/Friends.js',
                modules: {
                    // propName -> JSON file path
                    friends: friendsJsonPath,
                },
                exact: true,
            });
        },
    };
}