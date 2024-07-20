import express, { Request, Response } from "express";
import cors from "cors"
import bodyParser from "body-parser";
import { PORT } from "./constants";
import { connectDB } from "./connectDB";
import { Users } from "./models/users";

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "Express JS, MongoDB",
    endpoints: [
      { users: "/users", method: "GET" },
      { user: "/users/:id", method: "GET" },
      { createUser: "/users", method: "POST" },
      { updateUser: "/users/:id", method: "PUT" },
      { deleteUser: "/users/:id", method: "DELETE" },
    ]
  })
});
//Create a new user
app.post("/users", async (req: Request, res: Response) => {
  try {
    const newUser = new Users(req.body);
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(400).json({ message: "User not created" });
  }
});
//Get all users
app.get("/users", async (req: Request, res: Response) => {
  const users = await Users.find();
  res.json(users);
});
//Get a user by id
app.get("/users/:id", async (req: Request, res: Response) => {
  try {
    const user = await Users.findById(req.params.id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "User not found" });
  }
});
//Update a user by id
app.put("/users/:id", async (req: Request, res: Response) => {
  try {
    const user = await Users.findByIdAndUpdate(req.params.id, req.body);
    if (!user) {
      res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: "Failed to update user" });
  }
});
//Delete a user by id
app.delete("/users/:id", async (req: Request, res: Response) => {
  try {
    const user = await Users.findByIdAndDelete(req.params.id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete user" });
  }
});

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`);
    })
  });
