# Rule Engine with Abstract Syntax Tree (AST)

This project implements a rule evaluation engine using AST (Abstract Syntax Tree) to define and apply custom rules on data inputs. The app allows users to create, view, and evaluate rules using a web interface.

## Features
- Create dynamic rules using user-defined inputs.
- Evaluate data based on a single rule or all rules.
- Display the results of rule evaluations on the UI.

## Project Structure
- **Client**: React frontend for user interaction.
- **Server**: Express.js backend for rule storage and evaluation.
- **Database**: MongoDB for storing rules.

## Design Choices
- **Abstract Syntax Tree (AST)**: The rules are parsed into an AST to allow complex rule conditions and better evaluation control.
- **React for Frontend**: Used to build an interactive UI to create and evaluate rules.
- **Express for Backend**: Manages API requests for creating and evaluating rules.
- **MongoDB**: Stores all the created rules and allows for dynamic querying during rule evaluations.

## Installation

### Prerequisites
- Node.js (v14 or later)
- MongoDB (Local or Atlas)
- Git

### Steps to Set Up

1. **Clone the Repository**:
    ```bash
    git clone https://github.com/Sayan-sss/Rule_Engine_With_AST.git
    cd Rule_Engine_With_AST
    ```

2. **Set Up the Server**:
    - Navigate to the `server` directory:
        ```bash
        cd server
        ```
    - Install dependencies:
        ```bash
        npm install
        ```
    - Set up your environment variables (MongoDB URL):
        ```bash
        touch .env
        ```
      Add the following to your `.env` file:
        ```bash
        MONGO_URL=<your-mongodb-url>
        PORT=5000
        ```
    - Start the server:
        ```bash
        npm start
        ```

3. **Set Up the Client**:
    - Navigate to the `client` directory:
        ```bash
        cd client
        ```
    - Install dependencies:
        ```bash
        npm install
        ```
    - Start the React development server:
        ```bash
        npm start
        ```

### Access the Application
Once both servers are running, access the app at [http://localhost:3000](http://localhost:3000).

## Dependencies
- **Client**:
  - React
  - Axios
- **Server**:
  - Express.js
  - Mongoose (for MongoDB)
  - AST (Abstract Syntax Tree) parser

## API Endpoints
- **POST /create-rule**: Creates a new rule.
- **GET /api/rules**: Fetches all existing rules.
- **POST /evaluate-rule**: Evaluates data against a single rule.
- **POST /evaluate-all-rules**: Evaluates data against all rules.

## Running Tests
No specific tests are included yet, but you can manually test by creating and evaluating rules through the UI.

## Future Enhancements
- Adding validation for complex rule structures.
- Implementing user authentication for rule management.
- Expanding rule types and conditions.
