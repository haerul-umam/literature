const { User } = require("../../models")
const Joi = require("joi")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { response, errorMessage, errorServer } = require("../../_helper/messages")

exports.login = async (req,res) => {
    try {
        const schema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().min(7).required()
        })
        
        const {error} = schema.validate(req.body)
        if (error) return errorMessage(res, error.details[0].message)

        const user = await User.findOne({
            where: { email: req.body.email}
        })

        if (!user?.password) return errorMessage(res, "Wrong email or password")
        
        const match = await bcrypt.compare(req.body.password, user.password)
      
        if (!match) return errorMessage(res, "Wrong email or password")

        const token = jwt.sign({id: user.id, role: user.role}, process.env.TOKEN_KEY)

        const login = {email: user.email, role: user.role, token}
        response(res, {login})

    } catch (error) {
        console.log(error)
        errorServer(res) 
    }
}

exports.register = async (req, res) => {
    try {
        const schema = Joi.object({
            fullName: Joi.string().min(4).required(),
            email: Joi.string().email().min(5).required(),
            password: Joi.string().min(7).required(),
            phone: Joi.string().min(8).required(),
            address: Joi.string(),
            gender: Joi.string().required(),
        })

        const {error} = schema.validate(req.body)
        if (error) return errorMessage(res, error.details[0].message)

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(req.body.password, salt)

        const user = await User.create({...req.body, password: hashedPassword},{raw:true})
        const token = jwt.sign({id: user.id, role: "user"}, process.env.TOKEN_KEY)
      
        response(res, {register: {role: "user",email: user.email, token}})

    } catch (error) {
        if (error.name === "SequelizeUniqueConstraintError"){
            res.status(403).send({status:"failed", message: "Email already registered"})
        }
        errorServer(res)
    }
}

exports.checkAuth = async (req, res) => {
    const reqHeader = req.header("Authorization")
    const token = reqHeader && reqHeader.split(" ")[1]

    if (!token) {
        return res.status(401).send({status:"failed",message:"Access denied"})
    }

    try {
        const verified = jwt.verify(token, process.env.TOKEN_KEY)
       
        const data = await User.findOne({
            raw:true,
            where: {id: verified.id}, 
            attributes:["email","role"]
        })
        
        res.send({
            status:"success", 
            checkAuth: data
        })

    } catch (error) {
        console.log(error)
        res.status(401).send({status:"failed", message:"Unauthorized"})
    }
}
