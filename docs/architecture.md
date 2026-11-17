# FitTrack AI – System Architecture

## Overview

FitTrack AI follows a client-server architecture with a React frontend, Node.js and Express backend, MongoDB Atlas database, and Google Gemini AI integration.

## Architecture Flow

1. Users interact with the React frontend.
2. Axios sends HTTP requests to the Express backend.
3. JWT middleware validates authenticated requests.
4. Controllers process application logic.
5. Mongoose communicates with MongoDB Atlas.
6. The AI Coach controller communicates with Google Gemini.
7. Responses are returned to the frontend.

## Deployment

- Frontend: Render Static Site
- Backend: Render Web Service
- Database: MongoDB Atlas
- AI Service: Google Gemini API

## Technologies

React, Vite, Node.js, Express.js, MongoDB, Mongoose, JWT, Axios, Google Gemini API and Render.
