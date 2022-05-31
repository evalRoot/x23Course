const jwt = require('jsonwebtoken')

module.exports = function(req, res, next) {
  if (req.method === "OPTIONS") {
    next()
  }
  try {
    const token = req.headers.authorization.split(' ')[1] // Bearer asfasnfkajsfnjk
    if (!token) {
      return res.status(401).json({message: "Не авторизован"})
    }
    const decoded = jwt.verify(token, process.env.SECRET_KEY)
    if (decoded.role !== process.env.ADMIN_ROLE) {
      return res.status(403).json({message: "Нет доступа"})
    }
    next()
  } catch (e) {
    res.status(401).json({message: "Не авторизован"})
  }
}
