# Express.js and MongoDB API

This project is a simple CRUD API built with Express.js and MongoDB. It allows you to create, read, update, and delete users.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Endpoints](#endpoints)

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/your-username/your-repo.git
    ```

2. Navigate to the project directory:

    ```bash
    cd your-repo
    ```

3. Install the dependencies:

    ```bash
    npm install
    ```


## Usage

To start the server, run the following command:

```bash
npm start
```

## Endpoints
Base URL: http://localhost:3000
GET / - Welcome message and available endpoints.

GET /users - Get all users.

GET /users/:id - Get a user by ID.

POST /users - Create a new user.

PUT /users/:id - Update a user by ID.

DELETE /users/:id - Delete a user by ID.

## Sample User Object

```json
{
  "name": "John Doe",
  "age": 30
}
```
