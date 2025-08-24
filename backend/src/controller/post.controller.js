import {
    getAllPosts,
    getPostsByAuthorId,
    getPostById,
    createPost,
    updatePost,
    deletePost,
  } from '../service/post.service.js';
  
  export const getPosts = async (req, res) => {
    const posts = await getAllPosts();
    res.json(posts);
  };
  
  export const getPost = async (req, res) => {
    const post = await getPostById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post);
  };
  
  export const addPost = async (req, res) => {
    const { title, content, problem, description, location, authorId, published } = req.body;
    try {
      const post = await createPost({
        title,
        content,
        problem,
        description,
        location,
        authorId,
        published
      });
      res.status(201).json(post);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };

  export const getPostsById = async (req, res) => {
    try {
      const posts = await postService.getPostsByAuthorId(parseInt(req.params.authorId));
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  
  export const updatePostController = async (req, res) => {
    const { id } = req.params;
    try {
      const post = await updatePost(id, req.body);
      res.json(post);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };
  
  export const deletePostController = async (req, res) => {
    const { id } = req.params;
    try {
      await deletePost(id);
      res.json({ message: 'Post deleted' });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };
  