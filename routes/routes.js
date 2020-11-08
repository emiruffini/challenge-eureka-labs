const express = require("express");
const router = express.Router();

const superherosController = require("../controllers/superHerosController");
const usersController = require("../controllers/usersController");
const passport = require("../config/passport");

// Routes
/**
 * @swagger
 * /api/llamar-vengadores/{Página}:
 *  get:
 *    description: Utilizado para llamar a todos los Vengadores.<br><br> Si la página es igual a 0 se mostrará el listado completo.<br><br> Si es igual a 1 se mostrará la descripción general y los primeros nueve Vengadores. <br><br>Si es igual a dos se mostrarán los últimos nueve Vengadores.
 *    parameters:
 *      - in: path
 *        name: Página
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      '200':
 *        description: Vengadores a tu disposición.
 *      '404':
 *        description: Vengadores no disponibles, ha ocurrido un error.
 */
router.route("/llamar-vengadores/:page").get(superherosController.getHeros);

/**
 * @swagger
 * /api/llamar-vengador/{Nombre}:
 *  get:
 *    description: Utilizado para buscar a un Vengador por su nombre.
 *    parameters:
 *      - in: path
 *        name: nombre
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      '200':
 *        description: Vengador encontrado.
 *      '404':
 *        description: Vengador no encontrado.
 */
router.route("/llamar-vengador/:nombre").get(superherosController.getHero);

/**
 * @swagger
 * /api/crear-usuario:
 *  post:
 *    description: Utilizado para crear un nuevo usuario.
 *    consumes:
 *      - application/json
 *    parameters:
 *      - in: body
 *        name: Nuevo Usuario
 *        schema:
 *          type: object
 *          required:
 *            - username
 *            - password
 *            - mail
 *          properties:
 *            username:
 *              type: string
 *              description: Nombre usuario.
 *            password:
 *              type: string
 *              description: Contraseña que debe incluir mayúsculas, minúsculas y números.
 *            mail:
 *              type: string
 *              description: Dirección de correo del usuario.
 *    responses:
 *      '200':
 *        description: Usuario creado.
 *      '404':
 *        description: Error al crear un usuario.
 */
router
  .route("/crear-usuario")
  .post(usersController.validateUser, usersController.newUser);

/**
 * @swagger
 * /api/logear-usuario:
 *  post:
 *    description: Utilizado para loguear a un usuario.
 *    consumes:
 *      - application/json
 *    parameters:
 *      - in: body
 *        name: Logear Usuario
 *        schema:
 *          type: object
 *          required:
 *            - username
 *            - password
 *          properties:
 *            username:
 *              type: string
 *              description: Nombre usuario.
 *            password:
 *              type: string
 *              description: Contraseña del usuario.
 *    responses:
 *      '200':
 *        description: Sesión iniciada.
 *      '404':
 *        description: Error al iniciar sesión.
 */
router.route("/logear-usuario").post(usersController.logUser);

/**
 * @swagger
 * /api/likear-vengador:
 *  post:
 *    description: Utilizado para agregar o quitar un vengador de los likes del usuario. <br><br> Es necesario proveer un token en la cabecera y el nombre del Vengador a likear/dislikear en el cuerpo.
 *    consumes:
 *      - application/json
 *
 *    security:
 *      - Bearer: []
 *    parameters:
 *      - in: header
 *        name: Authorization
 *        required: true
 *        description: Reemplazar "token" por el token del usuario
 *        schema:
 *          type: string
 *          example: Bearer token
 *      - in: body
 *        required: true
 *        name: Nombre Vengador
 *        schema:
 *          type: object
 *          required:
 *            - nombreVengador
 *          properties:
 *            vengador:
 *              type: string
 *              description: Nombre vengador a agregar o quitar
 *    responses:
 *      '200':
 *        description: Likes actualizados.
 *      '401':
 *        description: No autorizado, debe insertar un token válido.
 *      '404':
 *        description: Error al actualizar los likes.
 */
router
  .route("/likear-vengador")
  .post(
    passport.authenticate("jwt", { session: false }),
    usersController.likeAvenger
  );

module.exports = router;
