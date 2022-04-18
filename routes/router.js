const express = require('express');
const router = express.Router();
const model = require('../model/model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

router.get('/' , (req , res) => {
    res.render('login' , {
        errMsg: '',
        successMsg: ''
    });
});

router.get('/register' , (req , res) => {
    res.render('register' , {
        errMsg: ''
    });
});

router.post('/register' , (req , res) => {
    const {fullname , email , username , password} = req.body;
    if(!fullname){
        res.status(400).render('register' , {
            errMsg: 'Fullname is required.'
        });
    }else if(!email){
        res.status(400).render('register' , {
            errMsg: 'Email is required.'
        });
    }else if(!username){
        res.status(400).render('register' , {
            errMsg: 'Username is required.'
        });
    }else if(!password){
        res.status(400).render('register' , {
            errMsg: 'Password is required.'
        });
    }else{
        model.findOne({username}).exec((err , docs) => {
            if(err){
                throw err;
            }else{
                if(docs !== null){
                    res.status(400).render('register' , {
                        errMsg: 'Username is already exist,'
                    });
                }else{
                    bcrypt.hash(password , 10 , (err , password_hash) => {
                        if(err){
                            throw err;
                        }else{
                            const userData = model.create({
                                fullname: fullname,
                                email: email,
                                username: username,
                                password: password_hash
                            });
                            const token = jwt.sign(
                                {data: userData.fullname},
                                process.env.TOKEN_KEY,
                                {
                                    expiresIn: '1h'
                                }
                            );
                            userData.token = token;
                            res.status(201).render('login' , {
                                errMsg: '',
                                successMsg: 'Your account created successfully.'
                            });
                        }
                    });
                }
            }
        });
    }
});

router.post('/login' , (req , res) => {
    const {username , password} = req.body;
    if(!username){
        res.status(400).render('login' , {
            errMsg: 'Username is required',
            successMsg: ''
        });
    }else if(!password){
        res.status(400).render('login' , {
            errMsg: 'Password is required',
            successMsg: ''
        });
    }else{
        model.findOne({username}).exec((err , docs) => {
            if(err){
                throw err;
            }else{
                if(docs !== null){
                    bcrypt.compare(password , docs.password , (err , result) => {
                        if(err){
                            throw err;
                        }else{
                            if(result === true){
                                const token = jwt.sign(
                                    {data: docs.fullname},
                                    process.env.TOKEN_KEY,
                                    {
                                        expiresIn: '1h'
                                    }
                                );
                                docs.token = token;
                                const decoded = jwt.verify(docs.token , process.env.TOKEN_KEY);
                                res.status(200).render('index' , {
                                    data: decoded.data
                                });
                            }else{
                                res.status(400).render('login' , {
                                    errMsg: 'Invalid is password',
                                    successMsg: ''
                                });
                            }
                        }
                    });
                }else{
                    res.status(400).render('login' , {
                        errMsg: 'Invalid is username',
                        successMsg: ''
                    });
                }
            }
        });
    }
});

router.get('/logout' , (req , res) => {
    res.redirect('/');
});

module.exports = router;