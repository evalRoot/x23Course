const { Event, UserEvent, User } = require('../models')

class EventController {
  async create (req, res) {
    try {
      const {
        title,
        description,
        start,
        end,
        educationForm,
        educationType,
        projects,
        event,
        vacancies,
        place
      } = req.body

      const eventInstance = await Event.create({
        title,
        description,
        start,
        end,
        educationForm,
        educationType,
        projects,
        event,
        vacancies,
        freeVacancies: vacancies,
        place
      })

      return res.status(200).json({
        id: eventInstance.id,
        message: 'Мероприятие успешно создано'
      })
    } 
    catch(error) {
      console.log('---')
      console.log(error, 'EventController create error')
      console.log('---')
      res.status(400).json({
          message: 'Неизвестная ошибка при создание мероприятие'
      })
    }
  }

  async edit (req, res) {
    const {
      title,
      description,
      start,
      end,
      educationForm,
      educationType,
      projects,
      event,
      vacancies,
      eventId,
      place
    } = req.body

    await Event.update({
      title,
      description,
      start,
      end,
      educationForm,
      educationType,
      projects,
      event,
      vacancies,
      freeVacancies: vacancies,
      place
    }, {
      where: {
        id: eventId
      }
    })

    return res.status(200).json({
      message: 'Мероприятие успешно отредактировано'
    })
  }

  async allEvents (req, res) {
    try {
      const events = await Event.findAll()

      return res.status(200).json({events})
    } catch(error) {
      console.log('---')
      console.log(error, 'EventController create error')
      console.log('---')
      res.status(400).json({
          message: 'Неизвестная ошибка при получении мероприятий'
      })
    }
  }

  async delete (req, res) {
    try {
      const { eventId } = req.body

      const event = await Event.findOne({where: { id: eventId }})
      await event.destroy()

      return res.status(200).json({
        message: 'Мероприятие успешно удаленно'
      })
    } catch(error) {
      console.log('---')
      console.log(error, 'EventController delete error')
      console.log('---')
      res.status(400).json({
          message: 'Неизвестная ошибка при удалении мероприятия'
      })
    }

  }

  async usersEvents (req, res) {
    try {
      const { id } = req.body
      const userEvents = await UserEvent.findAll({ where: { UserId: id } })
      const userEventsIds = userEvents.map(userEvent => userEvent.EventId)
      const events = await Event.findAll({ where: {id : userEventsIds } })

      return res.status(200).json({
        events
      })
    } catch(error) {
      console.log('---')
      console.log(error, 'EventController usersEvents error')
      console.log('---')
      res.status(400).json({
          message: 'Неизвестная ошибка при получении мероприятий сотрудника'
      })
    }
  }

  async event (req, res) {
    try {
      const { id } = req.body
      const event = await Event.findOne({ where: {id} })
      return res.status(200).json({
        event
      })
    } catch (error) {
      console.log('---')
      console.log(error, 'EventController event error')
      console.log('---')
      res.status(400).json({
          message: 'Неизвестная ошибка при получении мероприятия'
      })
    }
  }
  
  async assignEvent (req, res) {
    try {
      const online = 'Онлайн'
      const { eventId, userId } = req.body 
      const event = await Event.findOne({ where: {id: eventId} })
      const user = await User.findOne({ where: {id: userId} })

      console.log(event, 'event')
      console.log(user, 'user')

      if (event.freeVacancies !== 0 && event.educationForm !== online) {
        await UserEvent.create({
          EventId: event.id,
          UserId: user.id
        })

        await Event.decrement({ freeVacancies: 1 }, { where: {id: eventId} })
      } else {
        await UserEvent.create({
          EventId: event.id,
          UserId: user.id
        })
      }


      return res.status(200).json({message: 'Запись успешна'})

    } catch (error) {
      console.log('---')
      console.log(error, 'EventController event error')
      console.log('---')
      res.status(400).json({
          message: 'Вы уже записаны'
      })
    }
  }

  async leaderAssignEvents (req, res) {
    try {
      const {id} = req.body
      const leaderUserEvents = []
      const users = await User.findAll({ where: {
        UserId: id
      }})
      let bufferObj = {}

      for (let i = 0; i < users.length; i++) {
        const userEvents = await UserEvent.findAll({ where: { UserId: users[i].id } })
        bufferObj.user = {
          id: users[i].id,
          user: `${users[i].firstName} ${users[i].lastName} ${users[i].middleName}`,
        }

        console.log(userEvents.length)
        for (let j = 0; j < userEvents.length; j++) {
          const events = await Event.findAll({ where: { id: userEvents.map(userEvent => userEvent.EventId)}})
          bufferObj.events = events || []
        }

        if (userEvents.length === 0) {
          bufferObj.events = []
        }


        leaderUserEvents.push(bufferObj)
        bufferObj = {}
      }

      return res.status(200).json({leaderUserEvents})

    } catch(error) {
      console.log('---')
      console.log(error, 'EventController leaderAssignEvents error')
      console.log('---')
      res.status(400).json({
          message: 'Неизвестная ошибка при получение мероприятий подчиненных'
      })
    }
  }

}

module.exports = new EventController()
