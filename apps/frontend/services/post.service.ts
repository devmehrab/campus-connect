import { fetcher } from "../lib/fetcher";

export const PostService = {
  getFeed: async (page = 1, limit = 10) => {
    return await fetcher<any>(`/posts/feed?page=${page}&limit=${limit}`, {
      method: "GET",
    });
  },

  likePost: async (postId: string) => {
    return await fetcher<any>(`/posts/${postId}/like`, {
      method: "PUT",
    });
  },
};
