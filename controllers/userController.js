const bcrypt = require('bcrypt');
const db = require("../config/database")

const getusers = async (req, res) => {
    try {
        return res.json({
            user: 'List'
        })
    } catch (error) {
        console.log(error)
        res.status(500)
    }
}

const createUser = async (req, res) => {
    const { firstName, lastName, gender, email, password, number } = req.body;

    if (!firstName || !lastName || !gender || !email || !password || !number) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    try {
        const [existingUsers] = await db.query(
            'SELECT id FROM users WHERE email = ?',
            [email]
        );
        if (existingUsers.length > 0) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const [result] = await db.query(
            `INSERT INTO users (firstName, lastName, gender, email, password, number) VALUES (?, ?, ?, ?, ?, ?)`,
            [firstName, lastName, gender, email, hashedPassword, number]
          );

        if(!result){
            return res.status(400).json({message: "Error in creating user"})
        }
        const newUser = {
            id: result.insertId,
            firstName,
            lastName,
            gender,
            email,
            number
        };
        res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Database error', error: error });
    }
}

module.exports = { getusers, createUser }