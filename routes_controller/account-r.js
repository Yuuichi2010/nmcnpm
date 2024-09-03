const express = require('express');
const router = express.Router();
const accountM = require("../models/account-m");
const passport = require('passport');
const bcrypt = require("bcrypt");
const nodemailer = require('nodemailer');
const multer = require("multer");
const upload = multer({dest: 'image/Avatar'});
const saltRounds = 10;

// Register
router.get('/register', (req, res) => {
    res.render('customers/Register', {
        title: 'Register',
        text: 'account',
        mainJs: () => 'empty',
        navbar: () => 'empty',
        header: () => 'header_text',
    })
});
router.post('/register', async (req, res, next) => {
    try {
        const { inputUserName, inputPassword, inputName, inputEmail, inputNumberPhone, inputAddress } = req.body;
        let genderOptions = 'Male';
        let dob = '01/01/2023';
        if ('genderOptions' in req.body) {
            genderOptions = req.body.genderOptions;
        }
        if (req.body.dob !== '') {
            dob = req.body.dob;
        }
        const valid_user = await accountM.get(inputUserName);
        if (valid_user === undefined) {
            bcrypt.hash(inputPassword, saltRounds, async function (err, hash) {
                if (err) {
                    console.log(err);
                    return next(err);
                }
                await accountM.add(new accountM(inputName, inputUserName, null, hash, inputEmail,
                    inputNumberPhone, genderOptions, dob, inputAddress, false));
                res.redirect("/account/login");
            });
        } else {
            throw (new Error("Username has already existed"));
        }
    }
    catch (err) {
        throw (err);
    }
});

// Forgot password - step 1: enter username
router.get('/forgotpassword', (req, res) => {
    res.render('customers/ForgotPassword', {
        title: 'Forgot Password',
        text: 'account',
        enterUserName: true,
        mainJs: () => 'empty',
        navbar: () => 'empty',
        header: () => 'header_text',
    })
})

router.post('/forgotpassword', async (req, res) => {
    try {
        const valid_user = await accountM.get(req.body.inputUserName);
        if (req.body.inputUserName === 'admin') {
            throw (new Error("Can not change password"));
        }
        else {
            if (valid_user !== undefined ) {
                res.redirect(`/account/resetpassword?username=${encodeURIComponent(valid_user.UserName)}`);
            } else {
                res.render('customers/ForgotPassword', {
                    title: 'Forgot Password',
                    text: 'account',
                    enterUserName: true,
                    failure: true,
                    mainJs: () => 'empty',
                    navbar: () => 'empty',
                    header: () => 'header_text',
                })
            }
        }
    } catch (err) {
        throw (err);
    }
})

// Reset password
router.get('/resetpassword', async (req, res) => {
    const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        code += characters.charAt(randomIndex);
    }
    const user = await accountM.get(req.query.username);
    
    // Thông tin tài khoản Gmail
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'wordhavenbooks@gmail.com',
            pass: 'lhbyssvoyknmrihp'
        }
    });

    const mailOptions = {
        from: 'wordhavenbooks@gmail.com',
        to: user.Email,
        subject: 'Verification Code for Password Reset',
        html: `
            <p>Dear ${user.Name},</p>
            <p>Your verification code for password reset is: <strong>${code}</strong></p>
            <p>Please use this code to verify your identity.</p>
            <p>Thank you!</p>
            `
    };
    transporter.sendMail(mailOptions,function(error,info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });

    res.render('customers/ForgotPassword', {
        title: 'Forgot Password',
        text: 'account',
        enterUserName: false,
        UserName: user.UserName,
        viaCode: code,
        mainJs: () => 'empty',
        navbar: () => 'empty',
        header: () => 'header_text',
    })
})

router.post('/resetpassword', async (req, res, next) => {
    try {
        bcrypt.hash(req.body.inputNewPassword, saltRounds, async function (err, hash) {
            if (err) {
                console.log(err);
                return next(err);
            }
            await accountM.updatePass(hash, req.body.inputUserName);
            res.redirect("/account/login");
        });
    } catch (err) {
        throw (err);
    }
})

