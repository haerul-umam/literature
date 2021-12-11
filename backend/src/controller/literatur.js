const {Literatur, User, Collection, Cancel} = require("../../models")
const Joi = require("joi").extend(require("@joi/date"))
const moment = require("moment")
const sequelize = require("sequelize")
const { response, errorMessage, errorServer } = require("../../_helper/messages")

exports.addLiteratur = async (req, res) => {
    const schema = Joi.object({
        title: Joi.string().min(5).required(),
        pages: Joi.number().integer().required(),
        pubDate: Joi.date().format("YYYY-MM-DD").required(),
        isbn: Joi.string().min(13).required(),
        author: Joi.string().min(4).required()
    })

    const {error} = schema.validate(req.body)
    if (error) return errorMessage(res, error.details[0].message)
    
    try {
        const insert = await Literatur.create({...req.body, idUser: req.user.id, files: req.file.filename})
        const data = await Literatur.findOne({
            where: {id: insert.id},
            include: [
            {
                model:User,
                attributes: ["fullName","phone","email","address"],
                as:"user"
            }],
            attributes: {exclude:["createdAt","updatedAt","idUser"]},
            raw: true,
            nest: true
        })

        data.pubDate = moment(data.pubDate).format("D MMMM YYYY")

        const literatur = {...data}
        response(res, {literatur},"Add literatur successful")
    } catch (error) {
        if (error.name === "SequelizeUniqueConstraintError"){
            res.status(403).send({status:"failed", message: "ISBN already registered"})
        }
        errorServer(res)
    }
}


exports.getLiteratur = async (req, res) => {
    try {
        const data = await Literatur.findOne({
            where: {id: req.params.id},
            include: [
            {
                model:User,
                attributes: ["fullName","phone","email","address"],
                as:"user"
            }],
            attributes: {exclude:["createdAt","updatedAt","idUser"]},
            raw: true,
            nest: true
        })

        const collection = await Collection.findOne({
            where: {
                idLiteratur: req.params.id,
                idUser: req.user.id
            },
            raw: true
        })

        data.pubDate = moment(data.pubDate).format("MMMM YYYY")
        data.files = `http://127.0.0.1:3333/static/pdf/${data.files}`
        data.collection = collection ? "Y" : "N"

        const literatur = {...data}
        response(res, {literatur})
    } catch (error) {
        console.log(error)
        errorServer(res)
    }
}

exports.getCancelLiteratur = async (req, res) => {
    try {
        const cancel = await Cancel.findOne({
            where: {idLiteratur: req.params.id},
            attributes: {exclude:["createdAt","updatedAt"]},
            limit: 1,
            raw: true,
            order: [['createdAt','DESC']],
        })

        response(res, {cancel})
    } catch (error) {
        console.log(error)
        errorServer(res)
    }
}


exports.getLiteraturs = async (req, res) => {
    try {
        let data = await Literatur.findAll({
            where: {status: "Approve"},
            include: [
            {
                model:User,
                attributes: ["fullName","phone","email","address"],
                as:"user"
            }],
            attributes: {exclude:["createdAt","updatedAt","idUser"]},
            raw: true,
            nest: true
        })

        const literatur = data.map(item => {
            return {...item, files: `http://127.0.0.1:3333/static/pdf/${item.files}`, pubDate: moment(item.pubDate).format("YYYY")}
        })
        response(res, {literatur})
    } catch (error) {
        console.log(error)
        errorServer(res)
    }
}


exports.masterDataLiteratur = async (req, res) => {
    try {
        let data = await Literatur.findAll({
            include: [
            {
                model:User,
                attributes: ["fullName","phone","email","address"],
                as:"user"
            }],
            attributes: {exclude:["createdAt","updatedAt","idUser"]},
            order: [['status','DESC']],
            raw: true,
            nest: true
        })

        const literatur = data.map(item => {
            return {...item, files: `http://127.0.0.1:3333/static/pdf/${item.files}`, pubDate: moment(item.pubDate).format("D MMMM YYYY")}
        })
        response(res, {literatur})
    } catch (error) {
        console.log(error)
        errorServer(res)
    }
}

