require('dotenv').config()
const sequelize = require('./db')
const { User } = require('./models')
const bcrypt = require('bcrypt');
const saltRounds = 10

const createAdmin = async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync()
        const hash = await bcrypt.hash(process.env.admin_pass, saltRounds)
        await User.create({
            firstName: 'admin',
            lastName: 'admin',
            middleName: 'admin',
            login: process.env.admin_login,
            password: hash,
            role: "ADMIN"
        })
        console.info('superuser created')
    } catch(error) {
        console.info(error)
    }
}

createAdmin()
