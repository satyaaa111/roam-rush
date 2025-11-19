# 🗺️ Roam Rush

**Roam Rush** is a modern application built to help users manage their travel plans, social interactions, and essential data using a robust microservices architecture leveraging both SQL and NoSQL databases.

## 🌟 Features

* **Dual Database Power:** Utilizes **PostgreSQL** for relational data and **MongoDB** for flexible, social-focused data.
* **Containerized Environment:** Fully containerized using **Docker** and **Docker Compose** for easy setup and consistent environments.
* **Secure Authentication:** Implements JWT-based secret for secure user authentication.

---

## 🚀 Getting Started

Follow these steps to set up and run the Roam Rush application locally.

### 📋 Prerequisites

Before you begin, ensure you have the following installed on your device:

* **Docker Desktop** (Must be running for the application to work)
* **Git**

### 🔧 Installation and Setup

1.  **Clone the Repository**
    ```bash
    git clone <github_link>
    ```

2.  **Navigate to the Project Directory**
    ```bash
    cd roam-rush
    ```

3.  **Configure Environment Variables**

    Create a file named `.env` in the root directory (`roam-rush`) and configure it as follows. **Replace `<your_secret>` with a strong, unique secret key.**

    ```env
    # --- PostgreSQL Configuration ---
    POSTGRES_USER=user
    POSTGRES_PASSWORD=password
    POSTGRES_DB=roamrush_db

    # --- MongoDB Configuration ---
    MONGO_INITDB_ROOT_USERNAME=mongo_username
    MONGO_INITDB_ROOT_PASSWORD=mongo_pwd

    # --- Backend Service Configuration ---
    DB_USER=user
    DB_PASS=password
    DB_HOST=postgres
    DB_PORT=5432
    DB_NAME=roamrush_db
    
    MONGO_USER=mongo_username
    MONGO_PASS=mongo_pwd
    MONGO_HOST=mongo
    MONGO_PORT=27017
    MONGO_DB_NAME=roamrush_social

    # --- Security ---
    JWT_SECRET=<your_secret> 
    ```

4.  **Run Docker Desktop**

    Ensure **Docker Desktop is open and running** before proceeding to the next steps.

5.  **Build the Containers**

    Open your Command Line Interface (CLI) in the project root and run:
    ```bash
    docker-compose build
    ```

6.  **Run the Containers**

    Upon successful building, start the application services:
    ```bash
    docker-compose up
    ```

7.  **Verify Running Containers**

    The setup should result in **4 running containers**. To check their status, open a new CLI window and run:
    ```bash
    docker ps
    ```

---

## 💻 Contribution Guidelines

We welcome contributions! To start working on a new feature or fix:

1.  **Create a Feature Branch**
    ```bash
    git checkout -b <branch_name>
    ```

2.  **Make your Changes**

3.  **Stage and Commit Changes**
    ```bash
    git add .
    git commit -m "feat: <meaningful update message>"
    ```

4.  **Push to the Remote Repository**
    ```bash
    git push origin <branch_name>
    ```

---

## 📄 License

(Add a standard license, e.g., MIT License, here)
