const router = require( 'express' ).Router();
const {
  addComment,
  addReply,
  removeComment,
  removeReply
} = require( '../../controllers/comment-controller' );

// /api/comments/<pizzaId>
router.route( '/:pizzaId' ).post( addComment );

// PUT to update existing comment
router.route( '/:pizzaId/:commentId' ).put( addReply ).delete( removeReply );

// /api/comments/<pizzaId>/<commentId>
router.route( '/:pizzaId/:commentId' ).delete( removeComment );

router.route('/:pizzaId/:commentId/:replyId').delete(removeReply)

module.exports = router;
