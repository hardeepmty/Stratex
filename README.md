# Marketplace Application

The Marketplace Application is a web-based platform designed to facilitate buying and selling of various items. It provides features for user registration, authentication, text data management, and more.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Endpoints](#endpoints)
- [Contributing](#contributing)
- [License](#license)

## Features

- User registration and login with authentication.
- Uploading CSV files to create text data.
- Viewing all text data.
- Updating and deleting text data.
- Role-based authorization for text management (seller role).

## Installation

To set up the Marketplace Application on your local machine, follow these steps:

1. **Clone the repository:**

    ```bash
    git clone https://github.com/your_username/marketplace.git
    ```

2. **Install dependencies:**

    ```bash
    cd marketplace
    npm install
    ```

3. **Set up the database:**

   - Ensure you have MySQL installed and running on your machine.
   - Create a new database named `marketplace`.
   - Import the database schema from `database/schema.sql` into your MySQL database.

4. **Configure environment variables:**

    Create a `.env` file in the root directory and add the following variables:

    ```plaintext
    SECRET_KEY=your_secret_key
    ```

## Usage

To start the server, run:

```bash
npm start
