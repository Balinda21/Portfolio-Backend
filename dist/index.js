import express from 'express';
import mongoose from 'mongoose';
import UserModel from './models/Users.js';
import BlogModel from './models/blogs.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import swaggerjsdoc from 'swagger-jsdoc';
import swaggerui from 'swagger-ui-express';
import cookieParser from 'cookie-parser';
import Joi from 'joi';
import cors from 'cors';
import ContactModel from './models/contact.js';
import CommentModel from './models/comments.js';
import { checkUser } from './middeware/isAdmin.auth.js';
import nodemailer from 'nodemailer';
dotenv.config();
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: ['https://rad-choux-159d26.netlify.app', 'http://127.0.0.1:5501', 'https://portfolio-backend-xewv.onrender.com'],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Portfolio api documentation",
            version: "1.0.0",
            description: "This application consists of a portfolio API developed using Express and detailed using Swagger documentation",
            contact: {
                name: "Maurice Kwizera Balinda",
                email: "balindamoris@gmail.com"
            }
        },
        servers: [
            {
                url: "http://localhost:3000"
            }
        ],
        components: {
            schemas: {
                User: {
                    type: "object",
                    properties: {
                        name: {
                            type: "string"
                        },
                        email: {
                            type: "string"
                        },
                        password: {
                            type: "string"
                        }
                    },
                    required: ["name", "email", "password"]
                },
                BlogPost: {
                    type: "object",
                    properties: {
                        picture: {
                            type: "string"
                        },
                        title: {
                            type: "string"
                        },
                        date: {
                            type: "string",
                            format: "date"
                        },
                        description: {
                            type: "string"
                        }
                    },
                    required: ["title", "description"]
                }
            },
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT"
                }
            }
        },
        security: [{ bearerAuth: [] }]
    },
    apis: ["./dist/*.js"] // Adjusted path to match route handler files
};
mongoose.connect('mongodb+srv://balinda:Famillyy123@cluster0.8izzdgk.mongodb.net/Tasks')
    .then(() => {
    const spacs = swaggerjsdoc(options);
    app.use('/backend-docs', swaggerui.serve, swaggerui.setup(spacs));
    console.log('Connected to database');
})
    .catch((error) => console.log(error));
// User routes
/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     description: Retrieve a list of all users.
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: Server Error
 */
app.get('/users', async (_req, res) => {
    try {
        const users = await UserModel.find();
        res.status(200).json(users);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});
/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     description: Retrieve a user by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: The requested user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       '404':
 *         description: User not found
 *       '500':
 *         description: Server Error
 */
app.get('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        // Find the user by ID in the database
        const user = await UserModel.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Send the fetched user as a JSON response
        res.status(200).json(user);
    }
    catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});
/**
 * @swagger
 * /edit/users/{id}:
 *   put:
 *     summary: Update a user
 *     description: Update the details of a user by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: The updated user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *       500:
 *         description: Server Error
 */
app.put('/edit/user/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email } = req.body;
        const user = await UserModel.findByIdAndUpdate(id, { name, email }, { new: true });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});
/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user
 *     description: Delete a user by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to delete
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: User deleted successfully
 *       500:
 *         description: Server Error
 */
app.delete('/delete/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await UserModel.findByIdAndDelete(id);
        res.status(204).send();
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});
/**
 * @swagger
 * /login:
 *   post:
 *     summary: Authenticate user
 *     description: Login with email and password to receive a JWT token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *                 name:
 *                   type: string
 *       401:
 *         description: Invalid email or password
 *       500:
 *         description: Failed to authenticate user
 */
