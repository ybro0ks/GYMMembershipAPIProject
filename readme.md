Project Overview: Gym Membership RESTful API
In this project, I developed a Node.js application to implement a RESTful API for managing gym membership data. The system interacts with a MongoDB database to handle personal information for gym members, class details, and the association between members and the classes they attend.

Database Structure
Gym Member Details:

ID (Integer)
Title
First Name
Last Name
Email Address
Premium Membership (Boolean)
Gym Class Details:

ID
Class Name
Class Day
Session Length (Hrs) (Integer)
Price (Integer)
Current Number of Members (Integer)
Member-Class Information:

User ID
Class ID
RESTful API Functionality
I implemented CRUD operations to manage gym member details, class information, and the relationships between members and their classes. These routes were tested using tools like Postman or Insomnia.

Implementation Details
Framework: I used ExpressJS to set up the RESTful API.
Database: The system uses a MongoDB database, and I opted for Mongoose for handling database operations.
Setup: I worked with both a local MongoDB installation and MongoDB Cloud Atlas for database storage.
CRUD Operations
Create: Adding new records for members, classes, and associations.
Retrieve: Searching and displaying details of members, classes, and their connections.
Update: Modifying existing details of members and classes.
Delete: Removing specified entries from the database.
Development Notes
Database Design: I adopted a NoSQL database design, utilizing both normalized and de-normalized models as needed.
Data Generation: I wrote functions to generate random data, with some hard-coded examples used in CRUD operations.
Title Options: Included support for titles such as Mx, Ms, Mr, Mrs, Miss, Dr, or other specified titles.
Code Comments: Provided detailed comments including database design descriptions and examples of routes.
Data Validation: While validation in controllers was optional, I included it based on the available guidance.
Authentication: Hard-coded authentication details into the database, enabling access from any IP address (whitelisted 0.0.0.0) for testing purposes.
By following these practices, I successfully delivered a robust backend application for efficient management of gym memberships via RESTful API.
