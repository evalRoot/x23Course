const { Course, UserCourse, User, courseQuiz } = require('../models')

class CourseController {
  async create(req, res) {
    try {
      const {course, questions} = req.body

      if (course.name.length !== 0 && course.modules.length !== 0) {
        const courseCurr = await Course.create({
          name: course.name,
          modules: JSON.stringify(course.modules)
        })
        await courseQuiz.create({
          name: `Тест Курса ${course.name}`,
          questions: JSON.stringify(questions),
          CourseId: courseCurr.id
        })
  
        return res.status(200).json({ message: 'Курс создан', id: courseCurr.id})
      } else {
        if (name.length === 0) {
          return res.status(400).json({ error: `Поле 'Название курса' не должно быть пустым` })
        }
      }
    } catch(error) {
      console.log('---')
      console.log(error, 'CourseController create error')
      console.log('---')
      res.status(400).json({
        message: 'Неизвестная ошибка при сохранение курса'
      })
    }
  }

  async course(req, res) {
    try {
      const { id } = req.body
      const course = await Course.findOne({ where: { id } })
      if (!course) {
        return res.status(404).json({
          message: 'Не найдено'
        })
      }

      return res.status(200).json({ 
        name: course.name,
        modules: course.modules
      })
    } catch (error) {
      console.log('---')
      console.log(error, 'CourseController get error')
      console.log('---')
      res.status(400).json({
        message: 'Неизвестная ошибка при получении курса'
      })
    }
  }

  async all(req, res) {
    try {
      const courses = await Course.findAll({attributes: ['id', 'name']})
      return res.status(200).json({
        courses
      })
    } catch (error) {
      console.log('---')
      console.log(error, 'CourseController get error')
      console.log('---')
      res.status(400).json({
        message: 'Неизвестная ошибка при получении курсов'
      })
    }
  }

  async assign(req, res) {
    try {
      const { courseId, usersIds, activationDate} = req.body
      let candidate = {}
      let successAssign = []
      let failesAssign = []
      let user = {}
      let course = {}

      for (let i = 0; i < usersIds.length; i++) {
        candidate = await UserCourse.findOne({ where: { UserId: usersIds[i], CourseId: courseId } })
        user = await User.findOne({ where: { id: usersIds[i] }})
        course = await Course.findOne({ where: {id: courseId} })
        if (candidate) {
          failesAssign.push(`Сотрудник ${user.firstName} ${user.middleName} ${user.lastName} уже привязан/а к курсу ${course.name}`)
        } else {
          await UserCourse.create({
            UserId: usersIds[i],
            CourseId: courseId,
            activationDate
          }),
          successAssign.push(`Сотрудник: ${user.firstName} ${user.middleName} ${user.lastName} привязан/а к курсу ${course.name}`)
        }
      }

      return res.status(200).json({ successAssign, failesAssign })

    } catch (error) {
      console.log('---')
      console.log(error, 'CourseController get error')
      console.log('---')
      res.status(400).json({
        message: 'Неизвестная ошибка при получении курса'
      })
    }
  }

  async assignCourses(req, res) {
    try {
      let course = ''
      const { userId } = req.body
      const userCourses = await UserCourse.findAll({where: { UserId: userId }})
      let userCoursesCopy = userCourses.slice()
      for (let i = 0; i < userCoursesCopy.length; i++) {
        course = await Course.findOne({where: {id: userCourses[i].CourseId}})
        userCoursesCopy[i].dataValues.name = course.name
      }
      return res.status(200).json({courses: userCoursesCopy})
    } catch(error) {
      console.log(error)
      res.status(400).json({
        message: 'Неизвестная ошибка при получении курсов пользователя'
      })
    }
  }

  async courseQuiz(req, res) {
    try {
      const {id} = req.body
      const quiz = await courseQuiz.findOne({ where: { CourseId: id } })

      return res.status(200).json({
        quiz
      })
    } catch(error) {
      console.log(error)
      res.status(400).json({
        message: 'Неизвестная ошибка при получении теста'
      })
    }
  }

  async finishQuiz(req, res) {
    try {
      const {
        courseId,
        userId,
        startDate,
        endDate,
        score,
        status
      } = req.body

      const userCourse = await UserCourse.findOne({ where: {
        CourseId: courseId,
        UserId: userId
      }})

      userCourse.update({
        startDate,
        endDate,
        score,
        status
      })

      return res.status(200).json({message: 'Успешно'})

    } catch (error) {
      console.log(error)
      res.status(400).json({
        message: 'Неизвестная ошибка при получении теста'
      })
    }
  }

  async delete(req, res) {
    try {
      const {id} = req.body

      const courseCurr = await Course.findOne(
      {
        where: {
          id
        }
      })

      const quizCurr = await courseQuiz.findOne(
      {
        where: {
          CourseId: id
        }
      })

      await quizCurr.destroy()
      await courseCurr.destroy()

      return res.status(200).json({ message: 'Курс Удален'})
    } catch(error) {
      console.log('---')
      console.log(error, 'CourseController edit error')
      console.log('---')
      res.status(400).json({
        message: 'Неизвестная ошибка при редактирование курса'
      })
    }
  }

  async edit(req, res) {
    try {
      const {course, questions, id} = req.body

      if (course.name.length !== 0 && course.modules.length !== 0) {

        await Course.update({
          name: course.name,
          modules: JSON.stringify(course.modules)
        },
        {
          where: {
            id
          }
        })

        await courseQuiz.update({
          questions: JSON.stringify(questions),
        },
        {
          where: {
            CourseId: id
          }
        })
  
        return res.status(200).json({ message: 'Курс изменен'})
      } else {
        if (name.length === 0) {
          return res.status(400).json({ error: `Поле 'Название курса' не должно быть пустым` })
        }
      }
    } catch(error) {
      console.log('---')
      console.log(error, 'CourseController edit error')
      console.log('---')
      res.status(400).json({
        message: 'Неизвестная ошибка при редактирование курса'
      })
    }
  }

  async isAssigned(req, res) {
    try {
      const {userId, courseId} = req.body
      const candidate = await UserCourse.findOne({ where: {
        UserId: userId,
        CourseId: courseId
      } })
      let finish = false
      if (candidate) {
        if (candidate.score > 70) {
          finish = true
        }

        return res.status(200).json({ access: true, finish })
      }

      return res.status(200).json({ access: false })
      

    } catch(error) {
      console.log('---')
      console.log(error, 'CourseController isAssigned error')
      console.log('---')
      res.status(400).json({
        message: 'Неизвестная ошибка при получение доступа к курсу'
      })
    }
  }

  async assignedLeader(req, res) {
    try {
      const {id} = req.body
      const courses = await Course.findAll()
      const usersCourses = []
      const users = await User.findAll({ where: { UserId: id } })
      const mappedCourses= courses.map(user => ({ name: user.name, id: user.id }))
      let bufferObj = {}
      
      for (let i = 0; i < users.length; i++) {
        bufferObj.user = {
          id: users[i].id,
          user: `${users[i].firstName} ${users[i].lastName} ${users[i].middleName}`,
        }
        bufferObj.userCourses = await UserCourse.findAll({ where: { UserId: users[i].id } })
        usersCourses.push(bufferObj)
        bufferObj = {}
      }

      return res.status(200).json({ mappedCourses, usersCourses })
    } catch(error) {
      console.log('---')
      console.log(error, 'CourseController isAssigned error')
      console.log('---')
      res.status(400).json({
        message: 'Неизвестная ошибка при получение доступа к курсу'
      })
    }

  }

}


module.exports = new CourseController()