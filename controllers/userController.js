const { User, Grade } = require('../models')
const jwt = require('jsonwebtoken') 
const bcrypt = require('bcrypt');
const saltRounds = 10

class UserController {
  async registration(req, res) {
    try {
      const {
        firstName,
        lastName,
        middleName,
        login,
        password,
        role,
        isLeader,
        userIds = [],
        leaderId = null
      } = req.body
      let candidate = {}
      let hash = {}
      let fields = { 
        firstName: firstName,
        lastName: lastName ,
        middleName: middleName ,
        login: login ,
        password: password 
      }
      let fieldsKeys = {
        firstName: 'Имя',
        lastName: 'Фамилия',
        middleName: 'Отчество',
        login: 'Логин',
        password: 'Пароль'
      }
      const keys = Object.keys(fieldsKeys)
      let createdUser = {}
      let findUser = {}

      for (let i = 0; i < keys.length; i++) {
        if (fields[keys[i]].length === 0) {
          return res.status(400).json({ error: `Поле ${fieldsKeys[keys[i]]} не должен быть пустым` })
        }
      }
      candidate = await User.findOne({where: {login}})
      if (candidate) {
        return res.status(400).json({ error: 'Сотрудник с таким логином уже существует' })
      }
      hash = await bcrypt.hash(password, saltRounds)
      createdUser = await User.create({
        firstName,
        lastName,
        middleName,
        login,
        password: hash,
        role: isLeader ? "LEADER" : role,
        UserId: leaderId
      })
      
      if (userIds.length !== 0) {
        for (let i = 0; i < userIds.length; i++) {
          console.log(createdUser.id)
          findUser = await User.findOne({where: { id : userIds[i] }})
          await findUser.update({UserId: createdUser.id})
        }
      }


      res.status(200).json({ message: 'Сотрудник успешно создан' })
    } catch(error) {
      console.log('---')
      console.log(error, 'AuthControll registration error')
      console.log('---')
      res.status(400).json({
          message: 'Неизвестная ошибка при регистрации'
      })
  }
}

  async login(req, res) {
    try {
      const {login, password} = req.body
      const user = await User.findOne({ where : { login: login } })
      let comparePassword = {}
      let token = {}

      if (login.length === 0) {
        return res.status(400).json({ error: 'Поле Логин не должен быть пустым' })
      }
      
      if (password.length === 0) {
        return res.status(400).json({ error: 'Поле Пароль не должен быть пустым' })
      }

      if (!user) {
          return res.status(400).json({ error: `Пользователь ${login} не найден` })
      }

      comparePassword = await bcrypt.compare(password, user.password)
      if (comparePassword) {
        token = jwt.sign({id: user.id, 
          firstName: user.firstName,
          middleName: user.middleName,
          lastName: user.lastName,
          role: user.role,
          UserId: user.UserId
        }, process.env.SECRET_KEY, {expiresIn: '24h'})
        return res.status(200).json({ token: token })
      } else {
        return res.status(403).json({error: 'Неверный пароль'})
      }
    } catch(error) {
        console.log('----')
        console.log(error, 'UserControll login error')
        console.log('-----')
        res.status(400).json({
          error: 'Неизвестная ошибка авторизации'
        })
    }
  }

  async isAuth(req, res) {
    try {
      const token = req.headers.authorization.split(' ')[1]
      let decode = {}
      if (!token || token === 'null') {
        return res.status(403).json({ message: 'Не авторизован' })
      }
      decode = jwt.verify(token, process.env.SECRET_KEY)
      return res.status(200).json({message: 'Авторизован'})  
    } catch (error) {
      console.log('----')
      console.log(error, 'UserControll isAuth error')
      console.log('-----')
      res.status(400).json({
        error: 'Неизвестная ошибка проверки авторизации'
      })
    }
  }

  async allUsers(req, res) {
    try {
      const users = await User.findAll({
        attributes: ['id', 'firstName', 'middleName', 'lastName', 'role', 'UserId']
      })
      const filteredUsers = users.filter(user => user.role !== process.env.ADMIN_ROLE)
      return res.status(200).json({ users: filteredUsers })
    } catch(error) {
      console.log('---')
      console.log(error, 'AuthControll registration error')
      console.log('---')
      res.status(400).json({
          message: 'Неизвестная ошибка при получение сотрудников'
      })
    }
  }

  async getLeader(req, res) {
    try {
      const { UserId } = req.body

      const user = await User.findOne({where: { id: UserId }})

      return res.status(200).json({ user: user })
    } catch (error) {
      console.log('---')
      console.log(error, 'AuthControll getLeader error')
      console.log('---')
      res.status(400).json({
          message: 'Неизвестная ошибка при получение руководителя'
      })
    }
  }

  async usersFromLeader(req, res) {
    try {
      const { id } = req.body

      const users = await User.findAll({where: { UserId: id }})
      return res.status(200).json({users: users})
    } catch(error) {
      console.log('---')
      console.log(error, 'AuthControll getLeader error')
      console.log('---')
      res.status(400).json({
          message: 'Неизвестная ошибка при получение руководителя'
      })
    }
  }

  async gradesList(req, res) {
    try {
      const grades = await Grade.findAll()
      return res.status(200).json({grades})
    } catch (error) {
      console.log('---')
      console.log(error, 'AuthControll gradesList error')
      console.log('---')
      res.status(400).json({
          message: 'Неизвестная ошибка при получение список компетенции' 
      })
    }
  }
  
}

module.exports = new UserController()
