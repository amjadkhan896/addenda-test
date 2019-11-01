const express       = require('express');
const router        = new express.Router()
const Contact          = require('../models/contact')
const  authenticate = require('../middleware/auth')
const {ObjectID}  = require('mongodb')



router.get('/contacts',authenticate ,async (req,res) => {
    try {
        //console.log(req.user)
        const contacts = await Contact.find({"user_id":req.user._id})
        res.render('contacts', {page:'Contacts', menuId:'contacts',contactsList:contacts,user:req.user });

    } catch (error) {
        res.status(500).send()
    }
})

router.get('/contacts/add',authenticate ,async (req,res) => {
    try {
        res.render('add_contact', {page:'Add Contact', menuId:'add_contact',user:req.user });

    } catch (error) {
        res.status(500).send()
    }
})

router.get('/contacts/edit/:id',authenticate ,async (req,res) => {
    try {
        const contact = await Contact.findOne({"_id":req.params.id})

        res.render('edit_contact', {page:'Edit Contact', menuId:'edit_contact',user:req.user,contact:contact });

    } catch (error) {
        res.status(500).send()
    }
})

router.post('/contacts/add',authenticate ,async (req,res) => {


    const contact =  new Contact({
        name:req.body.name,
        email:req.body.email,
        phone:req.body.phone,
        address:req.body.address,
        user_id: req.user._id
    })
    try {
        await contact.save()
        res.status(201).send(contact)
    } catch (error) {
        res.status(400).send(contact)
    }
})

router.post('/contacts/update',authenticate ,async (req,res) => {

    let contact = {};
    contact.name = req.body.name;
    contact.email = req.body.email;
    contact.phone = req.body.phone;
    contact.address = req.body.address;

    let query = {_id:req.body.r_id}

    try {
        Contact.update(query, contact, function(err){

                console.log(err);
        });

        res.status(201).send(contact)
    } catch (error) {
        res.status(400).send(error)
    }
})

router.delete('/contact/delete/:id', authenticate,async (req,res) => {
    const _id = req.params.id

    try {
        const deletepost = await Contact.findOneAndDelete({_id:_id, user_id: req.user._id})
        if (!deletepost) {
             res.status(404).send();
        }
        res.send(deletepost)
    } catch (error) {
        res.status(500).send()
    }
})

module.exports = router