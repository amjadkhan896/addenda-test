const express       = require('express');
const router        = new express.Router()
const Contact          = require('../models/contact')
const  authenticate = require('../middleware/auth')


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

router.get('/posts/:id',authenticate, async (req,res) => {
    const _id =  req.params.id
    if (!ObjectID.isValid(_id)) {
        return res.status(404).send();
    }
    try {
        const post = await Contact.findOne({ _id, author: req.user._id })
        if(!post){
            return res.status(404).send()
        }
        res.send(post);
    } catch (error) {
        res.status(500).send()
    }
})

router.post('/posts/:id/comment',authenticate, async (req,res) => {
    const _id = req.params.id
    const userid = req.user._id

    if (!ObjectID.isValid(_id)) {
        return res.status(404).send();
    }

    if (!ObjectID.isValid(userid)) {
        return res.status(404).send();
    }

    const comment = new Comment({
        ...req.body,
        author: userid,
        postId: _id
    })

    try {
        await comment.save()
        res.status(201).send(comment)
    } catch (error) {
        res.status(400).send(error)
    }

})

//get all the comments related to the post
router.get('/posts/:id/comment', async (req,res) => {
    try {
        const post = await Contact.findOne({_id: req.params.id})
        await post.populate('comments').execPopulate()
        res.send(post.comments)
    } catch (error) {
        res.status(500).send()
    }
})

router.patch('/posts/:id',authenticate, async (req, res) => {
    const _id = req.params.id
    const updates = Object.keys(req.body);
    const allowedUpdates = ["description", "title"]
    const isValidOperation  = updates.every((update) => allowedUpdates.includes(update))
    if(!isValidOperation){
        res.status(400).send({error:'Invalid updates'})
    }
    if (!ObjectID.isValid(_id)) {
        res.status(404).send();
    }
    try {
        const post = await Contact.findOne({_id: req.params.id, author:req.user._id})

        if(!post){
            res.status(404).send();
        }

        updates.forEach((update) => post[update] = req.body[update])
        await post.save()

        res.send(post);
    } catch (error) {
        res.status(400).send();
    }
})

router.delete('/posts/:id', authenticate,async (req,res) => {
    const _id = req.params.id
    if (!ObjectID.isValid(_id)) {
        return res.status(404).send();
    }
    try {
        const deletepost = await Contact.findOneAndDelete({_id:_id, author: req.user._id})
        if (!deletepost) {
            return res.status(404).send();
        }
        res.send(deletepost)
    } catch (error) {
        res.status(500).send()
    }
})

module.exports = router