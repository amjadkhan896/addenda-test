const express       = require('express');
const router        = new express.Router()
const Post          = require('../models/post')
const Comment       = require('../models/comment')
const {ObjectID}    = require('mongodb')
const  authenticate = require('../middleware/auth')

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

router.get('/posts/:id/comment', async (req,res) => {
    try {
        const post = await Post.findOne({_id: req.params.id})
        await post.populate('comments').execPopulate()
        res.send(post.comments)
    } catch (error) {
        res.status(500).send()
    }
})

module.exports = router