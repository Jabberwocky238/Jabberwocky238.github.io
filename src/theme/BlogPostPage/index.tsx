import React, { useEffect } from 'react';
import BlogPostPage from '@theme-original/BlogPostPage';
import type BlogPostPageType from '@theme/BlogPostPage';
import type {WrapperProps} from '@docusaurus/types';
import axios from 'axios';

type Props = WrapperProps<typeof BlogPostPageType>;

const BASE_API_JW238 = 'http://api.jw238.site/feedback/blog/visit';

async function increBlogPost(blogName: string, blogRoute: string) {
  const base64blogRoute = window.btoa(blogRoute);
  try {
    await axios.get(`${BASE_API_JW238}`, {
      params: {
        name: blogName,
        link: base64blogRoute,
      }
    })
  } catch (error) {
    console.error('Error in increBlogPost', blogName, error);
  }
}

export default function BlogPostPageWrapper(props: Props): JSX.Element {
  // console.log('BlogPostPageWrapper', props);
  const blogRoute = props.content.metadata.permalink;
  const blogPath = blogRoute.split('/');
  const blogName = blogPath[blogPath.length - 1];

  useEffect(() => {
    increBlogPost(blogName, blogRoute)
  }, []);

  return (
    <>
      <BlogPostPage {...props} />
    </>
  );
}
