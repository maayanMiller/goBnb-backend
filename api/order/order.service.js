const dbService = require('../../services/db.service')
const logger = require('../../services/logger.service')
const ObjectId = require('mongodb').ObjectId
const asyncLocalStorage = require('../../services/als.service')
const fs = require('fs')

async function query(filterBy = {}) {
	try {
		const criteria = _buildCriteria(filterBy)
		const collection = await dbService.getCollection('order')
		const orders = await collection.find(criteria).toArray()
		return orders
	} catch (err) {
		logger.error('cannot find orders', err)
		throw err
	}
}

async function add(order) {
	try {
		const collection = await dbService.getCollection('order')
		const addedOrder = await collection.insertOne(order)
		return order
	} catch (err) {
		logger.error('cannot insert order', err)
		throw err
	}
}

function _buildCriteria(filterBy) {
	var criteria = {}
	// var userId = loggedinUser._id

	if (filterBy.type === 'trips') {
		criteria = {'mainGuest.guestId': filterBy.userId}
	}

	if (filterBy.type === 'orders') {
		criteria = {hostId: filterBy.userId}
	}
	if (filterBy.type === 'handleApprove') {
		criteria = {hostId: filterBy.userId}
	}
	return criteria
}

module.exports = {
	query,
	remove,
	add,
	update,
	getById,
}

async function remove(orderId) {
	try {
		const collection = await dbService.getCollection('order')
		const criteria = {_id: ObjectId(orderId)}
		const {deletedCount} = await collection.deleteOne(criteria)
		return deletedCount
	} catch (err) {
		logger.error(`cannot remove order ${orderId}`, err)
		throw err
	}
}

async function getById(orderId) {
	try {
		const collection = await dbService.getCollection('order')
		const order = collection.find({_id: ObjectId(orderId)})
		return order
	} catch (err) {
		logger.error(`while finding order ${orderId}`, err)
		throw err
	}
}

async function update(order) {
	try {
		var id = ObjectId(order._id)
		delete order._id
		const collection = await dbService.getCollection('order')
		await collection.updateOne({_id: id}, {$set: {...order}})
		order._id = id
		return order
	} catch (err) {
		logger.error(`cannot update order ${orderId}`, err)
		throw err
	}
}

//_saveOrders()
async function _saveOrders() {
	var orders = require('../../services/order.json')

	try {
		const collection = await dbService.getCollection('order')
		orders.forEach((order) => {
			// order._id = ObjectId(order._id)
			add(order)
		})
	} catch (err) {
		logger.error('cannot insert orders', err)
		throw err
	}
}
