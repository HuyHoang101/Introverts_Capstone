import {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
  } from '../service/user.service.js';
import bcrypt from "bcryptjs";
  
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
    try {
      const { email, name, role, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
      }

      const hashedPassword = await bcrypt.hash(password, 8);

      const user = await createUser({
        email,
        name,
        role: role || "USER",
        password: hashedPassword,
      });

      // Remove password from response
      const { password: _, ...safeUser } = user;

      res.status(201).json(safeUser);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };
  
  export const updateUserController = async (req, res) => {
    const { id } = req.params;
    const { password } = req.body;
    if (password) {
      req.body.password = await bcrypt.hash(password, 8);
    }
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
  