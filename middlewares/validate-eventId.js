const { response } = require('express');
const mongoose = require('mongoose');

const validateEventID = (req, res = response, next) => {
    const { id } = req.query;
    if (!id) {
        return res.status(400).json({ ok: false, msg: 'ID obligatorio' })
    }

    //?Validación del formato del ID (estándar de MongoDB de 24 caracteres hexadecimales)
    //? if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    //?     return res.status(400).json({ ok: false, msg: 'ID no válido.' })
    //? }

    //*Validación con mongoose
    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ ok: false, msg: 'ID no válido.' });
    }

    //*Pasamos el id al reques para usarlo después.
    req.id = id;

    next(); //*Llama al siguiente Middleware(validaciones o controladores)

}

module.exports = {
    validateEventID
}