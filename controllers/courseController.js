const { Course, UserCourse, User, courseQuiz } = require('../models')

class CourseController {
  async create(req, res) {
    try {
      const {course, questions} = req.body
  
      console.log(course)

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
      const { courseId, usersIds } = req.body
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
          failesAssign.push(`Сотрудник ${user.firstName} ${user.middleName} ${user.lastName} уже привязан к курсу ${course.name}`)
        } else {
          await UserCourse.create({
            UserId: usersIds[i],
            CourseId: courseId
          }),
          successAssign.push(`Сотрудник ${user.firstName} ${user.middleName} ${user.lastName} привязан к курсу ${course.name}`)
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
      const { userId} = req.body
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

      console.log(userCourse)

      return res.status(200).json({message: 'Успешно'})

    } catch (error) {
      console.log(error)
      res.status(400).json({
        message: 'Неизвестная ошибка при получении теста'
      })
    }
  }

}


module.exports = new CourseController()