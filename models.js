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

const courseQuiz = sequelize.define('Quiz' , {
  name: { 
    type: DataTypes.STRING 
  },
  questions: {
    type: DataTypes.TEXT
  }
})

const Event = sequelize.define('Event', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  start: {
    type: DataTypes.DATE,
    allowNull: false
  },
  end: {
    type: DataTypes.DATE,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  educationForm: {
    type: DataTypes.STRING,
    allowNull: false
  },
  educationType: {
    type: DataTypes.STRING,
    allowNull: false
  },
  projects: {
    type: DataTypes.STRING,
    allowNull: false
  },
  vacancies: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  freeVacancies: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  place: {
    type: DataTypes.STRING
  }
})

const UserEvent = sequelize.define('UserEvent', {
  id: {
    type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true
  }
})

const Competencies = sequelize.define('Competencies', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  }  
})

const UserCompetencies = sequelize.define('UserCompetencies', {
  id: {
    type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true
  },
  isDeserved: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  isGrowth: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  }
})

//Associations
User.hasMany(User)
User.belongsTo(User)

Grade.hasOne(User)
User.belongsTo(Grade)

Grade.hasOne(Competencies)
Competencies.belongsTo(Grade)

User.belongsToMany(Course, {through: UserCourse})
Course.belongsToMany(User, {through: UserCourse })

Course.hasOne(courseQuiz)
courseQuiz.belongsTo(Course)

Event.belongsToMany(User, { through: UserEvent })
User.belongsToMany(Event, { through: UserEvent })

Competencies.belongsToMany(User, { through: UserCompetencies })
User.belongsToMany(Competencies, { through: UserCompetencies })

module.exports = {
    User,
    Course,
    UserCourse,
    Grade,
    courseQuiz,
    Event,
    UserEvent,
    Competencies,
    UserCompetencies
}

