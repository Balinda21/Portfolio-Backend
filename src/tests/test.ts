import { expect } from 'chai';
import request from 'supertest';
import app from '../index.js'; 

after(function() {
  process.exit();
});
describe('Testing backend endpoints', () => {
  it('should return all blog posts', async function() {
    this.timeout(5000); // Increase timeout to 5000ms
    const resGetBlogs = await request(app).get('/api/get/blogs');
    expect(resGetBlogs.status).to.equal(200);
    expect(resGetBlogs.body).to.be.an('array');
  }).timeout(5000); // Apply timeout directly to the test case
  

  it('should create, update, and delete a blog post', async () => {
    // Create a new blog post
    const newBlogData = {
      picture: 'https://example.com/image.jpg',
      title: 'New Blog Post',
      date: '2024-04-02',
      description: 'This is a new blog post.'
    };
    const resCreateBlog = await request(app)
      .post('/api/blogs')
      .send(newBlogData);
    expect(resCreateBlog.status).to.equal(201);
    expect(resCreateBlog.body).to.have.property('message', 'Blog added successfully');
    expect(resCreateBlog.body).to.have.property('blog');

    // Update the blog post
    const updatedBlogData = {
      title: 'Updated Blog Post',
      description: 'This is the updated blog post.'
    };
    const resUpdateBlog = await request(app)
      .put(`/api/blogs/edit/${resCreateBlog.body.blog._id}`)
      .send(updatedBlogData);
    expect(resUpdateBlog.status).to.equal(200);
    expect(resUpdateBlog.body).to.have.property('message', 'Blog updated successfully');
    expect(resUpdateBlog.body).to.have.property('blog');

    // Delete the blog post
    const resDeleteBlog = await request(app)
      .delete(`/api/blogs/delete/${resCreateBlog.body.blog._id}`);
    expect(resDeleteBlog.status).to.equal(204);
  });

  it('should submit a contact form', async () => {
    const contactFormData = {
      name: 'balinda maurice',
      email: 'balindamoris@gmail.com',
      subject: 'Test Subject',
      message: 'Test message'
    };
    const resSubmitContactForm = await request(app)
      .post('/submit-contact-form')
      .send(contactFormData);
    expect(resSubmitContactForm.status).to.equal(200);
    expect(resSubmitContactForm.body).to.have.property('message', 'Contact form submitted successfully');
    expect(resSubmitContactForm.body).to.have.property('Contact');
  });

  it('should logout a user', async () => {
    // Send logout request
    const resLogout = await request(app)
      .post('/logout');

    // Assert the response
    expect(resLogout.status).to.equal(200);
    expect(resLogout.body).to.have.property('message', 'Logged out successfully');
  });

  it('should register a new user', async () => {
    // Prepare registration data
    const registrationData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'testpassword'
    };

    // Send registration request

    const resRegister = await request(app)
      .post('/register')
      .send(registrationData);

    // Assert the response
    expect(resRegister.status).to.equal(201);
    expect(resRegister.body).to.have.property('name', registrationData.name);
    expect(resRegister.body).to.have.property('email', registrationData.email);
    // Assuming you return the user object in the registration response
  });
});
