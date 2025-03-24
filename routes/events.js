const { Router } = require("express");
const { check } = require('express-validator')
const router = Router();

const { validateJWT } = require("../middlewares/validate-jwt");
const { validateFields } = require("../middlewares/validate-fields");
const { createEvent, updateEvent, deleteEvent, getEvents } = require("../controllers/events");
const { validateEventID } = require("../middlewares/validate-eventId");


//*Crear Eventos
router.post('/new',
    [
        validateJWT,
        check('title', 'El título no puede estar vacío. Inténtelo de nuevo.').not().isEmpty(),
        check('startDate', 'Campo de fecha de incio de evento vacío.').not().isEmpty(),
        check('startDate', 'Fecha de inicio de evento en formato no válido.').isISO8601(),
        check('endDate', 'Campo de fecha de incio de evento vacío.').not().isEmpty(),
        check('endDate', 'Fecha de final de evento en formato no válido.').isISO8601(),
        check('endDate', 'La fecha final no puede ser menor que la fecha de inicio.').custom((value, { req }) => {
            return new Date(value) > new Date(req.body.startDate);
        }),
        validateFields
    ],
    createEvent);

//*Obtener Eventos
router.get('/', validateJWT, getEvents);

//*Actualizar Evento
router.put('/edit',
    [
        validateJWT,
        validateEventID,
        check('title', 'El título no puede estar vacío. Inténtelo de nuevo.').not().isEmpty(),
        check('startDate', 'Campo de fecha de incio de evento vacío.').not().isEmpty(),
        check('startDate', 'Fecha de inicio de evento en formato no válido.').isISO8601(),
        check('endDate', 'Campo de fecha de incio de evento vacío.').not().isEmpty(),
        check('endDate', 'Fecha de final de evento en formato no válido.').isISO8601(),
        check('endDate', 'La fecha final no puede ser menor que la fecha de inicio.').custom((value, { req }) => {
            return new Date(value) > new Date(req.body.startDate);
        }),
        validateFields
    ],
    updateEvent);

//*Borrar Evento
router.delete('/delete', [validateJWT, validateEventID], deleteEvent);

module.exports = router;



//?event={id, title, body, startDate, endDate}
//!Todas tienen que pasar por la validaicon del token




