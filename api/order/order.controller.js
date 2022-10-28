const logger = require('../../services/logger.service')
const userService = require('../user/user.service')
const authService = require('../auth/auth.service')
const socketService = require('../../services/socket.service')
const orderService = require('././order.service')

async function getOrders(req, res) {
	var loggedinUser = authService.validateToken(req.cookies.loginToken)
	try {
		const orders = await orderService.query(req.query)
		res.send(orders)
	} catch (err) {
		logger.error('Cannot get orders', err)
		res.status(500).send({err: 'Failed to get orders'})
	}
}

async function addOrder(req, res) {
	var loggedinUser = authService.validateToken(req.cookies.loginToken)
	try {
		const order = req.body
		order.mainGuest.guestId = loggedinUser._id
		const addedOrder = await orderService.add(order)
		return res.json(addedOrder)
	} catch (err) {
		logger.error('Failed to add order', err)
		res.status(500).send({err: 'Failed to add order'})
	}
}
async function addReview(req, res) {
	var loggedinUser = authService.validateToken(req.cookies.loginToken)
	console.log('loggedinUser:', loggedinUser)
	try {
		const order = req.body
		console.log('order:', order)
		// this.newReview.by.fullname = this.loginUser.fullname
		//   this.newReview.by.imgUrl = this.loginUser.imgUrl
		//   this.newReview.by._id = this.loginUser._id
		// order.mainGuest.guestId = loggedinUser._id
		// const addedOrder = await orderService.add(order)
		return res.json(addedOrder)
	} catch (err) {
		logger.error('Failed to add order', err)
		res.status(500).send({err: 'Failed to add order'})
	}
}

module.exports = {
	getOrders,
	//getGuestOrders,
	//getHostOrders,
	//deleteOrder,
	addOrder,
	//getOrderById,
	updateOrder,
}

// async function getGuestOrders(req, res) {
// 	var loggedinUser = authService.validateToken(req.cookies.loginToken)

// 	try {
// 		const orders = await orderService.query(req.query, loggedinUser)
// 		res.send(orders)
// 	} catch (err) {
// 		logger.error('Cannot get orders', err)
// 		res.status(500).send({err: 'Failed to get orders'})
// 	}
// }

// async function getHostOrders(req, res) {
// 	var loggedinUser = authService.validateToken(req.cookies.loginToken)

// 	try {
// 		const orders = await orderService.query(req.query, loggedinUser)
// 		res.send(orders)
// 	} catch (err) {
// 		logger.error('Cannot get orders', err)
// 		res.status(500).send({err: 'Failed to get orders'})
// 	}
// }

// async function deleteOrder(req, res) {
// 	try {
// 		const deletedCount = await orderService.remove(req.params.id)
// 		if (deletedCount === 1) {
// 			res.send({msg: 'Deleted successfully'})
// 		} else {
// 			res.status(400).send({err: 'Cannot remove order'})
// 		}
// 	} catch (err) {
// 		logger.error('Failed to delete order', err)
// 		res.status(500).send({err: 'Failed to delete order'})
// 	}
// }

// async function addOrder(req, res) {

//     var loggedinUser = authService.validateToken(req.cookies.loginToken)

//     try {
//         var order = req.body
//         order.byUserId = loggedinUser._id
//         order = await orderService.add(order)

//         // prepare the updated order for sending out
//         order.aboutUser = await userService.getById(order.aboutUserId)

//         // Give the user credit for adding a order
//         // var user = await userService.getById(order.byUserId)
//         // user.score += 10
//         loggedinUser.score += 10

//         loggedinUser = await userService.update(loggedinUser)
//         order.byUser = loggedinUser

//         // User info is saved also in the login-token, update it
//         const loginToken = authService.getLoginToken(loggedinUser)
//         res.cookie('loginToken', loginToken)

//         socketService.broadcast({type: 'order-added', data: order, userId: loggedinUser._id.toString()})
//         socketService.emitToUser({type: 'order-about-you', data: order, userId: order.aboutUserId})

//         const fullUser = await userService.getById(loggedinUser._id)
//         socketService.emitTo({type: 'user-updated', data: fullUser, label: fullUser._id})

//         res.send(order)

//     } catch (err) {
//         logger.error('Failed to add order', err)
//         res.status(500).send({ err: 'Failed to add order' })
//     }
// }

// async function getOrderById(req, res) {
// 	try {
// 		const orderId = req.params.id
// 		const order = await orderService.getById(orderId)
// 		res.json(order)
// 	} catch (err) {
// 		logger.error('Failed to get order', err)
// 		res.status(500).send({err: 'Failed to get order'})
// 	}
// }

async function updateOrder(req, res) {
	console.log('req:', req)
	try {
		const order = req.body
		const updatedOrder = await orderService.update(order)
		res.json(updatedOrder)
	} catch (err) {
		logger.error('Failed to update order', err)
		res.status(500).send({err: 'Failed to update order'})
	}
}
