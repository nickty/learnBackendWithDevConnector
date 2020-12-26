const express = require('express');
const router = express.Router(); 
const config = require('config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')

const auth = require('../../middleware/auth')



const {check, validationResult} = require('express-validator/check'); 

const User = require('../../models/User')


//@route    GET http://localhost:5000/api/auth
// test     route 
// access   public
router.get('/', auth, async (req, res) => {
    try {
        const user = await  User.findById(req.user.id).select('-password');
        res.json(user)
    } catch (error) {
        console.error(err.message)
        res.status(500).send('Server error')
    }
})


//@route    POST http://localhost:5000/api/auth
// test     authenticate user & get token
// access   public

router.post('/', [
    check('email', 'please include a valid email').isEmail(), 
    check('password', 'password is required').exists()
], async (req, res) => {

    const errors = validationResult(req)

    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }

    const {email, password } = req.body

    //console.log(req.body)

    try {

        //see if the user exist

        let user = await User.findOne({email: email})

        if(!user){
            return res.status(400).json({errors: [{msg: 'Invalid Credentials'}]})
        }


        const isMatch = await bcrypt.compare(password, user.password)

        if(!isMatch){
            return res.status(400).json({errors: [{msg: 'Invalid Credentials'}]})    
        }
        

        //return jsonwebtoken

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

               
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }

    

    
})


module.exports = router; 