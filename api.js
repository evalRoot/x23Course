const Router = require('express')
const router = new Router()
const userController = require('./controllers/userController')
const courseController = require('./controllers/courseController')
const checkRoleMiddleware = require('./middleware/checkRoleMiddleware')

router.post('/registration', checkRoleMiddleware, userController.registration)
router.post('/login', userController.login)
router.get('/isAuth', userController.isAuth)
router.get('/allUsers', checkRoleMiddleware, userController.allUsers)
router.post('/getLeader', userController.getLeader)
router.post('/addCouse', courseController.create)
router.post('/course', courseController.course)
router.get('/allCourse', courseController.all)
router.post('/assignCourse', courseController.assign)
router.post('/assignCourses', courseController.assignCourses)
router.post('/assignUsers', userController.usersFromLeader)

module.exports = router
