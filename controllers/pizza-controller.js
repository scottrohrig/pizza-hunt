const { Pizza } = require( '../models' );

const pizzaController = {
  // methods here...

  // find methods
  getAllPizza( req, res ) {
    Pizza.find( {} )
      .populate( {
        path: 'comments',
        select: '-__v'
      } )
      .select( '-__v' )
      .sort( { _id: -1 } )
      .then( dbPizzaData => res.json( dbPizzaData ) )
      .catch( err => { res.status( 400 ).json( err ); } );
  },

  // get by id
  getPizzaById( { params }, res ) {
    Pizza.findOne( { _id: params.id } )
      .populate( {
        path: 'comments',
        select: '-__v'
      } )
      .select( '-__v' )
      .then( dbPizzaData => {
        if ( !dbPizzaData ) {
          res.status( 404 ).json( { message: 'Not a pizza' } );
          return;
        }
        res.json( dbPizzaData );
      } )
      .catch( err => res.status( 400 ).json( err ) );
  },

  // create a pizza
  createPizza( { body }, res ) {
    Pizza.create( body )
      .then( newPizza => res.json( newPizza ) )
      .catch( err => res.status( 400 ).json( err ) );
  },

  // update a pizza
  updatePizza( { params, body }, res ) {
    Pizza.findOneAndUpdate(
      { _id: params.id },
      body,
      {
        new: true,
        // tell mongoose to validate new info
        runValidators: true
      } )
      .then( updatedPizzaData => {
        if ( !updatedPizzaData ) { res.status( 404 ).json( { message: 'Not a Pizza' } ); return; }
        res.json( updatedPizzaData );
      } )
      .catch( err => res.status( 400 ).json( err ) );
  },

  // delete method
  deletePizza( { params }, res ) {
    Pizza.findOneAndDelete( { _id: params.id } )
      .then( dbPD => {
        if ( !dbPD ) { res.status( 404 ).json( { message: 'Not a pizza' } ); return; }
        res.json( dbPD );
      } )
      .catch( err => res.status( 400 ).json( err ) );
  }
};

module.exports = pizzaController;
