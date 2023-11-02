# Internship Project Management

This web application serves as a comprehensive platform to manage and display various internship projects. Users can seamlessly add new projects, edit existing ones, and delete them as per requirement. The application is designed to be user-friendly, ensuring a smooth user experience.

## Table of Contents
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Setup and Installation](#setup-and-installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Features

### **Add New Project**
Users can introduce new projects by providing relevant details, enhancing the diversity of projects showcased.

### **Edit Project**
The platform allows users to make modifications to existing project details, ensuring that all information is up-to-date.

### **Delete Project**
Users have the flexibility to remove projects from the list if they are no longer relevant or needed.

### **View Projects**
All projects are easily accessible and displayed on the main page, complete with options to edit or delete as needed.

## Technologies Used

- **React.js**: Utilized for building the user interface and handling the state of the application.
- **Firebase**: Employed as the backend service to store and manage the project data.
- **Material-UI**: A React UI framework used for designing a smooth and responsive user interface.
- **React-Modal**: Implemented for displaying modal dialogs and forms.

## Setup and Installation

Needs a .env file with following parameters:

REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-auth-domain
REACT_APP_FIREBASE_DATABASE_URL=your-database-url
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-storage-bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id

## Usage

### Adding a New Project
Click the "+" button at the top of the project list table, fill out the form in the modal, and submit.

### Editing a Project
Click the "Edit" button adjacent to the desired project, modify details in the form within the modal, and click "Save Changes."

### Deleting a Project
Click the "Delete" button next to the relevant project, and confirm the deletion in the modal.
