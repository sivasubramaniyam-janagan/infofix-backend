# InfoFix Backend 🛒

InfoFix is an e-commerce application for browsing and purchasing products online. This repository contains the **backend API** that handles the application's server-side logic, database operations, authentication, and order management.

The backend is built with **Node.js, Express.js, and MongoDB** and provides REST APIs for communication with the frontend.

## Features

* 🔐 User authentication and authorization
* 👤 User account management
* 🛍️ Product management
* 📦 Order creation and management
* 👨‍💼 Admin functionality
* 🗄️ MongoDB database integration
* 📧 Email functionality
* 🔒 Protected API routes

## Technologies

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcrypt
* Nodemailer

## Run Locally

### 1. Install dependencies

```bash
npm install
```

### 2. Create a `.env` file

Add your MongoDB and email configuration:

```env
MONGO_URI=your-mongodb-connection-string
PAYLOAD=your-email-payload
GMAIL_APP_PASSWORD=your-gmail-app-password
GMAIL=your-gmail-address
```

### 3. Start the server

```bash
npm start
```

The API runs at:

```text
http://localhost:3000
```

## Project Structure

This repository contains the **backend** of InfoFix.

* **Frontend:** React.js
* **Backend:** Node.js, Express.js
* **Database:** MongoDB

## Frontend

The frontend is maintained in a separate repository.

**Frontend Repository:**
https://github.com/sivasubramaniyam-janagan/infofix-frontend.git

## Author

**Sivasubramaniyam Janagan**
