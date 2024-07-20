## README.md

# Patient Image Management System

This project is designed to help surgeons and designers manage patient images securely and efficiently. The application allows surgeons to upload "before" images of patients, designers to upload corresponding "after" images, and provides a platform for patients to view these images side by side or toggle between them. The images and related information are securely stored in MongoDB.

## Table of Contents
- [Project Overview](#project-overview)
- [Features](#features)
- [Functionality](#functionality)
- [Styling](#styling)
- [Database Schema](#database-schema)
- [Setup and Installation](#setup-and-installation)
- [Running the Application](#running-the-application)

## Project Overview

The goal of this project is to provide a HIPAA-compliant platform for managing patient images. The system ensures that patient data is secure and isolated, providing unique links for patients to view their images without accessing other parts of the website.

## Features

- **User Authentication**: Secure login for surgeons and designers.
- **Image Upload**: Surgeons upload "before" images, designers upload "after" images.
- **Notes for Designers**: Surgeons can leave notes for designers to specify the required modifications.
- **Patient View**: Patients can view before and after images side by side or toggle between them.
- **PDF Export**: Patients can save the images as a PDF file.
- **Email Functionality**: Patients can email the images to themselves.
- **Raw Image Download**: Patients can download the raw image files.

## Functionality

### User Authentication

- Surgeons and designers can log in securely using their credentials.
- The login system uses JWT for session management.

### Image Management

- **Uploading Images**: Surgeons upload "before" images with notes for designers. Designers can upload "after" images based on these notes.
- **Viewing Images**: Patients receive a unique link to view their images. They can toggle between the images or view them side by side.
- **Downloading and Sharing**: Patients can download the images as raw files or as a PDF, and can email the images to themselves.

### Notes for Designers

- Surgeons can leave notes specifying what changes are needed in the "after" image.

## Styling

The application’s styling should mimic the look and feel of [Dr. Andrews Plastic Surgery](https://www.drandrewsplasticsurgery.com/).

### Colors

- Primary: #ccb379 (Gold)
- Secondary: #b78d4a (Brown)
- Background: #FFFFFF (White)
- Text: #363636 (Dark Grey)

### Typography

- Use 'Montserrat', 'Meno Banner', and 'Playfair Display' fonts as specified in the `styles.css`.

### Layout

- Header should contain the logo centered at the top.
- Footer should contain a copyright notice with the current year.

## Database Schema

### User Schema

- **username**: String, required, unique
- **password**: String, required

### Image Schema

- **patientName**: String, required
- **imageId**: ObjectId, required (reference to GridFS file)
- **tag**: String, enum ['before', 'after'], required

## Setup and Installation

### Prerequisites

- Node.js
- MongoDB

### Installation

1. Clone the repository.
2. Install dependencies:
    ```bash
    npm install
    ```
3. Set up environment variables. Create a `.env` file in the root directory with the following contents:
    ```
    MONGO_URI=<your_mongodb_uri>
    JWT_SECRET=<your_jwt_secret>
    EMAIL_USER=<your_email_address>
    EMAIL_PASS=<your_email_password>
    PORT=3000
    ```

## Running the Application

### Development

Start the development server:
```bash
npm run dev
```

### Production

Build the application:
```bash
npm run build
```

Preview the built application:
```bash
npm run preview
```

## API Endpoints

### Authentication

- **POST /register**: Register a new user
- **POST /login**: Log in a user

### Image Upload

- **POST /upload-before**: Upload a "before" image
- **POST /upload-after**: Upload an "after" image

### Image Retrieval

- **GET /patient-images**: Retrieve all patient images (for authenticated users)
- **GET /image/:filename**: Retrieve a specific image by filename
- **GET /:patientName**: Retrieve a patient's images by patient name

## Security Considerations

- Ensure all patient data is stored securely in MongoDB.
- Use HTTPS to secure data transmission.
- Implement proper authentication and authorization checks.
- Use environment variables to manage sensitive information.
