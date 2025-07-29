import {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
  } from '../service/user.service.js';
  
  export const getUsers = async (req, res) => {
    const users = await getAllUsers();
    res.json(users);
  };
  
  export const getUser = async (req, res) => {
    const user = await getUserById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  };
  
  export const addUser = async (req, res) => {
    const { email, name, role } = req.body;
    try {
      const user = await createUser({ email, name, role });
      res.status(201).json(user);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };
  
  export const updateUserController = async (req, res) => {
    const { id } = req.params;
    try {
      const user = await updateUser(id, req.body);
      res.json(user);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };
  
  export const deleteUserController = async (req, res) => {
    const { id } = req.params;
    try {
      await deleteUser(id);
      res.json({ message: 'User deleted' });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };
  