exports.userLiteratur = async (req, res) => {
    try {
        let data = await Literatur.findAll({
            where: {idUser: req.user.id},
            include: [
            {
                model:User,
                attributes: ["fullName","phone","email","address"],
                as:"user"
            }],
            attributes: {exclude:["createdAt","updatedAt","idUser"]},
            raw: true,
            nest: true
        })

        const literatur = data.map(item => {
            return {...item, files: `http://127.0.0.1:3333/static/pdf/${item.files}`, pubDate: moment(item.pubDate).format("YYYY-MM-D")}
        })
        response(res, {literatur})
    } catch (error) {
        console.log(error)
        errorServer(res)
    }
}

exports.searchLiterature = async (req, res) => {
    try {
        const data = await Literatur.findAll({
            where: sequelize.literal(
                "MATCH(`Literatur`.`title`,`Literatur`.`isbn`,`Literatur`.`author`) AGAINST(:search IN BOOLEAN MODE) AND status = 'Approve' AND YEAR(pubDate) <= :y"
            ),
            replacements: {search: `${req.query.q}*`, y: req.query.year},
            include: [
                {
                    model:User,
                    attributes: ["fullName","phone","email","address"],
                    as:"user"
                }],
                attributes: {exclude:["createdAt","updatedAt","idUser"]},
                raw: true,
                nest: true
        })
        const literatur = data.map(item => {
            return {...item, files: `http://127.0.0.1:3333/static/pdf/${item.files}`, pubDate: moment(item.pubDate).format("YYYY")}
        })

        response(res, {literatur})
    } catch (error) {
        console.log(error)
        errorServer(res)
    }
}

exports.updateLiteratur = async (req, res) => {
    const schema = Joi.object({
        status: Joi.string(),
        message: Joi.string()
    })
    const {error} = schema.validate(req.body)
    if (error) return errorMessage(res, error.details[0].message)

    if (req.user.role === "user" && req.body?.status) return errorMessage (res, "Unauthorized")

    try {
        if (req.body.message){
            await Cancel.create({reason: req.body.message, idLiteratur: req.params.id})
        }

        const update = await Literatur.update({...req.body}, {where: {id : req.params.id}})
        let literatur = req.body
        if (update[0] === 1) return response(res, {literatur}, "Update literatur successful")
    } catch (error) {
        errorServer(res)
    }
}

exports.reApplyLiteratur = async (req, res) => {
    const schema = Joi.object({
        title: Joi.string().min(5),
        pages: Joi.number().integer(),
        pubDate: Joi.date().format("YYYY-MM-DD"),
        isbn: Joi.string().min(13),
        author: Joi.string().min(4)
    })
    const {error} = schema.validate(req.body)
    if (error) return errorMessage(res, error.details[0].message)

    try {
        let dataToUpdate = req.body
        if (req.file?.filename){
            dataToUpdate.files = req.file.filename
        }
        
        const update = await Literatur.update({...dataToUpdate, status: 'Waiting to be verified'}, {where: {id : req.params.id}})
        let literatur = req.body
        await Cancel.destroy({where: {idLiteratur: req.params.id}})
        if (update[0] === 1) return response(res, {literatur}, "Update literatur successful")
    } catch (error) {
        console.log(error)
        errorServer(res)
    }
}

exports.deleteLiteratur = async (req, res) => {
    try {
        const toCompare = await Literatur.findOne({
            where: {id: req.params.id},
            attributes: ["idUser","status"],
            raw: true
        })

        if ((toCompare.idUser !== req.user.id) || (toCompare.status !== "Cancel") ) return errorMessage(res, "Unauthorized")
        await Literatur.destroy({ where: {id: req.params.id}})
        response(res, {literatur: {id: req.params.id}}, "Delete literature successful")
    } catch (error) {
        errorServer(res)
    }
}