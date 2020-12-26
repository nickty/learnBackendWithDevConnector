const express = require('express')
const router = express.Router()
const gravatar =  require('gravatar')
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")
const {check, validationResult} = require('express-validator/check')
const config = require('config')

const User = require('../../models/User')
const { json } = require('express')

router.get('/', (req, res) => {
    res.send("hello")
})

router.post('/register', [
    check('name', 'Name is required').not()
    .isEmpty(), 
    check('email', 'please include a valie email').isEmail(), 
    check('password', 'please enter a password with 6 more characters').isLength({min:6})
], async (req, res) => {

    const errors = validationResult(req)

    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }

    const {name, email, password} = req.body



    try {

        let user = await User.findOne({email})

       

        if(user){
            return res.status(400).json({  msg : 'Email Already Exist!'})
        }

        const avatar = gravatar.url(email, {
            s: '200', 
            r:'pg', 
            d:'mm'
        })

        user = new User({
            name, 
            email, 
            password, 
            avatar
        })

        
        const salt = await bcrypt.genSalt(10)

        user.password = await bcrypt.hash(password, salt)

        

        await user.save()

        //return jsonwebtoken
       // res.json(user)



        const payload = {
            user: {
                id: user.id
            }
        }

        jwt.sign(payload, config.get('asecret'), {expiresIn: 360000}, (err, token) => {
            if(err){
                throw err; 
            } else {
                res.json({token})
            }
        })

        
    } catch (error) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }
    
    //res.send(req.body)
})



module.exports = router;