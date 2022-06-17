function gradeEncode (grade) {
    if (grade === 'Уровень 1 (Подбор)') {
      return 1
    }
  
    if (grade === 'Уровень 2 (Стажер)') {
      return 2
    }
  
    if (grade === 'Уровень 3 (Специалист)') {
      return 3
    }
  
    if (grade === 'Уровень 4 (Консультант)') {
      return 4
    }
  
    if (grade === 'Уровень 5 (Старший консультант)') {
      return 5
    }
  
    if (grade === 'Уровень 6 (Руководитель группы)') {
      return 6
    }
  }
  

module.exports = {
  gradeEncode
}
