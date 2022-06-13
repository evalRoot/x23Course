const { Event, } = require('../models')

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
        vacancies
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
        freeVacancies: vacancies
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
      eventId
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
      freeVacancies: vacancies
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
          message: 'Неизвестная ошибка при редактирование мероприятия'
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

}

module.exports = new EventController()
