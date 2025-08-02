const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const faker = require('faker');
const app = express();
app.use(express.json());

const ATLAS_URI = 
const client = new MongoClient(ATLAS_URI);

async function connectToDatabase() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        return client.db("lab6");
    } catch (error) {
        console.error('MongoDB failed to connect', error);
        process.exit(1);
    }
}
// get to retireve user and all the classes the user is in
app.get('/users/:id', async (req, res) => {
    try {
        const userId = req.params.id; // Assuming the user ID is passed as a URL parameter
        const db = await connectToDatabase();
        const collection = db.collection('users');

        // Aggregate pipeline to fetch user and their classes
        const userWithClasses = await collection.aggregate([
            {
                $match: { "id": parseInt(userId) } 
            },
            {
                $lookup: {
                    from: "userClasses", 
                    localField: "id", 
                    foreignField: "userId",
                    as: "userClasses" 
                }
            },
            {
                $unwind: "$userClasses" 
            },
            {
                $lookup: {
                    from: "classes", // 
                    localField: "userClasses.classesJoined", 
                    foreignField: "id",
                    as: "classDetails" 
                }
            },
            {
                $group: {
                    _id: "$_id",
                    root: { $mergeObjects: "$$ROOT" }, 
                    classes: { $push: "$classDetails" } 
                }
            },
            {
                $replaceRoot: {
                    newRoot: { $mergeObjects: ["$root", "$classes"] } // Replace the root to merge user details with class details
                }
            },
           
        ]).toArray();

        if (userWithClasses.length === 0) {
            res.status(404).send('User not found');
        } else {
            res.status(200).send(userWithClasses[0]); 
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Failed to retrieve user and classes');
    }
});

// // post to create user
app.post('/users', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection('users');
        const { id, title, firstName, lastName, email, premiumMember } = req.body;
// we need a json containing all these details to insert a new user
        const result = await collection.insertOne({
            "id": id,
            "title": title,
            "firstName": firstName,
            "lastName": lastName,
            "email": email,
            "premiumMember": premiumMember
        });

        res.status(201).send(`${result.insertedId} has been inserted`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Failed to create user');
    }
});
//update user premium information by user id
app.put('/users', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection('users');
        const { id,  premiumMemberNew } = req.body;
        const filter = { id: id }; 
// we need a json containing all these details to insert a new user
   const updateDocument = {
    $set: {
        premiumMember : premiumMemberNew
    }
};
const result = await collection.updateOne(filter, updateDocument); 
        res.status(201).send(`Document has been updated`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Failed to create user');
    }
});
 //delete user by id.
app.delete('/users', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection('users');
        const { id } = req.body;
       
// we need a json containing all these details to insert a new user
  const query = { id: id};
   
const result = await collection.deleteOne(query);
        res.status(201).send(`Document has been updated`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Failed to delete user');
    }
});
//get to retrieve classes
app.get('/classes', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection('classes');
        const { id } = req.body;
        const query = { id : id }; 
        const documents = await collection.find(query).toArray();
        res.status(200).send(documents);
    } catch (error) {
        console.error(error);
        res.status(500).send('Failed to connect to database');
    }
});
//post to create classes

app.post('/classes', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection('classes');
        const { ID, className, classDay, Session, Length, price, numOfMembers  } = req.body;

        const result = await collection.insertOne({
            "id" : ID,
            "className": className,
            "classDay": classDay,
            "Session": Session,
            "length": Length,
            "price": price,
            "numberOfMembers": numOfMembers 
        });
        res.status(201).send(`${result.insertedId} has been inserted`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Failed to create user');
    }
});
put to update classes by id
app.put('/classes', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection('classes')
        //update price by id
        const { id,  price } = req.body;
        const filter = { id: id }; 

   const updateDocument = {
    $set: {
        price : price
    }
};


const result = await collection.updateOne(filter, updateDocument); 
        res.status(201).send(`Document has been updated`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Failed to delete user');
    }
});
// delete to delete classes.
app.delete('/classes', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection('classes');
        const { id } = req.body;
  const query = { id: id};
   
const result = await collection.deleteOne(query);
        res.status(201).send(`Document has been deleted`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Failed to delete user');
    }
});

