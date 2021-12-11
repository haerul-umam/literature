const {Cancel} = require("../../models")
const { response, errorMessage, errorServer } = require("../../_helper/messages")

exports.getCancel = async (req, res) =>{
    try{
        const cancel = await Cancel.findOne
    }catch(e){
        errorServer(res)
    }
}