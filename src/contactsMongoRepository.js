const { MongoClient, ObjectId } = require('mongodb');
const Contact = require('./Contact');

const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);

async function run()  {
  await client.connect();
  return 'Connected to the MongoDB server...';
}

run()
  .then(console.log)
  .catch(console.error);

const repo = {
  findAll: async () => {
    let contacts = [];
    const contactsColl = client.db('express-contacts').collection('contacts');
    const cursor = contactsColl.find({});
    await cursor.forEach(doc => {
      const aContact = new Contact(doc._id.toString(), doc.firstName, doc.lastName, doc.email, doc.notes);
      contacts.push(aContact);
    });
    return contacts;
  },
  findById: async (uuid) => {
    const contactsColl = client.db('express-contacts').collection('contacts');
    const filter = {
      '_id': new ObjectId(uuid)
    };
    const doc = await contactsColl.findOne(filter);
    return new Contact(doc._id.toString(), doc.firstName, doc.lastName, doc.email, doc.notes);
  },
  create: async (contact) => {
    const doc = {firstName: contact.firstName, lastName: contact.lastName, email: contact.email, notes: contact.notes};
    const contactsColl = client.db('express-contacts').collection('contacts');
    const result = await contactsColl.insertOne(doc);
    console.log(`A document was inserted with the _id: ${result.insertedId}`);
  },
  deleteByID: async (uuid) => {
    const contactsColl = client.db('express-contacts').collection('contacts');
    const filter = {
      '_id': new ObjectId(uuid)
    };
    const result = await contactsColl.deleteOne(filter);
    if (result.deletedCount === 1) {
      console.log("Successfully deleted the document.");
    } else  {
      console.log("No documents matched the query. Deleted 0 documents.");
    }
  },
  update: async (contact) => {
    const contactsColl = client.db('express-contacts').collection('contacts');
    const filter = {
      '_id': new ObjectId(contact.id)
    };
    const updateDoc = {
      $set: {
        firstName: contact.firstName, 
        lastName: contact.lastName, 
        email: contact.email, 
        notes: contact.notes
      }
    };
    const result = await contactsColl.updateOne(filter, updateDoc);
    console.log(`${result.matchedCount} docs matched the filter, updated ${result.modifiedCount} document(s)`);
  },
};


module.exports = repo;