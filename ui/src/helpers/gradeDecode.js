export default function gradeDecode (gradeId) {
  if (gradeId === 1) {
    return 'Уровень 1 (Подбор)'
  }

  if (gradeId === 2) {
    return 'Уровень 2 (Стажер)'
  }

  if (gradeId === 3) {
    return 'Уровень 3 (Специалист)'
  }

  if (gradeId === 4) {
    return 'Уровень 4 (Консультант)'
  }

  if (gradeId === 5) {
    return 'Уровень 5 (Старший консультант)'
  }

  if (gradeId === 6) {
    return 'Уровень 6 (Руководитель группы)'
  }
}