// Define Joi schema for login fields
const loginSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'any.required': 'Email is required',
        'string.email': 'Email must be a valid email address'
    }),
    password: Joi.string().required().messages({
        'any.required': 'Password is required'
    })
});
app.post('/login', async (req, res) => {
    try {
        // Validate request body against Joi schema
        const validationResult = loginSchema.validate(req.body);
        if (validationResult.error) {
            // If validation fails, return error response
            return res.status(400).json({ message: validationResult.error.details[0].message });
        }
        const { email, password } = req.body;
        console.log('Login attempt with email:', email);
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        console.log('User found:', user);
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "default_secret", { expiresIn: '1d' });
        // Assuming you have retrieved the user's name from the database after successful login
        const userName = user.name;
        // Set the JWT token cookie
        res.cookie('token', token, { httpOnly: true, maxAge: 86400000 });
        res.cookie('user_name', userName, { maxAge: 86400000 });
        const test = req.cookies;
        // Send response
        res.status(200).json({ user: user, token: token });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to authenticate user' });
    }
});
/**
 * @swagger
 * /logout:
 *   post:
 *     summary: Logout user
 *     description: Clear the authentication token stored in the client's browser cookies.
 *     responses:
 *       200:
 *         description: Logged out successfully
 *       500:
 *         description: Server Error
 */
