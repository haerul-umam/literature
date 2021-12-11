const router = require("express").Router()
const {private} = require("../../middlewares/private")
const {uploadFile} = require("../../middlewares/upload")

const { login, register, checkAuth } = require("../controller/auth")
const { addLiteratur, 
    getLiteraturs, 
    getLiteratur, 
    searchLiterature, 
    masterDataLiteratur,
    updateLiteratur,
    userLiteratur,
    deleteLiteratur,
    reApplyLiteratur,
    getCancelLiteratur
} = require("../controller/literatur")
const { profile, updateUser } = require("../controller/user")
const { addCollection, myCollection, deleteCollection } = require("../controller/collection")

router.post("/register", register)
router.post("/login", login)
router.get("/auth", checkAuth)
router.get("/profile", private(), profile)
router.put("/profile", private(), uploadFile("image"), updateUser)

router.post("/literatur", private("user"), uploadFile("pdf") ,addLiteratur)
router.get("/literaturs",private(), getLiteraturs) // all literature with status approve
router.get("/literatur/:id", private(), getLiteratur)  // detail literature
router.get("/search", searchLiterature)
router.get("/master-literatur", private("admin"), masterDataLiteratur)
router.put("/literatur/:id", private(), updateLiteratur)
router.get("/user/literatur", private(), userLiteratur)
router.delete("/user/literatur/:id", private("user"), deleteLiteratur)
router.put("/user/literatur/:id", private("user"), uploadFile("pdf"), reApplyLiteratur)
router.get("/literatur/cancel/:id", private(), getCancelLiteratur)

router.post("/collection", private(), addCollection)
router.get("/collection", private(), myCollection)
router.delete("/collection/:id", private(), deleteCollection)

module.exports = router