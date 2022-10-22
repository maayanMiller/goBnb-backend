const dbService = require('../../services/db.service')
// const logger = require('../../services/logger.service')
const ObjectId = require('mongodb').ObjectId
const asyncLocalStorage = require('../../services/als.service')
const fs = require('fs')

async function query(filterBy = {}) {
	try {
		const criteria = _buildCriteria(filterBy)
		const collection = await dbService.getCollection('stay')
		const stays = await collection.find(criteria).toArray()
		//console.log('stays:', stays.length)

		return stays
	} catch (err) {
		console.log(err)
		// logger.error('cannot find stays', err)
		throw err
	}
}

async function remove(stayId) {
	try {
		const collection = await dbService.getCollection('stay')
		const criteria = {_id: ObjectId(stayId)}
		const {deletedCount} = await collection.deleteOne(criteria)
		return deletedCount
	} catch (err) {
		// logger.error(`cannot remove stay ${stayId}`, err)
		throw err
	}
}

async function add(stay) {
	try {
		const collection = await dbService.getCollection('stay')
		const addedStay = await collection.insertOne(stay)
		return stay
	} catch (err) {
		// logger.error('cannot insert stay', err)
		throw err
	}
}

function _buildCriteria(filterBy) {
	var criteria = {}

	if (filterBy.country) {
		var txtCriteria = {$regex: filterBy.country, $options: 'i'}
		criteria = {
			$or: [
				{'address.country': txtCriteria},
				{'address.city': txtCriteria},
				{'address.street': txtCriteria},
			],
		}
	}

	if (filterBy.tag) {
		var txtCriteria = {$regex: filterBy.tag, $options: 'i'}
		criteria.tags = txtCriteria
	}
	if (filterBy.byAmenities) {
		criteria.amenities = {$in: filterBy.byAmenities}
	}
	if (filterBy.byPrice) {
		criteria.price = {$gte: +filterBy.byPrice[0], $lte: +filterBy.byPrice[1]}
	}
	return criteria
}

async function getById(stayId) {
	try {
		const collection = await dbService.getCollection('stay')
		const stay = collection.findOne({_id: ObjectId(stayId)})
		return stay
	} catch (err) {
		// logger.error(`while finding stay ${stayId}`, err)
		throw err
	}
}

async function update(stay) {
	try {
		var id = ObjectId(stay._id)
		delete stay._id
		const collection = await dbService.getCollection('stay')
		await collection.updateOne({_id: id}, {$set: {...stay}})
		stay._id = id
		return stay
	} catch (err) {
		// logger.error(`cannot update stay ${stayId}`, err)
		throw err
	}
}

module.exports = {
	query,
	remove,
	add,
	update,
	getById,
}

async function _saveStays() {
	const stays = require('../../services/stay.json')

	try {
		const collection = await dbService.getCollection('stay')
		stays.forEach((stay) => {
			stay._id = ObjectId(stay._id)
			add(stay)
		})
	} catch (err) {
		// logger.error('cannot insert stays', err)
		throw err
	}
}
