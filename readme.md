# Gym Membership RESTful API

## Project Overview

This project is a Node.js application that implements a RESTful API for managing gym membership data. It uses MongoDB to store and manipulate data related to gym members, classes, and the associations between them.

---

## Database Structure

### Gym Member Details
- `ID` (Integer)
- `Title`
- `First Name`
- `Last Name`
- `Email Address`
- `Premium Membership` (Boolean)

### Gym Class Details
- `ID`
- `Class Name`
- `Class Day`
- `Session Length (hrs)` (Integer)
- `Price` (Integer)
- `Current Number of Members` (Integer)

### Member-Class Information
- `User ID`
- `Class ID`

---

## RESTful API Functionality

CRUD operations were implemented for managing:
- Gym members
- Gym classes
- Relationships between members and classes

Tested using tools such as **Postman** and **Insomnia**.

---

## Implementation Details

- **Framework:** ExpressJS
- **Database:** MongoDB (local and MongoDB Cloud Atlas)
- **ODM:** Mongoose

---

## CRUD Operations

- **Create:** Add new members, classes, or associations.
- **Retrieve:** View member/class details and relationships.
- **Update:** Edit existing member or class information.
- **Delete:** Remove members, classes, or associations.

---

## Development Notes

- **Database Design:** NoSQL structure with both normalized and de-normalized models.
- **Data Generation:** Included random data generation functions and hard-coded examples for CRUD testing.
- **Title Support:** Accepts titles like Mx, Ms, Mr, Mrs, Miss, Dr, and custom entries.
- **Code Comments:** Contains extensive comments describing database design and route usage.

---

## Getting Started

1. Clone the repo
2. Run `npm install`
3. Configure MongoDB URI in `.env`
4. Run the app: `npm start`