//Login
router.get('/login', (req, res) => {
    res.render('customers/Login', {
        title: 'Log in',
        text: 'account',
        failure: req.flash('error'),
        mainJs: () => 'empty',
        navbar: () => 'empty',
        header: () => 'header_text',
    })
});

router.post('/login', passport.authenticate('myStrategy',
    {
        failureRedirect: '/account/login',
        failureFlash: true
    }),
    (req, res) => {
        const username = req.body.inputUserName;

        if (username === "admin") {
            res.redirect('/admin');
        }
        else if (username === "bookseller") {
            res.redirect('/bookseller');
        }
        else {
            res.redirect('/');
        }
    }
);


// My account
router.get('/profile', async (req, res) => {
    if (req.isAuthenticated()) {
        const profile = await accountM.get(req.session.passport.user);
        formattedDate = profile.DateOfBirth.toISOString().split('T')[0];
        res.render('customers/MyAccount', {
            title: 'My Account',
            text: 'account',
            login: true,
            profile,
            dob: formattedDate,
            mainJs: () => 'empty',
            navbar: () => 'navbar',
            header: () => 'header_text',
        })
    }
    else {
        res.redirect('/account/login');
    }
});

router.post('/profile', async (req, res, next) => {
    try {
        let DOB = '01/01/2023';
        if (req.body.dob !== '') {
            DOB = req.body.dob;
        }
        const obj = {
            Name: req.body.inputName,
            Gender: req.body.genderOptions,
            DateOfBirth: DOB,
            Address: req.body.inputAddress
        };
        await accountM.updateProfile(obj, req.session.passport.user);

        const profile = await accountM.get(req.session.passport.user);
        formattedDate = profile.DateOfBirth.toISOString().split('T')[0];
        res.render('customers/MyAccount', {
            title: 'My Account',
            text: 'account',
            login: true,
            profile,
            successfulMessage: true,
            dob: formattedDate,
            mainJs: () => 'empty',
            navbar: () => 'navbar',
            header: () => 'header_text',
        });

    } catch (error) {
        next(error);
    }
});

// CHANGE PASSWORD 
router.get('/password', (req, res) => {
    if (req.isAuthenticated()) {
        res.render('customers/ChangePassword', {
            title: 'My Account',
            text: 'account',
            login: true,
            mainJs: () => 'empty',
            navbar: () => 'navbar',
            header: () => 'header_text',
        })
    }
});

router.post('/password', async (req, res, next) => {
    try {
        const acc = await accountM.get(req.session.passport.user);
        const rs = await bcrypt.compare(req.body.inputOldPassword, acc.Pass);
        if (rs) {
            bcrypt.hash(req.body.inputNewPassword, saltRounds, async function (err, hash) {
                if (err) {
                    console.log(err);
                    return next(err);
                }
                await accountM.updatePass(hash, req.session.passport.user);
                res.redirect('/account/password');
            });
            res.render('customers/ChangePassword', {
                title: 'My Account',
                text: 'account',
                login: true,
                successfulMessage: true,
                mainJs: () => 'empty',
                navbar: () => 'navbar',
                header: () => 'header_text',
            })
        }
        else {
            res.render('customers/ChangePassword', {
                title: 'My Account',
                text: 'account',
                login: true,
                failureMessage: true,
                mainJs: () => 'empty',
                navbar: () => 'navbar',
                header: () => 'header_text',
            })
        }
    } catch (error) {
        throw error;
    }
})

//LOG OUT
router.get('/logout', (req, res) => {
    req.logout(err => {
        if (err) {
            throw err;
        }
    });
    res.redirect('/account/login');
});
//Change Avatar
router.post('/changeAvatar', upload.single('photo'), async(req, res, next) => {
    try{      
        // console.log(req.file);
        const Photo = `/image/Avatar/${req.file.filename}`;
        await accountM.changeAvatar(Photo, req.session.passport.user); 
        res.redirect('/account/profile');
    } catch(err){
        next(err);
    }
});
module.exports = router;