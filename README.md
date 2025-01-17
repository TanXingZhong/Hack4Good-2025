# Hack4Good-2025

# Muhammadiyah Welfare Home System

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [Clone the Repository](#clone-the-repository)
  - [Frontend Setup](#frontend-setup)
  - [Backend Setup](#backend-setup)
- [Development Workflow](#development-workflow)
- [Key Features](#key-features)
- [Solutions](#solutions)
- [Prototype Components](#prototype-components)
- [Tech Stack](#tech-stack)
- [Potential Impact](#potential-impact)
- [FAQs](#faqs)

## Overview

This project is designed to enhance the operational efficiency and user experience for the Muhammadiyah Welfare Home. It consists of two main components: a **Backend** for managing data and a **Frontend** for user interaction.

- Frontend: The user interface, developed using React, where users can interact with the application.
- Backend: A Express.js-based server that handles business logic, data storage, and communication with the frontend.

## Prerequisites

Before setting up the application locally, ensure that the following tools are installed:

- Node.js: A JavaScript runtime required to run both the frontend and backend. Download and install it from [here](https://nodejs.org/en).
- Git: A version control system to clone the repository. Download and install it from [here](https://git-scm.com).

## Getting Started

Follow these steps to set up the project on your local machine.

### Clone the Repository

Start by cloning the repository to your local device:

`git clone <repository-url>`

Replace <repository-url> with the URL of your Git repository.

### Frontend Setup

1. Navigate to the frontend directory:

`cd frontend`

2. Install the required dependencies:

`npm install`

3. Build the frontend project:

`npm run build`

4. Start the frontend development server:

`npm run start`

Your frontend should now be running. The application will usually be accessible at [http://localhost:5173](http://localhost:5173) by default.

### Backend Setup

1. Navigate to the backend directory:

`cd backend`

2. Install the required backend dependencies:

`npm install`

3. Build the backend project:

`npm run build`

4. Start the backend server:

`npm run start`

The backend server should now be running, typically accessible at [http://localhost:4000](http://localhost:4000) (depending on your configuration).

## Development Workflow

Once both frontend and backend servers are running, you can interact with the Scheduler Web Application via your browser.

- Frontend URL: Open [http://localhost:5173](http://localhost:5173) to access the user interface.
- Backend URL: The backend will be running on [http://localhost:4000](http://localhost:4000) (or the port you configured).

You can now begin working on the application, adding features, fixing bugs, or adjusting the user interface.

## Key Features

### For Residents:

- **User-Friendly Dashboard**: View voucher balances, transaction history, and available products.
- **Item Requests**: Easily request items from the minimart or place preorders for out-of-stock products.
- **Secure Login System**: Login with an optional mobile-based password reset feature.

### For Admins:

- **User Management**: Add, suspend, and reset passwords for residents.
- **Task Approval**: Approve or reject voucher tasks and product requests with detailed tracking.
- **Inventory Management**: Maintain and update inventory with audit logs for accountability.
- **Reporting**: Generate comprehensive reports, such as weekly requests and inventory summaries.

## Solutions

Our system solves key challenges faced by the welfare home:

### Efficiency

- Simplifies and streamlines item requests and inventory management.

### Transparency

- Provides detailed logs and reports for accountability and planning.

### Engagement

- The inventory system fosters a sense of community and involvement among residents.

By automating repetitive tasks and creating a centralized platform, the system saves time and reduces errors in resource management.

## Prototype Components

### Frontend 

- User interface for residents and administrators.
- Accessible, intuitive design to improve usability.

### Backend 

- Business logic for processing requests.
- Database integration for storing user and inventory data.

### Database 

- Stores user details, inventory information, and transaction history.

## Tech Stack

- **Frontend**: React.js
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JSON Web Tokens (JWT)

## Potential Impact

### For Residents

- Enhanced accessibility to resources.
- Empowered with transparency over requests and balances.

### For Administrators

- Streamlined management processes.
- Improved accountability through comprehensive reporting.

### For the Welfare Home

- Better allocation of resources.
- Increased resident satisfaction and engagement.

## FAQs

### Who is the intended user of this system?

The system is designed for residents and administrators of the Muhammadiyah Welfare Home.

### Can this system be expanded for other welfare homes?

Yes, the system is modular and can be customized for similar organizations.
