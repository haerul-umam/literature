module.exports = {
    errorMessage: (res, message) => {
        res.status(400).send({
            status: "failed",
            message
        })
    },
    response: (res, resData, message) => {
        res.status(200).send({
            status : "success",
            message,
            ...resData
        })
    },
    errorServer: (res) => {
        res.status(500).send({
            status: "failed",
            message: "Server error"
        })
    }
}