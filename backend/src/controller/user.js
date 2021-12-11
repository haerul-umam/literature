const { response, errorMessage, errorServer } = require("../../_helper/messages")
const { User } = require("../../models")
const Joi = require("joi")

exports.profile = async (req, res) => {
    try {
        const profile = await User.findOne({ 
            where : {id: req.user.id},
            attributes:{
                exclude:["password", "createdAt","updatedAt"]
            },
            raw: true            
        })
        profile['image'] = profile['image'] ? `http://127.0.0.1:3333/static/image/${profile['image']}` : null
        response(res, {profile})
    } catch (error) {
        errorServer(res)
    }
}

exports.updateUser = async (req, res) => {
    const schema = Joi.object({
        fullName: Joi.string().min(4),
        email: Joi.string().email().min(6),
        password: Joi.string().min(7),
        phone: Joi.string().min(8),
        address: Joi.string(),
        gender: Joi.string(),
    })
    
    const {error} = schema.validate(req.body)
    if (error) return errorMessage(res,error.details[0].message)
    if (req.body.password) return errorMessage (res, "Unauthorized")
    try {
        let profile = req.body
        if (req.file) profile = {...profile, image: req.file.filename}
        const data = await User.update(profile, {
            where: {id: req.user.id}
        })
        if (data[0] === 1) return response(res, {profile} ,"Update profile successful")

    } catch (error) {
        if (error.name === "SequelizeUniqueConstraintError"){
            return res.status(403).send({status:"failed", message: "Email already registered"})
        }
        errorServer(res)
    }
}

