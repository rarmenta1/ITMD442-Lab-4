const crypto = require('crypto');
const db = new Map();

db.set('a593c7cf-889d-4e81-bf0a-76cfd2d9810d', {firstName: 'John', lastName: "Doe", email: 'johndoe@gmail.com', notes: 'Sample Notes Text', id: 'a593c7cf-889d-4e81-bf0a-76cfd2d9810d'})
db.set('7054c36e-d85e-41d3-8fd8-a996e0cac276', {firstName: 'Jodio', lastName: "Joestar", email: 'jjoestar@gmail.com', notes: 'This is a story about...', id: '7054c36e-d85e-41d3-8fd8-a996e0cac276'})

const repo = {
  findAll: () => Array.from(db.values()),
  findById: (uuid) => db.get(uuid),
  create: (contacts) => {
    const newContacts = {
      id: crypto.randomUUID(),
      firstName: contacts.firstName,
      lastName: contacts.lastName,
      email: contacts.email,
      notes: contacts.notes,
    };
    db.set(newContacts.id, newContacts);
  },
  deleteByID: (uuid) => db.delete(uuid),
  update: (contact) => db.set(contact.id, contact),
};

module.exports = repo;