// POST: Add a new user class registration
app.post('/userClasses', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection('userClasses');
        const { ID, classes } = req.body;

        const result = await collection.insertOne({
            "userId": ID,
            "classesJoined": classes
        });
        res.status(201).send(`${result.insertedId} has been inserted`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Failed to add user to this class');
    }
});

// PUT: Update user classes by adding new classes
app.put('/userClasses', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection('userClasses');
        const { id, classes } = req.body;
        const filter = { "_id": id };

        const updateDocument = {
            $addToSet: { // used add to set to simply update userclasses joined, we dont have to create a new onew from scratch each time.
                classesJoined: { $each: classes }
            }
        };

        const result = await collection.updateOne(filter, updateDocument);
        if (result.modifiedCount === 0) {
            throw new Error('Nothign matched your query');
        }
        res.status(200).send(`Updated classes for user ${id}`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Failed to update user classes');
    }
});

// DELETE: Remove a user class registration
app.delete('/userClasses', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection('userClasses');
        const { id } = req.body;
        const query = { "_id": id };

        const result = await collection.deleteOne(query);
        if (result.deletedCount === 0) {
            throw new Error('No documents matched the query. Document not deleted.');
        }
        res.status(204).send('Document has been deleted');
    } catch (error) {
        console.error(error);
        res.status(500).send('Failed to delete user');
    }
});

// GET: Retrieve all classes a user has joined
app.get('/userClasses', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection('userClasses');
        const { id } = req.query;// pass in the id as a query
        const query = { "userId": id };
        const documents = await collection.find(query).toArray();
        res.status(200).send(documents);
    } catch (error) {
        console.error(error);
        res.status(500).send('Failed to retrieve user classes');
    }
});


const port = 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
// my database design consist of three primary collections
// users, classes and userclasses, i tried to model a relational
// database by seperating all my entitiies into distinct collections
// and establishing relationships through reference, i used embedding
// in my last assignment and i wanted to try something new
// my users collection stores personal details of gym members
// my classes collection contains details about the different classes
// offered by the gym.

//this allows me greater flexibility, as editing one part of the system 
// is easier than the rest of them. 


//function for creating random users
// app.post('/users/random', async (req, res) => {
//     const db = await connectToDatabase();
//     const collection = db.collection('users');

//     // Generate random user data
//     const randomUser = {
//         id: faker.datatype.number(),
//         title: faker.name.prefix(),
//         firstName: faker.name.firstName(),
//         lastName: faker.name.lastName(),
//         email: faker.internet.email(),
//         premiumMember: faker.datatype.boolean()
//     };

//     try {
//         const result = await collection.insertOne(randomUser);
//         res.status(201).send(`Random user ${result.insertedId} has been inserted`);
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Failed to create random user');
//     }
// });

// app.post('/classes/random', async (req, res) => {
//     const db = await connectToDatabase();
//     const collection = db.collection('classes');

//     // Generate random class data
//     const randomClass = {
//         id: faker.datatype.number(),
//         className: `${faker.hacker.adjective()} ${faker.hacker.noun()}`,
//         classDay: faker.date.weekday(),
//         sessionLength: faker.datatype.number({ min: 1, max: 3 }), // Session length between 1 and 3 hours
//         price: faker.commerce.price(15, 100, 0), // Price between $15 and $100
//         numOfMembers: faker.datatype.number({ min: 5, max: 30 }) // Number of members between 5 and 30
//     };

//     try {
//         const result = await collection.insertOne(randomClass);
//         res.status(201).send(`Random gym class ${result.insertedId} has been inserted`);
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Failed to create random gym class');
//     }
// });

