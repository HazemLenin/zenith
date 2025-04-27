# Zenith API Documentation

## Base URL

```
http://localhost:3000/api
```

## Authentication

All endpoints except `/auth/signup` and `/auth/login` require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

## Endpoints

### Authentication

#### Sign Up

```http
POST /auth/signup
```

Creates a new user account.

Request Body:

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securepassword123",
  "role": "student"
}
```

Response (Success):

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 123,
    "firstName": "John",
    "lastName": "Doe",
    "username": "john_doe",
    "email": "john@example.com",
    "role": "student"
  }
}
```

#### Login

```http
POST /auth/login
```

Authenticates a user and returns a JWT token.

Request Body:

```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

Response (Success):

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 123,
    "firstName": "John",
    "lastName": "Doe",
    "username": "john_doe",
    "email": "john@example.com",
    "role": "student"
  }
}
```

### Users

#### Get User by Username

```http
GET /users/:username
```

Retrieves user information by username.

Response (Success):

```json
{
  "user": {
    "id": 123,
    "firstName": "John",
    "lastName": "Doe",
    "username": "john_doe",
    "email": "john@example.com",
    "role": "student",
  },
  "profile": {
      "id": 123,
      "points": 20,
      "skills": [
        {
          "id": 123,
          "skillId": 123,
          "type": "learned" | "needed",
          "skillName": "python"
        }
      ]
    }
}
```

### Courses

#### Upload Course

```http
POST /courses
```

Uploads a new course (Instructor only).

Request Body:

```json
{
  "title": "Introduction to Programming",
  "description": "Learn the basics of programming",
  "price": 49,
  "chapters": [
    {
      "title": "Chapter 1",
      "order": 1,
      "videos": [
        {
          "title": "Introduction",
          "url": "https://example.com/video1",
          "order": 1
        }
      ],
      "articles": [
        {
          "title": "Getting Started",
          "content": "Welcome to the course...",
          "order": 1
        }
      ]
    }
  ]
}
```

Response (Success):

```json
{
  "id": 123,
  "title": "Introduction to Programming",
  "description": "Learn the basics of programming",
  "price": 49,
  "instructorId": 456
}
```

#### Get All Courses

```http
GET /courses
```

Retrieves all available courses.

Response (Success):

```json
[
  {
    "id": 123,
    "title": "Introduction to Programming",
    "description": "Learn the basics of programming",
    "price": 49,
    "instructor": {
      "id": 456,
      "username": "jane_doe",
      "firstName": "Jane",
      "lastName": "Doe"
    }
  }
]
```

#### Get My Courses

```http
GET /courses/my-courses
```

Retrieves courses created by the instructor (Instructor only).

Response (Success):

```json
[
  {
    "id": 123,
    "title": "Introduction to Programming",
    "description": "Learn the basics of programming",
    "price": 49,
    "instructorId": 456
  }
]
```

#### Get Course Details

```http
GET /courses/:id
```

Retrieves detailed information about a specific course.

Response (Success):

```json
{
  "id": 123,
  "title": "Introduction to Programming",
  "description": "Learn the basics of programming",
  "price": 49,
  "chaptersCount": 10,
  "instructor": {
    "id": 456,
    "username": "jane_doe",
    "firstName": "Jane",
    "lastName": "Doe"
  },
  "rating": 4.5,
  "enrollmentCount": 50,
  "createdAt": "2024-04-27T12:00:00Z"
}
```

#### Get Course Chapters

```http
GET /courses/:id/chapters
```

Retrieves all chapters for a specific course.

Response (Success):

```json
[
  {
    "id": 123,
    "title": "Chapter 1",
    "order": 1
  }
]
```

#### Get Chapter Details

```http
GET /courses/:courseId/chapters/:chapterId
```

Retrieves detailed information about a specific chapter.

Response (Success):

```json
{
  "id": 123,
  "title": "Chapter 1",
  "order": 1,
  "videos": [
    {
      "id": 456,
      "title": "Introduction",
      "url": "https://example.com/video1"
    }
  ],
  "articles": [
    {
      "id": 789,
      "title": "Getting Started",
      "content": "Welcome to the course..."
    }
  ]
}
```

#### Enroll in Course

```http
POST /courses/enroll
```

Enrolls a student in a course.

Request Body:

```json
{
  "courseId": 123
}
```

Response (Success):

```json
{
  "id": 123,
  "courseId": 456,
  "studentId": 789,
  "paid": 49,
  "enrolledAt": "2024-04-27T12:00:00Z"
}
```

#### Generate Certificate

```http
GET /courses/:courseId/certificate
```

Generates a certificate for a completed course.

Response (Success):

PDF file

### Skills

#### Get Skill Categories

```http
GET /skills/categories
```

Retrieves all skill categories (Student only).

Response (Success):

```json
[
  {
    "id": 123,
    "name": "Programming",
    "description": "Programming related skills",
    "minPoints": 10,
    "maxPoints": 20
  }
]
```

#### Get Skills by Category

```http
GET /skills/categories/:categoryId/skills
```

Retrieves skills belonging to a specific category (Student only).

Response (Success):

```json
[
  {
    "id": 123,
    "title": "JavaScript",
    "categoryId": 456
  }
]
```

#### Update Student Skills

```http
PUT /skills/students/:studentId/skills
```

Updates the skills of a student (Student only).

Request Body:

```json
{
  "skills": [
    {
      "skillId": 123,
      "level": "learned" | "needed"
    }
  ]
}
```

Response (Success):

```json
[
    {
      "skillId": 123,
      "level": "intermediate",
      "updatedAt": "2024-04-27T12:00:00Z",
      "id": 123,
      "studentId": 456,
      "skillId": 789,
      "type": "learned" | "needed";
    }
  ]
```

### Chat

#### Get All Chats

```http
GET /chats
```

Retrieves all chats for the authenticated user.

Response (Success):

```json
  [
    "chat": {
        "id": 123,
        "createdAt": "024-04-27T12:00:00Z",
        "updatedAt": "024-04-27T12:00:00Z",
        "user1Id": 123,
        "user2Id": 456,
    },
    "user": {
        "id": 123,
        "firstName": "Joe",
        "lastName": "Doe",
    }]
```

#### Get Chat Messages

```http
GET /chats/:chatId/messages
```

Retrieves messages for a specific chat.

Response (Success):

```json
[
  {
    "id": 123,
    "content": "Hello!",
    "senderId": 456,
    "chatId": 789,
    "content": "Helloo!",
    "createdAt": "2024-04-27T12:00:00Z",
    "isRead": true
  }
]
```

#### Send Message

```http
POST /chats/:chatId/messages
```

Sends a message in a specific chat.

Request Body:

```json
{
  "content": "Hello!"
}
```

Response (Success):

```json
{
  "id": 123,
  "content": "Hello!",
  "senderId": 456,
  "chatId": 789,
  "createdAt": "2024-04-27T12:00:00Z",
  "isRead": true
}
```

## Middleware

### Authentication Middleware

- Required for most endpoints
- Validates JWT token
- Adds user information to request object

### Instructor Middleware

- Required for instructor-specific endpoints
- Verifies user has instructor role

### Student Middleware

- Required for student-specific endpoints
- Verifies user has student role

## Error Responses

All error responses follow this format:

```json
{
  "message": "Error message",
  "code": "ERROR_CODE"
}
```

Common error codes:

- `UNAUTHORIZED`: Authentication failed
- `FORBIDDEN`: Insufficient permissions
- `NOT_FOUND`: Resource not found
- `VALIDATION_ERROR`: Invalid request data
- `INTERNAL_ERROR`: Server error