// Logout route
app.post('/logout', (req, res) => {
    try {
        // Clear the token cookie by setting it to an empty value and expiring it
        res.clearCookie('token');
        res.clearCookie('user_name');
        // Send a response indicating successful logout
        res.status(200).json({ message: 'Logged out successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});
/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user
 *     description: Register a new user with name, email, and password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - name
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Server Error
 */
// Define Joi schema for registration fields
const registerSchema = Joi.object({
    name: Joi.string().trim().required().messages({
        'any.required': 'Name is required',
        'string.empty': 'Name cannot be empty'
    }),
    email: Joi.string().trim().email().required().messages({
        'any.required': 'Email is required',
        'string.empty': 'Email cannot be empty',
        'string.email': 'Email must be a valid email address'
    }),
    password: Joi.string().min(8).required().pattern(new RegExp('^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$'))
        .messages({
        'any.required': 'Password is required',
        'string.empty': 'Password cannot be empty',
        'string.pattern.base': 'Password must contain at least one letter, one number, and be at least 8 characters long',
        'string.min': 'Password must be at least 8 characters long'
    })
});
// register router
app.post('/register', async (req, res) => {
    try {
        // Validate the request body against the Joi schema
        const validationResult = registerSchema.validate(req.body);
        if (validationResult.error) {
            // If validation fails, return an error response
            return res.status(400).json({ message: validationResult.error.details[0].message });
        }
        const { name, email, password } = req.body;
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email is already registered' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new UserModel({ name, email, password: hashedPassword });
        // Save the new user to the database
        await newUser.save();
        // Respond with the newly created user document
        res.status(201).json(newUser);
    }
    catch (error) {
        console.error('Error during user registration:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});
/**
 * @swagger
 *
 * /api/blogs:
 *   post:
 *     summary: Create a new blog post
 *     description: Create a new blog post with the specified details.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               picture:
 *                 type: string
 *               title:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *               description:
 *                 type: string
 *             required:
 *               - title
 *               - description
 *     responses:
 *       '201':
 *         description: The created blog post
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 blog:
 *                   $ref: '#/components/schemas/BlogPost'
 */
// Define route to add a new blog
app.post('/api/blogs', async (req, res) => {
    try {
        const { picture, title, date, description } = req.body;
        const newBlog = new BlogModel({
            picture,
            title,
            date,
            description
        });
        await newBlog.save();
        // Send response
        res.status(201).json({ message: 'Blog added successfully', blog: newBlog });
    }
    catch (error) {
        // Handle errors
        console.error('Error adding blog:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
/**
 * @swagger
 *
 * /api/get/blogs:
 *   get:
 *     summary: Get all blog posts
 *     description: Retrieve a list of all blog posts.
 *     responses:
 *       '200':
 *         description: A list of blog posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/BlogPost'
 */
// Define route to get all blogs
// app.get('*', );
app.get('/api/user', checkUser, (req, res) => {
    const user = res.locals.user;
    if (user) {
        res.status(200).json(user);
    }
    else {
        res.status(404).json({ error: 'User data not found' });
    }
});
app.get('/api/get/blogs', async (_req, res) => {
    try {
        const blogs = await BlogModel.find();
        res.status(200).json(blogs);
    }
    catch (error) {
        console.error('Error fetching blogs:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});
// edit 
app.post('/editProfile'), async (req, res) => {
    try {
        const { id } = req.params;
        const { username, email, password } = req.body;
        // Find user by ID using the User model
        const user = await UserModel.findById(id);
        if (!user) {
            return res.status(400).json({ error: 'User not found' });
        }
        else {
            // Update user information
            user.name = username || user.name;
            user.email = email || user.email;
            // If password is provided, update it
            if (password) {
                const salt = await bcrypt.genSalt();
                const hashPassword = await bcrypt.hash(password, salt);
                user.password = hashPassword;
            }
            await user.save(); // Save the updated user
            return res.status(200).json({ msg: 'User edited successfully', user });
        }
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
/**
 * @swagger
 * /api/singleblogs/{id}:
 *   get:
 *     summary: Get a single blog by ID
 *     description: Retrieve a single blog post by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the blog post to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: The requested blog post
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BlogPost'
 *       '404':
 *         description: Blog post not found
 *       '500':
 *         description: Server Error
 */
// Define route to get a single blog by ID
app.get('/api/singleblogs/:id', async (req, res) => {
    try {
        const { id } = req.params;
        // Find the blog by ID in the database
        const blog = await BlogModel.findById(id);
        if (!blog) {
            return res.status(404).json({ message: 'Blog post not found' });
        }
        // Send the fetched blog as a JSON response
        res.status(200).json(blog);
    }
    catch (error) {
        console.error('Error fetching blog:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});
/**
 * @swagger
 *
 * /api/blogs/{id}:
 *   put:
 *     summary: Update a blog post
 *     description: Update the details of a blog post by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the blog post to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               picture:
 *                 type: string
 *               title:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *               description:
 *                 type: string
 *             required:
 *               - title
 *               - description
 *     responses:
 *       '200':
 *         description: The updated blog post
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 blog:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     picture:
 *                       type: string
 *                     title:
 *                       type: string
 *                     date:
 *                       type: string
 *                       format: date
 *                     description:
 *                       type: string
 *               required:
 *                 - message
 *                 - blog
 */
app.put('/api/blogs/edit/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { picture, title, date, description } = req.body;
        // Find the blog by id
        const blog = await BlogModel.findById(id);
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        // Update the blog fields
        if (picture)
            blog.picture = picture;
        if (title)
            blog.title = title;
        if (date)
            blog.date = date;
        if (description)
            blog.description = description;
        // Save the updated blog
        await blog.save();
        // Send response
        res.json({ message: 'Blog updated successfully', blog });
    }
    catch (error) {
        console.error('Error updating blog:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
/**
 * @swagger
 *
 * /api/blogs/delete/{id}:
 *   delete:
 *     summary: Delete a blog post
 *     description: Delete a blog post by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the blog post to delete
 *         schema:
 *           type: string
 *     responses:
 *       '204':
 *         description: Blog post deleted successfully
 */
// Define route to delete a blog by ID
app.delete('/api/blogs/delete/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedBlog = await BlogModel.findByIdAndDelete(id);
        if (!deletedBlog) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        res.status(204).send();
    }
    catch (error) {
        console.error('Error deleting blog:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});
/**
 * @swagger
 * /submit-contact-form:
 *   post:
 *     summary: Submit contact form
 *     description: Submit a contact form with name, email, subject, and message
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               subject:
 *                 type: string
 *               message:
 *                 type: string
 *             required:
 *               - name
 *               - email
 *               - subject
 *               - message
 *     responses:
 *       200:
 *         description: Contact form submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 Contact:
 *                   $ref: '#/components/schemas/Contact'
 *       500:
 *         description: Server Error
 */
//  Joi schema for contact form fields
const contactSchema = Joi.object({
    name: Joi.string().required().messages({
        'any.required': 'Name is required'
    }),
    email: Joi.string().email().required().messages({
        'any.required': 'Email is required',
        'string.email': 'Email must be a valid email address'
    }),
    subject: Joi.string().required().messages({
        'any.required': 'Subject is required'
    }),
    message: Joi.string().required().messages({
        'any.required': 'Message is required'
    })
});
app.post('/submit-contact-form', async (req, res) => {
    try {
        // Validate request body against Joi schema
        const { error } = contactSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.message });
        }
        // Extract form data validated request body
        const { name, email, subject, message } = req.body;
        try {
            const newContact = new ContactModel({
                name,
                email,
                subject,
                message
            });
            console.log(newContact);
            await newContact.save();
            res.status(200).json({ message: 'Contact form submitted successfully', Contact: newContact });
        }
        catch (error) {
            console.error('Error saving contact:', error);
            res.status(500).json({ message: 'Failed to submit contact form' });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});
/**
 * @swagger
 * /api/get/contacts:
 *   get:
 *     summary: Get all contact entries
 *     description: Retrieve a list of all contact entries.
 *     responses:
 *       '200':
 *         description: A list of contact entries
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Contact'
 *       '500':
 *         description: Server Error
 */
// Define route to get all contact entries
app.get('/api/get/contacts', async (_req, res) => {
    try {
        // Fetch all contact entries from the database
        const contacts = await ContactModel.find();
        // Return the fetched contacts as a JSON response
        res.status(200).json(contacts);
    }
    catch (error) {
        // Handle errors
        console.error('Error fetching contacts:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});
// Define route to get all contact entries
app.get('/api/get/contacts', async (_req, res) => {
    try {
        // Fetch all contact entries from the database
        const contacts = await ContactModel.find();
        // Return the fetched contacts as a JSON response
        res.status(200).json(contacts);
    }
    catch (error) {
        // Handle errors
        console.error('Error fetching contacts:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});
/**
 * @swagger
 * /api/comments:
 *   post:
 *     summary: Add a new comment
 *     description: Add a new comment to a post.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *             required:
 *               - text
 *     responses:
 *       '201':
 *         description: New comment added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 comment:
 *                   $ref: '#/components/schemas/Comment'
 *       '500':
 *         description: Server error
 *
 * /api/get/comments/:
 *   get:
 *     summary: Get comments for a post
 *     description: Retrieve all comments for a specific post.
 *     parameters:
 *       - in: path
 *         required: true
 *         description: ID of the post to retrieve comments for
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: List of comments for the specified post
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comment'
 *       '500':
 *         description: Server error
 *
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       properties:
 *         text:
 *           type: string
 *       required:
 *         - text
 */
app.post('/api/comments', async (req, res) => {
    try {
        const { text, name } = req.body;
        // Create a new comment document
        const newComment = new CommentModel({ text, name });
        // Save the new comment to the database
        await newComment.save();
        // Send response
        res.status(201).json({ message: 'Comment added successfully', comment: newComment });
    }
    catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
// Define endpoint to get all comments for a specific post
app.get('/api/get/comments/', async (req, res) => {
    try {
        // Find all comments for the specified post
        const comments = await CommentModel.find({});
        res.status(200).json(comments);
    }
    catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});
/**
 * @swagger
 * /api/comments/{blogId}:
 *   get:
 *     summary: Get comments by ID
 *     description: Retrieve comments for a specific blog post by its ID.
 *     parameters:
 *       - in: path
 *         name: blogId
 *         required: true
 *         description: ID of the blog post
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: List of comments for the specified post
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comment'
 *       '500':
 *         description: Server error
 *
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       properties:
 *         text:
 *           type: string
 */
// get comments by id
app.get('/api/comments/:blogId', async (req, res) => {
    try {
        const blogId = req.params.blogId;
        const comments = await CommentModel.find({ postId: blogId });
        res.status(200).json(comments);
    }
    catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
/**
 * @swagger
 * /api/blog/{id}/like:
 *   post:
 *     summary: Like a blog post
 *     description: Like a specific blog post by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the blog post
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Blog post liked successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 likes:
 *                   type: number
 *                   description: The number of likes after the like action
 *       '404':
 *         description: Blog post not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message indicating the blog post was not found
 *       '500':
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message indicating a server error occurred
 */
app.post('/api/blog/:id/like', async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await BlogModel.findById(postId);
        if (!post) {
            return res.status(404).json({ error: 'Blog post not found' });
        }
        // Increment likes count
        post.likes++;
        await post.save();
        res.json({ likes: post.likes });
    }
    catch (error) {
        console.error("Error handling like:", error);
        res.status(500).json({ error: "An error occurred while processing your request." });
    }
});
/**
 * @swagger
 * /send-email:
 *   post:
 *     summary: Send email
 *     description: Send an email with the provided details.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Sender's name
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Sender's email address
 *               subject:
 *                 type: string
 *                 description: Email subject
 *               message:
 *                 type: string
 *                 description: Email message
 *     responses:
 *       '200':
 *         description: Email sent successfully
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Email sent successfully
 *       '500':
 *         description: Server error
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Error sending email
 */
// Route to send email
app.post('/send-email', (req, res) => {
    const { name, email, subject, message } = req.body;
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER, // Use environment variable for Gmail address
            pass: process.env.EMAIL_PASSWORD
        }
    });
    const recipientEmail = "balindamoris@gmail.com"; // Predefined recipient email address
    const mailOptions = {
        from: `"${name}" <${email}>`,
        to: recipientEmail,
        subject: subject,
        html: `<p>Message from: ${name} &lt;${email}&gt;</p><p>Message: ${message}</p>`
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.status(500).send('Error sending email');
        }
        else {
            console.log("Email sent: " + info.response);
            res.status(200).send('Email sent successfully');
        }
    });
});
/**
 * @swagger
 * /subscribe:
 *   post:
 *     summary: Subscribe to newsletter
 *     description: Subscribe to the newsletter using the provided email address.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email address for subscription
 *     responses:
 *       '200':
 *         description: Subscription successful
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Subscription successful. Please check your email for confirmation.
 *       '500':
 *         description: Server error
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: An error occurred. Please try again later.
 */
// subscribe 
app.post('/subscribe', async (req, res) => {
    const { email } = req.body;
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER, // Use environment variable for Gmail address
            pass: process.env.EMAIL_PASSWORD
        }
    });
    const confirmationMailOptions = {
        from: `<${email}>`,
        to: email,
        subject: 'Subscription Confirmation',
        text: 'Thank you for subscribing to our newsletter.'
    };
    try {
        await transporter.sendMail(confirmationMailOptions);
        console.log('Confirmation email sent to:', email);
        res.send('Subscription successful. Please check your email for confirmation.');
    }
    catch (error) {
        console.error('Error sending confirmation email:', error);
        res.status(500).send('An error occurred. Please try again later.');
    }
    const notificationMailOptions = {
        from: `<${email}>`,
        to: 'balindamoris@gmail.com',
        subject: 'New Newsletter Subscription',
        text: `A new user subscribed to the newsletter: ${email}`
    };
    try {
        await transporter.sendMail(notificationMailOptions);
        console.log('Notification email sent to admin');
    }
    catch (error) {
        console.error('Error sending notification email:', error);
    }
});
// edit profile
app.get('/profile', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, password } = req.body;
        const user = await UserModel.findById(id);
        if (!user) {
            return res.status(400).json('There is no user');
        }
        else {
            user.name = name || user.name;
            user.email = email || user.email;
            if (password !== null && password !== undefined && password.trim() !== '') {
                const salt = await bcrypt.genSalt();
                const hashpassword = await bcrypt.hash(password, salt);
                user.password = hashpassword;
                console.log(user.password, { "changed password": password });
            }
            else {
                user.password = user.password;
            }
            await user.save();
            return res.status(200).json({ msg: 'Edited successfully' });
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
export default app;
//# sourceMappingURL=index.js.map