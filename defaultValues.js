const { Grade } = require('./models')
const sequelize = require('./db')

const gradeDefaultValues = [
  'Уровень 1 (Подбор)', 
  'Уровень 2 (Стажер)', 
  'Уровень 3 (Специалист)', 
  'Уровень 4 (Консультант)', 
  'Уровень 5 (Старший консультант)', 
  'Уровень 6 (Руководитель группы)'
]

const createDefaultValues = async () => {
  try {
    await sequelize.authenticate()
    await sequelize.sync()
    let candidate = await Grade.findAll()
  
    if (candidate.length === 0) {
      for (let i = 0; i < gradeDefaultValues.length; i++) {
        await Grade.create({
          name: gradeDefaultValues[i]
        })
      }
    }
  } catch(error) {
    console.log(error)
   }
}


module.exports = {
  createDefaultValues
}
