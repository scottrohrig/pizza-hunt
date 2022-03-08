const { Pizza, Comment } = require( '../models' );
const { db } = require( '../models/Comment' );

const commentController = {
  // add comment and assign to pizza
  addComment( { params, body }, res ) {
    // create comment
    Comment.create( body )
      .then( ( { _id } ) => {
        // add comment to pizza by id
        return Pizza.findOneAndUpdate(
          { _id: params.pizzaId },
          { $push: { comments: _id } },
          { new: true }
        );
      } )
      .then( dbPizzaData => {
        if ( !dbPizzaData ) {
          res.status( 404 ).json( { message: 'not a pizza' } );
          return;
        }
        res.json( dbPizzaData );
      } )
      .catch( err => res.status( 500 ).json( err ) );

  },

  // push reply onto comment
  addReply( { params, body }, res ) {
    Comment.findOneAndUpdate(
      { _id: params.commentId },
      { $push: { replies: body } },
      { new: true }
    )
      .then( dbPizzaData => {
        if ( !dbPizzaData ) {
          res.status( 404 ).json( { message: 'not a pizza' } );
          return;
        }
        res.json( dbPizzaData );
      } )
      .catch( err => res.status( 500 ).json( err ) );
  },

  // remove comment and update associated pizza
  removeComment( { params }, res ) {
    Comment.findOneAndDelete( { _id: params.commentId } )
      .then( deletedComment => {
        if ( !deletedComment ) {
          return res.status( 404 ).json( { message: 'No comment with this id!' } );
        }
        return Pizza.findOneAndUpdate(
          { _id: params.pizzaId },
          { $pull: { comments: params.commentId } },
          { new: true }
        );
      } )
      .then( dbPizzaData => {
        if ( !dbPizzaData ) {
          res.status( 404 ).json( { message: 'No pizza found with this id!' } );
          return;
        }
        res.json( dbPizzaData );
      } )
      .catch( err => res.json( err ) );
  },

  // remove reply from comment's replies
  removeReply( { params }, res ) {
    Comment.findByIdAndUpdate(
      { _id: params.commentId },
      // remove the specific reply from the replies array matching the replyId
      { $pull: { replies: { replyId: params.replyId } } },
      { new: true }
    )
      .then( dbPizzaData => res.json( dbPizzaData ) )
      .catch( err => res.json( err ) );
  }
};

module.exports = commentController;
