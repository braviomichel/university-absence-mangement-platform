# University Absence Management Platform

This repository contains the codebase for a University Absence Management Platform developed as a year-end project during a training program. The platform aims to facilitate the management of absences within a university setting, catering to three main user roles: students, administrators, and professors. The project is divided into two main directories: `frontend` and `backend`, representing the frontend and backend components respectively. The frontend is implemented using React, while the backend utilizes Python with the Django framework.

## Project Overview

The University Absence Management Platform serves as a centralized system for handling absence-related tasks within the university. It provides the following functionalities based on user roles:

- **Student**:
  - View personal absence records and history.
- **Administrator**:

  - View and manage absence records for all students.
  - Perform administrative tasks related to absence management, such as adding or removing students and professors.

- **Professor**:
  - Mark student absences.
  - View absence records of students enrolled in their courses.

## Repository Structure

The repository is structured as follows:

- **frontend/**: Contains the frontend codebase implemented using React. This directory includes components, pages, styles, and other frontend-related files.
- **backend/**: Contains the backend codebase implemented using Python with the Django framework. This directory includes Django apps, models, views, serializers, and API endpoints.

## Getting Started

To set up and run the project locally, follow these steps:

1. **Clone the Repository**: Clone this repository to your local machine using `git clone`.

2. **Backend Setup**:

   - Navigate to the `backend` directory.
   - Create and activate a virtual environment.
   - Install dependencies from the `requirements.txt` file.
   - Run database migrations using `python manage.py migrate`.
   - Start the Django development server using `python manage.py runserver`.

3. **Frontend Setup**:

   - Navigate to the `frontend` directory.
   - Install dependencies using `npm install`.
   - Start the React development server using `npm start`.

4. **Access the Application**: Once both backend and frontend servers are running, access the application through the provided URL (typically http://localhost:3000).

## Technologies Used

- **Frontend**:

  - React: JavaScript library for building user interfaces.
  - React Router: Declarative routing for React applications.
  - Axios: Promise-based HTTP client for making API requests.
  - Material-UI: Frontend component libraries for styling and UI design.

- **Backend**:
  - Django: High-level Python web framework for rapid development and clean, pragmatic design.
  - Django REST Framework: Powerful and flexible toolkit for building Web APIs in Django.
  - SQLite : Relational database management systems used for data storage.
  - Swagger: API documentation tool for describing and visualizing RESTful APIs.

## License

This project is licensed under the [MIT License](LICENSE).

---

This README provides an overview of the University Absence Management Platform project, detailing its functionalities, repository structure, setup instructions, technologies used, contribution guidelines, and acknowledgments. For further inquiries or collaboration opportunities, please contact the authors.
