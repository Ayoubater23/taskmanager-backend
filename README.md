# Project Management App

A full-stack project management app with projects and tasks, built with **Java Spring Boot**, **React**, and **PostgreSQL**.  

---

## Tools Used
- **Backend:** Java Spring Boot  
- **Frontend:** React.js (Vite)  
- **Database:** PostgreSQL (via Docker Compose)  
- **Other:** Axios for API calls, Tailwind CSS for styling  

---

## Backend Setup
1. Navigate to the backend folder:  
   ```bash
   cd backend
   
2. Install dependencies and build the project:
   ```bash
   ./mvnw clean install
3. Run the backend server:
   ```bash
   ./mvnw spring-boot:run
## Frontend Setup
1. Navigate to the frontend folder:  
   ```bash
   cd frontend
2. Install dependencies:
   ```bash
   npm install
3. Start the frontend dev server:
   ```bash
   npm run dev
  Frontend runs by default at http://localhost:5173.
## Database Setup
1. Make sure Docker and Docker Compose are installed.
2. From the project root, start the database container:
   ```bash
   docker-compose up -d
3. This will automatically create the PostgreSQL container with the credentials and DB name defined in docker-compose.yml.
4. Ensure your backend application.properties matches these credentials.
## Features
-User authentication (login/register)
-Create, view, update, delete projects
-Project search/filter
-Create, update, complete, delete tasks
-Progress tracking per project
-Responsive UI with toast notifications

  
   
   
