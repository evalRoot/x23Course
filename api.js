const Router = require('express')
const router = new Router()
const userController = require('./controllers/userController')
const courseController = require('./controllers/courseController')
const eventController = require('./controllers/eventController')
const competenciesController = require('./controllers/competenciesController')
const checkRoleMiddleware = require('./middleware/checkRoleMiddleware')

router.post('/registration', checkRoleMiddleware, userController.registration)
router.post('/login', userController.login)
router.get('/isAuth', userController.isAuth)
router.get('/allUsers', checkRoleMiddleware, userController.allUsers)
router.post('/getLeader', userController.getLeader)
router.post('/addCouse', checkRoleMiddleware, courseController.create)
router.post('/course', courseController.course)
router.get('/allCourse', courseController.all)
router.post('/assignCourse', courseController.assign)
router.post('/assignCourses', courseController.assignCourses)
router.post('/assignUsers', userController.usersFromLeader)
router.get('/gradesList', userController.gradesList)
router.post('/courseQuiz', courseController.courseQuiz)
router.post('/finishQuiz', courseController.finishQuiz)
router.post('/addEvent', checkRoleMiddleware, eventController.create)
router.post('/editEvent', checkRoleMiddleware, eventController.edit)
router.get('/events', eventController.allEvents)
router.post('/deleteEvent', checkRoleMiddleware, eventController.delete)
router.post('/event', eventController.event)
router.post('/assignEvent', eventController.assignEvent)
router.post('/assignEvents', eventController.usersEvents)
router.post('/editCourse', checkRoleMiddleware, courseController.edit)
router.post('/deleteCourse', checkRoleMiddleware, courseController.delete)
router.post('/isAssignedCourse', courseController.isAssigned)
router.post('/leaderAssignEvents', eventController.leaderAssignEvents)
router.post('/leaderAssignCourse', courseController.assignedLeader)
router.post('/createCompetence',  checkRoleMiddleware, competenciesController.create)
router.get('/competences', competenciesController.get)
router.post('/assignCompetences', competenciesController.assign)
router.post('/assignCompetencesList', competenciesController.getAssigned)
router.post('/saveCompetence', competenciesController.save)
router.post('/isAssignEvent', eventController.isAssign) 


module.exports = router
