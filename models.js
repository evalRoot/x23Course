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
  }
}) 

const UserCourse = sequelize.define('UserCourse', {
  id: {
    type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true
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

const Grade = sequelize.define('Grade', {
  name: {
    type: DataTypes.STRING
  }
})

const courseQuiz = sequelize.define('Test' , {
  name: { 
    type: DataTypes.STRING 
  },
  questions: {
    type: DataTypes.TEXT
  }
})

//Associations
User.hasMany(User)
User.belongsTo(User)

Grade.hasOne(User)
User.belongsTo(Grade)

User.belongsToMany(Course, {through: UserCourse})
Course.belongsToMany(User, {through: UserCourse })

Course.hasOne(courseQuiz)
courseQuiz.belongsTo(Course)


module.exports = {
    User,
    Course,
    UserCourse,
    Grade,
    courseQuiz
}

