const express = require('express');
const router = express.Router();
const User = require('../models/user');


// CREATE USER
router.post('/', async (req, res) => {

    const user = new User(req.body);

    await user.save();

    res.json(user);
});


// GET ALL USER + search username
router.get('/', async (req, res) => {

    let query = { deleted: false };

    if (req.query.username) {

        query.username = {
            $regex: req.query.username,
            $options: "i"
        };
    }

    const users = await User.find(query).populate("role");

    res.json(users);
});


// GET USER BY ID
router.get('/:id', async (req, res) => {

    const user = await User.findById(req.params.id).populate("role");

    res.json(user);
});


// UPDATE USER
router.put('/:id', async (req, res) => {

    const user = await User.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );

    res.json(user);
});


// SOFT DELETE USER
router.delete('/:id', async (req, res) => {

    await User.findByIdAndUpdate(req.params.id, {
        deleted: true
    });

    res.json({ message: "User deleted (soft)" });
});


// 2️⃣ ENABLE USER
router.post('/enable', async (req, res) => {

    const { email, username } = req.body;

    const user = await User.findOne({ email, username });

    if (!user) {
        return res.status(404).json({
            message: "User not found"
        });
    }

    user.status = true;

    await user.save();

    res.json(user);
});


// 3️⃣ DISABLE USER
router.post('/disable', async (req, res) => {

    const { email, username } = req.body;

    const user = await User.findOne({ email, username });

    if (!user) {
        return res.status(404).json({
            message: "User not found"
        });
    }

    user.status = false;

    await user.save();

    res.json(user);
});


module.exports = router;