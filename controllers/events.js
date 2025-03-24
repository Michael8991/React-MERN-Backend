const { response } = require('express');
const Event = require('../models/Event-model');

//*Crear un evento
const createEvent = async (req, res = response) => {
    const { title, body, startDate, endDate } = req.body;
    try {
        const event = new Event({
            title,
            body,
            startDate,
            endDate,
            userID: req.uid
        });
        await event.save();
        res.status(200).json({
            ok: true,
            userID: req.uid,
            uid: event.id,
            title,
            body,
            startDate,
            endDate
        })
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Error al crear el evento. Contacte con el administrador.'
        })
    }
}

//*Obtener los eventos
const getEvents = async (req, res = response) => {
    try {
        //Obtenemos todos los eventos
        const events = await Event.find();

        if (!events) {
            return res.status(404).json({
                ok: true,
                msg: 'No hay eventos'
            })
        }

        res.status(200).json({
            ok: true,
            msg: 'Eventos obtenidos',
            events
        })
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Imposible obtener los eventos. Contacte con su administrador.'
        })
    }
}

//*Actualizar evento
const updateEvent = async (req, res = response) => {
    const id = req.id; //ID del evento, este viene mediante la URL
    const { title, body, startDate, endDate } = req.body; //Datos a actualizar, estos vienen del request.
    try {
        //Buscamos el evento.
        const event = await Event.findById(id);

        //Verificamos si el evento existe
        if (!event) {
            return res.status(404).json({
                ok: false,
                msg: 'No se ha encontrado un evento con es ID.'
            })
        }

        //Verificamos que el usuario que lo creo es el que lo intenta actualizar.
        if (event.userID.toString() !== req.uid) {
            return res.status(401).json({
                ok: false,
                msg: 'No tienes permisos para actualizar este evento.'
            })
        }

        //Comprobamos que hay un titulo nuevo y renombramos, evitando null o undefined
        if (title) event.title = title;
        if (body) event.body = body;
        if (startDate) event.startDate = startDate;
        if (endDate) event.endDate = endDate;

        //Actualizamos el evento
        await event.save();

        res.status(200).json({
            ok: true,
            msg: 'Evento actualizado correctamente',
            event
        })

    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Contacte con el administrador de su servicio.'
        })
    }
}

//*Borrar evento
const deleteEvent = async (req, res = response) => {

    const id = req.id;

    try {
        //Buscamos el evento por el ID
        const event = await Event.findById(id);

        //Validamos si existe el evento.
        if (!event) {
            return res.status(404).json({
                ok: false,
                msg: 'Evento no encontrado. Intentelo de nuevo más tarde.'
            })
        }

        //Validamos si el usuario autenticado es el propietario del evento.
        if (event.userID.toString() !== req.uid) {
            return res.status(401).json({
                ok: false,
                msg: 'No tienes permisos para eliminar este evento.'
            })
        }

        //Eliminamos el evento.
        await Event.findByIdAndDelete(id)
        res.status(200).json({
            ok: true,
            msg: 'Evento eliminado'
        })

    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Error al eliminar el evento, contacte con el administrador.'
        })
    }
}

module.exports = {
    createEvent,
    getEvents,
    updateEvent,
    deleteEvent
}

//?event={id, title, body, startDate, endDate}