const router = require( 'express' ).Router();
const {
  getAllPizza,
  getPizzaById,
  createPizza,
  updatePizza,
  deletePizza
} = require( '../../controllers/pizza-controller' );

// setup GET all and POST to /api/pizzas
router
  .route( '/' )
  .get(getAllPizza)
  .post(createPizza);

// setup GET one, PUT, and DELETE to /api/pizzas/:id
router
  .route( '/:id' )
  .get(getPizzaById)
  .put(updatePizza)
  .delete(deletePizza);

module.exports = router;
