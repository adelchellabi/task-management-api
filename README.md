# Task Management API

Welcome to the Express TypeScript MongoDB API, a powerful solution for building robust and scalable web applications. This API leverages the Express.js framework, TypeScript language, and MongoDB database to provide a flexible and efficient backend architecture for your projects.

## Table of Contents

1. [Introduction](#introduction)
1. [Features](#features)
1. [Installation](#installation)
1. [Usage](#usage)
1. [API Documentation](#api-documentation)
1. [Managing Docker Containers](#managing-docker-containers)
1. [Running Tests](#running-tests)
1. [Contributing](#contributing)
1. [License](#license)

## Introduction

The Task Management API is designed to provide functionality for managing users and tasks in a web application. It offers features such as user registration, user authentication, task creation, task retrieval, and more.

## Features

**User Management:** Register new users, authenticate existing users, and manage user profiles.

**Task Management:** Create, retrieve, update, and delete tasks with ease. Task-related operations are handled using dedicated services, ensuring separation of concerns and maintainability.

**Role-Based Access Control:** Implement role-based access control (RBAC) to assign roles such as admin, super user, or regular user. Authentication and authorization are handled securely with JSON Web Tokens (JWT), ensuring that only authorized users can access protected endpoints.

**API Documentation:** Interactive API documentation provided via Swagger UI, allowing developers to explore and understand the available endpoints effortlessly.

**Docker Support:** Dockerized setup for easy deployment and scalability. The API can be containerized and deployed in any environment with minimal configuration, ensuring consistency across deployments.

**Clean Code Practices:** Codebase adheres to clean code practices, including meaningful variable names, modular structure, and consistent coding conventions. Code is organized logically and is easy to understand and maintain.

**Testing:** Comprehensive unit and integration tests validate the functionality of individual components and their interactions, ensuring the reliability and stability of the API.

**Data Validation:** Robust data validation mechanisms, including the use of DTOs (Data Transfer Objects), ensure that input data meets specified criteria.

**Custom Exception Handler:** The API features a custom exception handler that effectively manages and handles exceptions during runtime.

**Logger Integration:** The API is integrated with a logging mechanism to record and monitor various activities and events.

## Installation

To run the Task Management API locally, you'll need Docker and Docker Compose installed on your system.

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

1. Clone the repository:

- HTTPS :

  ```bash
   git clone https://github.com/adelchellabi/task-management-api.git
  ```

- SSH :

  ```bash
      git clone git@github.com:adelchellabi/task-management-api.git
  ```

2. Navigate to the project directory:

   ```bash
    cd task-management-api
   ```

3. Copy the env.example file to create a .env file:

   ```bash
   cp env.example .env
   ```

   This command creates a new .env file based on the provided example file. Make sure to fill in the necessary environment variables in the .env file with your own values.

4. Build and start the Docker containers:

   ```bash
    docker-compose up --build
   ```

5. Install dependecies:

   ```bash
    docker-compose exec app sh
    npm i
   ```

   The API will be accessible at http://localhost:3000.

## Usage

Once the server is running, you can interact with the API using HTTP requests. See the [API Documentation](#api-documentation) section for detailed information about available endpoints.

## API Documentation

The API documentation is available at `GET /api/v1/api-docs`, where you can interact with the API endpoints and view detailed information about each endpoint.

### Routes

![Screenshot from 2024-02-21 11-56-38](https://i.imgur.com/6aCtwFE.png)

#### Base Route

The base route for the endpoints is `/api/v1`.

#### User Routes

- `POST /users/register`: Register a new user.
- `POST /users/login`: Log in as an existing user.
- `GET /users`: Get a list of all users (requires admin role).
- `GET /users/id`: Get details of a specific user.
- `PATCH /users/id`: Update user details.
- `DELETE /users/id`: Delete a user.
- `GET /users/profile`: Get the profile of the currently logged-in user.
- `GET /users/profile/tasks`: Get tasks for the currently logged-in user.
- `GET /users/id/tasks`: Get tasks for a specific user.

#### Task Routes

- `POST /tasks`: Create a new task.
- `GET /tasks`: Get a list of all tasks (requires admin or super user role).
- `GET /tasks/id`: Get details of a specific task.
- `PATCH /tasks/id`: Update task details.
- `DELETE /tasks/id`: Delete a task.

### Generate Admin User via CLI

Before using the Task Management API, you can use the CLI command to generate an admin user. Follow these steps:

1. **Access Container Shell**: Ensure that your Docker Compose setup is running. If not, start it with the following command:

   ```bash
   docker-compose up -d
   ```

   Once Docker Compose is running, access the shell of the container where your application is running using the following command:

   ```bash
      docker-compose exec app sh
   ```

   Inside the container's shell, run the following CLI command to generate the admin user:

   ```bash
   npm run generate-admin admin@example.com adminPassword
   ```

   Replace "admin@example.com" with the desired email address for the admin user and "adminPassword" with the desired password.

## Managing Docker Containers

You can start and stop the Docker containers managed by Docker Compose using the following commands:

### Starting Containers

To start the Docker containers, use the following command:

```bash
docker-compose up
```

**Or**

```bash
docke-compose up -d
```

This command will start all the services defined in your docker-compose.yml file. If the containers are already running, this command will recreate and start them.

### Stoping Containers

To start the Docker containers, use the following command:

```bash
docker-compose down
```

This command will stop and remove all the containers, networks, and volumes defined in your **docker-compose.yml** file.

### Accessing Container Shell

If you need to access the shell of a specific container, you can use the following command:

```bash
docker-compose exec <service-name> sh
```

Replace "service-name" with the name of the service defined in your **docker-compose.yml** file. This command will open a bash shell inside the specified container.

## Running Tests

To run tests for this project, you can access the container and execute the test command. Follow these steps:

1. **Access Container Shell**: Ensure that your Docker Compose setup is running. If not, start it with the following command:

   ```bash
   docker-compose up
   ```

   Once Docker Compose is running, access the shell of the container where your application is running using the following command:

```bash
    docker-compose exec app sh
```

**Run All Tests**:
Inside the container's shell, run the following command to execute the tests:

```
npm run test
```

**Run Filtered Tests**:
Inside the container's shell, run the following command to execute tests related to the user module:

```bash
npm run test user
```

## Contributing

Contributions to the Task Management API are welcome! If you find any issues or have suggestions for improvements, feel free to open an issue or submit a pull request.

## License

This project is licensed under the MIT License.
