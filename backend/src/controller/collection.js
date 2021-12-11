const {Collection, Literatur} = require("../../models")
const { response, errorMessage, errorServer } = require("../../_helper/messages")
const Joi = require("joi")
const moment = require("moment")
const {v4: uuidv4} = require("uuid")

exports.addCollection = async (req, res) => {
    const schema = Joi.object({
        idLiteratur: Joi.number().integer().required()
    })
    const {error} = schema.validate(req.body)
    if (error) return errorMessage(res, error.details[0].message)

    try{
        const insert = await Collection.create({...req.body, idUser: req.user.id, id: uuidv4()})
        const collection = await Collection.findOne({
            where: {id: insert.id},
            include: [{
                model: Literatur,
                attributes: {exclude:["createdAt","updatedAt","idUser"]},
                as: "literature",
            }],
            attributes: {exclude:["createdAt","updatedAt","idUser","idLiteratur"]}
        })
        response(res,{collection}, "Add collection successful")
    }catch(e){
        if (e.name === "SequelizeUniqueConstraintError") return errorMessage(res, "Already in your collection")
        errorServer(res)
    }
}

exports.deleteCollection = async (req, res) => {
    try{
        await Collection.destroy({
            where: {idUser: req.user.id, idLiteratur: req.params.id}
        })
        response(res, {literature: {idLiterature: req.params.id, idUser: req.user.id}}, "Delete collection successful")
    }catch(e){
        errorServer(res)
    }
}

exports.myCollection = async (req, res) => {
    try{
        const data = await Collection.findAll({
            where: {idUser: req.user.id},
            include: [{
                model: Literatur,
                attributes: {exclude:["createdAt","updatedAt","idUser"]},
                as: "literature",
            }],
            attributes: {exclude:["createdAt","updatedAt","idUser","idLiteratur"]},
            raw: true,
            nest: true
        })
        const collection = data.map(item => {
            return {...item, literature: {...item.literature, files: `http://127.0.0.1:3333/static/pdf/${item.literature.files}`, pubDate: moment(item.literature.pubDate).format("YYYY")}}
        })
        response(res, {collection})
    }catch(e){
        console.log(e)
        errorServer(res)
    }
}