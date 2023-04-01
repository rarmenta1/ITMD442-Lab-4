const contactsRepo = require('../src/contactsMongoRepository');
const { validationResult } = require('express-validator');
const Contact = require('../src/Contact');


/* GET users listing. */
exports.contacts_list = async function(req, res, next) {
  const data = await contactsRepo.findAll();
  res.render('contacts', {title: 'Express Contacts', contacts: data });
};

/* GET create contacts form. */
exports.contacts_create_get = function(req, res, next) {
  res.render('contacts_add', {title: 'Add a contact' });
};

/* POST create contacts. */
exports.contacts_create_post = async function(req, res, next) {
  //console.log(req.body);
  const result = validationResult(req);
  if (!result.isEmpty())  {
      res.render('contacts_add', { title: 'Add a contact', msg: result.array()});
  } else  {
    const newContact = new Contact('', req.body.firstName, req.body.lastName, req.body.email, req.body.notes);
    await contactsRepo.create(newContact)

    res.redirect('/contacts');
  }
};

/* GET single contacts. */
exports.contacts_detail = async function(req, res, next) {
  const contact = await contactsRepo.findById(req.params.uuid);
  if(contact) {
    res.render('contact', {title: 'Contact Information', contact: contact });
  } else {
    res.redirect('/contacts');
  }
};

/* GET delete contacts form. */
exports.contacts_delete_get = async function(req, res, next) {
  const contact = await contactsRepo.findById(req.params.uuid);
  res.render('contacts_delete', {title: 'Delete Contact', contact: contact });
};

/* POST delete contacts. */
exports.contacts_delete_post = async function(req, res, next) {
  await contactsRepo.deleteByID(req.params.uuid);
  res.redirect('/contacts');
};

/* GET edit contacts form. */
exports.contacts_edit_get = async function(req, res, next) {
  const contact = await contactsRepo.findById(req.params.uuid);
  res.render('contacts_edit', {title: 'Edit contact', contact: contact });
};

/* POST edit contacts. */
exports.contacts_edit_post = async function(req, res, next) {
  //console.log(req.body);
  const result = validationResult(req);
  if (!result.isEmpty())  {
    const contact = await contactsRepo.findById(req.params.uuid);
    res.render('contacts_edit', { title: 'Edit contact', msg: result.array(), contact: contact});
  } else  {
    const updatedContact = new Contact(req.params.uuid, req.body.firstName, req.body.lastName, req.body.email, req.body.notes, req.body.notes );
    await contactsRepo.update(updatedContact);
    res.redirect('/contacts/' + req.params.uuid);
  }
};