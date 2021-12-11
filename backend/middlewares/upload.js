const multer = require("multer")
const {v4: uuidv4} = require("uuid")
const { errorMessage } = require("../_helper/messages")

exports.uploadFile = (fileUpload) => {
  
    let loc = "public/pdf"
    let re = /\.(pdf)$/
    let message = "only pdf file are allowed to upload"
    if (fileUpload === "image") { 
        loc = "public/image"
        re = /\.(jpg|JPG|JPEG|jpeg|png|PNG|svg)$/
        message = "only image file are allowed to upload"
    }

    const storage = multer.diskStorage({
        destination: function(req, file, cb){
            cb(null, loc)
        },
        filename: function(req,file,cb){
            let re = /(?:\.([^.]+))?$/
            cb(null, `${uuidv4()}.${re.exec(file.originalname)[1]}`)
        }
    })

    const fileFilter = (req, file, cb) => {
        if (file.fieldname === "pdf"){
            if ( !file.originalname.match(re) ){
                req.fileValidationError = {
                    message
                }
                return cb(new Error(message), false)
            }
        }

        cb(null, true)
    }

    const maxSize = 7 * 1024 * 1024 //5MB

    const getUpload = multer ({
        storage,
        fileFilter,
        limits: {fileSize: maxSize}
    }).single(fileUpload)


    return (req, res, next) => {
        getUpload(req, res, function(err){
            if (req.fileValidationError) return errorMessage(res, req.fileValidationError)
            
            // uncomment this if upload is a must
            // if (!req.file && !err) return errorMessage(res, "Please select file to upload")
            
            if (err){
                if (err.code === "LIMIT_FILE_SIZE") return errorMessage(res, "Max size 7MB")

                if (err.code === "LIMIT_UNEXPECTED_FILE") return errorMessage(res, "Only accept single file")

                return errorMessage(res, err)
            }
            return next()
            
        })
    }

}
