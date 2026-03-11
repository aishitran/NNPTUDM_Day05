const express = require('express');
const router = express.Router();
const Role = require('../models/role');
const User = require('../models/user');


// CREATE ROLE
router.post('/', async (req, res) => {
    const role = new Role(req.body);
    await role.save();
    res.json(role);
});


// GET ALL ROLE
router.get('/', async (req, res) => {
    const roles = await Role.find({ deleted: false });
    res.json(roles);
});


// GET ROLE BY ID
router.get('/:id', async (req, res) => {
    const role = await Role.findById(req.params.id);
    res.json(role);
});


// UPDATE ROLE
router.put('/:id', async (req, res) => {
    const role = await Role.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );

    res.json(role);
});


// SOFT DELETE
router.delete('/:id', async (req, res) => {
    await Role.findByIdAndUpdate(req.params.id, {
        deleted: true
    });

    res.json({ message: "Role deleted (soft)" });
});


// GET USER BY ROLE ID
router.get('/:id/users', async (req, res) => {

    const users = await User.find({
        role: req.params.id,
        deleted: false
    });

    res.json(users);
});

module.exports = router;