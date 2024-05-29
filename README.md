# Marketplace Application

This is a marketplace application built using Node.js, Express.js, MySQL, and several other libraries. The application follows the MVC (Model-View-Controller) architecture for better organization and maintainability.

## Features

- User registration and authentication with JWT
- Role-based access control
- File upload (CSV) and processing
- CRUD operations for texts

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js (version 14.x or later)
- MySQL (version 8.x or later)
- npm (Node package manager, which comes with Node.js)

## Installation

1. **Clone the repository:**

    ```bash
    git clone https://github.com/yourusername/marketplace-app.git
    cd marketplace-app
    ```

2. **Install the dependencies:**

    ```bash
    npm install
    ```

3. **Setup the MySQL database:**

    - Create a new database called `marketplace`.

    ```sql
    CREATE DATABASE marketplace;
    ```

    - Create a `users` table:

    ```sql
    CREATE TABLE users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(255) NOT NULL,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(50) NOT NULL
    );
    ```

    - Create a `texts` table:

    ```sql
    CREATE TABLE texts (
      id INT AUTO_INCREMENT PRIMARY KEY,
      content TEXT NOT NULL,
      createdBy INT,
      FOREIGN KEY (createdBy) REFERENCES users(id)
    );
    ```

4. **Configure the database connection:**

    - Open `config/db.js` and update the database connection details if necessary.

    ```javascript
    const db = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'YourMySQLPassword',
      database: 'marketplace'
    });
    ```

5. **Start the server:**

    ```bash
    npm start
    ```

    The server should now be running on `http://localhost:8000`.

## Project Structure

```plaintext
project/
│
├── config/
│   └── db.js
│
├── controllers/
│   ├── authController.js
│   └── textController.js
│
├── models/
│   ├── User.js
│   └── Text.js
│
├── middleware/
│   ├── auth.js
│
├── routes/
│   ├── authRoutes.js
│   └── textRoutes.js
│
├── app.js
