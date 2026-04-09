# 🔐 Backend - Authentication System

## 📌 Overview

This is the backend of a full-stack authentication system built using Node.js and Express. It provides secure APIs for user authentication, including login, signup, JWT-based authorization, and OTP-based password reset via email.

---

## 🚀 Features

* 🔑 User Registration & Login APIs
* 🔐 Password hashing using bcrypt
* 🎟️ JWT-based authentication & authorization
* 📧 OTP-based password reset using Nodemailer
* 🛡️ Protected routes with middleware
* ⚡ RESTful API architecture

---

## 🛠️ Tech Stack

* Node.js
* Express.js
* MySQL
* bcrypt
* JSON Web Token (JWT)
* Nodemailer

---

## 🔐 Authentication Flow

1. User registers with email & password
2. Password is hashed using bcrypt before storing in MySQL
3. User logs in → JWT token is generated
4. Token is used to access protected routes
5. If password is forgotten → OTP is sent via email
6. User verifies OTP and sets a new password

---

## 🔒 Security Features

* Encrypted passwords using bcrypt
* Token-based authentication (JWT)
* OTP verification with expiry (recommended)

---

## 💼 Author

BRNSwarup
