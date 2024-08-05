import express, { Request, Response, NextFunction } from "express";
import cors from "cors"
import bodyParser from "body-parser";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PORT } from "./constants";
import { connectDB } from "./connectDB";
import { Users, IUser } from "./models/users";
import { error } from "console";

interface CustomRequest extends Request {
  user?: IUser;

}
const app = express();
const secretKey = "store";
app.use(bodyParser.json());
app.use(cors());

const authenticateToken = (req: CustomRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);
  jwt.verify(token, secretKey, (err, user) => {   
    if (err) return res.sendStatus(403);
    req.user = user as IUser;
    next();
  });
};

app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "Express JS, MongoDB",
    endpoints: [
      { users: "/users", method: "GET" },
      { user: "/users/:id", method: "GET" },
      { createUser: "/users", method: "POST" },
      { updateUser: "/users/:id", method: "PUT" },
      { deleteUser: "/users/:id", method: "DELETE" },
      { register: "/register", method: "POST" },
      { login: "/login", method: "POST" },
      { logout: "/logout", method: "POST" },
    ]
  })
});

//Get all users
app.get("/users", authenticateToken, async (req: CustomRequest, res: Response) => {
  try {
    const users = await Users.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
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
//Register a new user 
app.post("/register", async (req: Request, res: Response) => {
  try {
    const { username, password, name } = req.body;

    const existingUser = await Users.findOne({ username });
    //check User 
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" })
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log(hashedPassword);
    const user = new Users({ username, password: hashedPassword, name });
    console.log(user);
    await user.save();
    res.json({ message: "User registered" });
  } catch (error) {
    res.status(400).json({ message: "Failed to register user" });
  }
});
//Login a user
app.post("/login", async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const user = await Users.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ userId: user._id }, secretKey, { expiresIn: "1h" });
    res.json({ message: "Login successful", token });
  } catch (error) {
    res.status(400).json({ message: "Failed to login" });
  }
});
app.post("/logout", (req: Request, res: Response) => {
  
  res.json({ message: "Logout successful" })
})

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`);
    })
  });
