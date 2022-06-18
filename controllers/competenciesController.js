const { Competencies, User, UserCompetencies } = require('../models')
const { gradeEncode } = require('../gradeEncode')

class competenciesController {
  async create(req, res) {
    try {
      const { name, gradeId } = req.body
      const candidate = await Competencies.findOne({ where: { name } })

      if (!candidate) {
        await Competencies.create({
          name,
          GradeId: gradeId
        })

        return res.status(200).json({ message: 'Компетенция создана' })
      }

      return res.status(400).json({ message: 'Компетенция с таким названием уже есть' })
    } catch (error) {
      console.log('---')
      console.log(error, 'competenciesController create error')
      console.log('---')
      res.status(400).json({
        message: 'Неизвестная ошибка при создание компетенции'
      })
    }
  }

  async get(req, res) {
    try {
      const competencies = await Competencies.findAll()
      return res.status(200).json({competencies})
    } catch (error) {
      console.log('---')
      console.log(error, 'competenciesController get error')
      console.log('---')
      res.status(400).json({
        message: 'Неизвестная ошибка при получение компетенций'
      })
    }
  }

  async assign(req, res) {
    try {
      const {selected, userId} = req.body
      let competence = ''
      const competencies = []
      const user = await User.findOne({where: {id: userId}})

      for (let i = 0; i < selected.length; i++) {
        competence = await Competencies.findOne({ where: {name: selected[i].name, GradeId: gradeEncode(selected[i].grade)}  })
        competencies.push(competence)
      }

  
      for (let j = 0; j < competencies.length; j++) {
        await UserCompetencies.create({
          isDeserved: false,
          isGrowth: false,
          CompetencyId: competencies[j].id,
          UserId: user.id
        })
      }

      return res.status(200).json({message: 'Успешно'})
    } catch (error) {
      console.log('---')
      console.log(error, 'competenciesController assign error')
      console.log('---')
      res.status(400).json({
        message: 'Неизвестная ошибка при добавление компетенций для пользователя'
      })
    }
  }

  async getAssigned (req, res) {
    try {
      const {id, gradeId} = req.body
      let userCompetencies = await UserCompetencies.findAll({ where: {UserId: id} })
      const competencies = []
      let competence = []


      if (userCompetencies.length === 0) {
        userCompetencies = await Competencies.findAll({where: { GradeId: gradeId } })
        
        for (let i = 0; i < userCompetencies.length; i++) {
          competencies.push({
            name: userCompetencies[i].name,
            isDeserved: false,
            isGrowth: false,
            gradeId: userCompetencies[i].GradeId,
            CompetencyId: userCompetencies[i].id
          })
        }

        const mapped = userCompetencies.map(obj => obj.dataValues)
        for (let j = 0; j < mapped.length; j++) {
          await UserCompetencies.create({
            isDeserved: false,
            isGrowth: false,
            CompetencyId: mapped[j].id,
            UserId: id
          })
        }
        return res.status(200).json({competencies})
      }

      for (let i = 0; i < userCompetencies.length; i++) {
        competence = await Competencies.findOne({ where: { id: userCompetencies[i].CompetencyId } })
        if (competence.length !== 0) {
          competencies.push({
            name: competence.name,
            isDeserved: userCompetencies[i].isDeserved,
            isGrowth: userCompetencies[i].isGrowth,
            gradeId: competence.GradeId,
            CompetencyId: userCompetencies[i].CompetencyId
          })
        }
      }

      return res.status(200).json({competencies})

    } catch(error) {
      console.log('---')
      console.log(error, 'competenciesController assign error')
      console.log('---')
      res.status(400).json({
        message: 'Неизвестная ошибка при добавление компетенций для пользователя'
      })
    }
        
  }

  async save (req, res) {
    try {
      const { competencies, userId } = req.body

      for (let i = 0; i < competencies.length; i++) {
        await UserCompetencies.update(
        {
          isDeserved: competencies[i].isDeserved,
          isGrowth: competencies[i].isGrowth
        },
        { where: {
          CompetencyId: competencies[i].CompetencyId,
          UserId: userId
        }})
      }

      return res.status(200).json({ message: 'Успешно' })
    } catch (error) {
      console.log('---')
      console.log(error, 'competenciesController save error')
      console.log('---')
      res.status(400).json({
        message: 'Неизвестная ошибка при сохранение компетенций для пользователя'
      })
    }
  }

}

module.exports = new competenciesController()
