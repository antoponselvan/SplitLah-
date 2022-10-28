
const User = require("../models/user")
const bcrypt = require("bcrypt")

const registerUser = (req,res)=>{
// req should contain - All schema entries of "User" collection
}


const loginUser = async (req, res)=>{
// req should contain - email and password
    const email = req.body.email
    const password = req.body.password

    if (!email) {
        res.status(400).json({msg: "Login Email-ID cannot be blank"})
        return
    }

    try{
        const user = await User.findOne({email}).exec()
        if (!user) {
            res.status(404).json({msg: "User not found"})
            return
        }

        const loginPass = bcrypt.compareSync(password, user.password)
        if (loginPass){
            req.session.userId = user._id
            res.status(202).json({msg: "Successful Login"})
        } else {
            req.sesssion.userId = null
            res.status(401).json({msg: "Inaccurate Password"})
        }
    } catch (error) {
        res.status(500).json({msg: "Unknown Server Error"})
    }
}


const updateUser = (req, res) => {
// req should contain - All schema entries of "User" collection

}


const logoutUser = (req, res) => {
    if (!req.session.userId){
        res.status(400).json({msg: "No user to log-out"})
        return
    }
    console.log(req.session.userId)
    req.session.userId = null
    res.status(202).json({msg: "User successfully logged out!"})
}

module.exports = {registerUser, loginUser, updateUser, logoutUser}