const express = require('express')
// const {requireAuth, requireAdmin} = require('../../middlewares/requireAuth.middleware')
// const {log} = require('../../middlewares/logger.middleware')
const { addStay, getStays, deleteStay ,getStayById, updateStay} = require('./stay.controller')
const router = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

router.get('/', getStays)
router.post('/', addStay)
router.delete('/:id', deleteStay)

router.get('/:id', getStayById)
router.put('/:id', updateStay)


// router.get('/', log, getStays)
// router.post('/',  log, requireAuth, addStay)
// router.delete('/:id',  requireAuth, deleteStay)

module.exports = router