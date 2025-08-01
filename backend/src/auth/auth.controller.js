import { registerUser, loginUser } from "./auth.service.js";

export const register = async (req, res) => {
  const { email, password, name } = req.body;
  
  try {
    const result = await registerUser(email, password, name);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const result = await loginUser(email, password);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
