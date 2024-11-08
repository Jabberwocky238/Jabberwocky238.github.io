import { useAPIBase } from "@site/src/global";
import axios from "axios";

export async function visit(blogRoute: string) {
    const API = useAPIBase();
    const api = `${API}/feedback/blog/visit`;

    const blogPath = blogRoute.split('/');
    const blogName = blogPath[blogPath.length - 1];
    const base64blogRoute = window.btoa(blogRoute);

    try {
        await axios.get(`${api}`, {
            params: {
                name: blogName,
                link: base64blogRoute,
            }
        })
    } catch (error) {
        console.error('Error in increBlogPost', blogName, error);
    }
}


export async function getvisitbyname(blogRoute: string) {
    const API = useAPIBase();
    const api = `${API}/feedback/blog/getvisitbyname`;
    const blogPath = blogRoute.split('/');
    const blogName = blogPath[blogPath.length - 1];

    try {
        const res = await axios.get(`${api}`, {
            timeout: 1000,
            params: {
                name: blogName,
            }
        });
        return parseInt(res.data);
    } catch (e) {
        console.error(e);
        return 0;
    }
}

