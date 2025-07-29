import * as likeService from '../service/like.service.js';

export const createLike = async (req, res) => {
  try {
    const like = await likeService.createLike(req.body);
    res.status(201).json(like);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllLikes = async (req, res) => {
  try {
    const likes = await likeService.getAllLikes();
    res.json(likes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getLikeById = async (req, res) => {
  try {
    const like = await likeService.getLikeById(req.params.id);
    if (!like) return res.status(404).json({ error: 'Like not found' });
    res.json(like);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteLike = async (req, res) => {
  try {
    await likeService.deleteLike(req.params.id);
    res.json({ message: 'Like deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getLikesByPostId = async (req, res) => {
  try {
    const likes = await likeService.getLikesByPostId(req.params.postId);
    res.json(likes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
