const express = require('express')
const User = require('../models/User-model')
const bcrypt = require('bcryptjs')
const { generateJWT } = require('../helpers/jwt')

//* Crear usuario
const createUser = async (req, res = express.response) => {

    const { email, password } = req.body

    try {

        let user = await User.findOne({ email })
        if (user) {
            return res.status(400).json({
                ok: false,
                msg: 'Ya hay un usuario registrado con ese correo electrónico.'
            })
        }

        user = new User(req.body)

        //*Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(password, salt);

        await user.save();

        //*Generar JWT
        const token = await generateJWT(user.id, user.name);


        res.status(201).json({
            ok: true,
            uid: user.id,
            name: user.name,
            token
        })

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Contacte con su administrador.'
        })
    }

}

//* Inicio de sesión. Login
const loginUser = async (req, res = express.response) => {

    const { email, password } = req.body;

    try {

        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({
                ok: false,
                msg: 'Usuario y contraseña incorrecta.'
            })
        }

        //*Confirmar psw
        const validatePassword = bcrypt.compareSync(password, user.password);
        if (!validatePassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Contraseña incorrecta'
            })
        }

        //*Generar JWT
        const token = await generateJWT(user.id, user.name);

        res.json({
            ok: true,
            uid: user.id,
            name: user.name,
            token
        })


    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Contacte con su administrador. Code Login'
        })
    }


}

//* Revalidación  de Token
const revalidateToken = async (req, res = express.response) => {

    const { uid, name } = req;

    const token = await generateJWT(uid, name);

    res.json({
        ok: true,
        token
    })
}

module.exports = {
    createUser,
    loginUser,
    revalidateToken,
}