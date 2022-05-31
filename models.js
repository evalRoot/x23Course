const sequelize = require('./db')
const { DataTypes } = require('sequelize')

const User = sequelize.define('User', {
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  middleName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  login: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.STRING,
    defaultValue: 'USER'
  }
})

const Course = sequelize.define('Course', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  modules: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  activationDate: {
    type: DataTypes.DATE,
  },
  startDate: {
    type: DataTypes.DATE
  },
  endDate: {
    type: DataTypes.DATE
  },
  score: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'Не пройден'
  }
}) 


//todo

//test
// id
//...

// questions:
// id | question

// answers:
// id | question_id | answer

// answer_user
// answer_id | user_id (или question_id | answer_id | user_id)

//Associations
User.hasMany(User)
User.belongsTo(User)

User.belongsToMany(Course, {through: UserCourse})
Course.belongsToMany(User, {through: UserCourse })


module.exports = {
    User,
    Course,
    UserCourse
}

