##Marketplace API
This is a Node.js API for a marketplace application. It allows users to register, login, and manage text entries. Users can also upload CSV files to create text entries in bulk.

Features:

User registration and login with role-based authorization (seller)
Uploading CSV files to create text entries
CRUD operations on text entries (create, read, update, delete)
JWT authentication for secure access
Tech Stack:

Node.js
Express.js
MySQL
Body-parser
bcrypt *jsonwebtoken
cors
multer
csvtojson
Installation:

##Clone this repository.
Install dependencies: npm install
Configuration:

Update the db configuration in index.js with your MySQL connection details.
Replace the secret key (SECRET_KEY) in index.js with a strong, unique secret.
Running the application:

Start the server: node index.js
The API will be accessible on http://localhost:8000
API Endpoints:

POST /register: Register a new user with username, password, and role (seller).
POST /login: Login a user with username and password. Returns a JWT token on successful login.
POST /texts (Authorized, Seller only): Upload a CSV file to create text entries. Requires a JWT token in the authorization header.
GET /texts (Authorized): Get a list of all text entries. Requires a JWT token in the authorization header.
PUT /texts/:id (Authorized, Seller only): Update a text entry by ID. Requires a JWT token in the authorization header.
DELETE /texts/:id (Authorized, Seller only): Delete a text entry by ID. Requires a JWT token in the authorization header.
Note: This is a basic example and may require further development and security considerations for production use.
