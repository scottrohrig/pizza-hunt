// variable to store the db connection
let db;

// establish connection to db named 'pizza_hunt' version 1
const request = indexedDB.open( 'pizza_hunt', 1 );

// event listeners...
// event will emit if db version changes
request.onupgradeneeded = function ( event ) {
  // save ref to db
  const db = event.target.result;
  // create object store (table) called 'new_pizza', w/ autoIncrement
  db.createObjectStore( 'new_pizza', { autoIncrement: true } );
};

// upon a successful
request.onsuccess = function ( event ) {
  // save ref to db in global variable
  db = event.target.result;

  // check if app is online
  if ( navigator.onLine ) {
    // add data to db?
    uploadPizza();
    console.log( 'uploading pizza' );
  }
};

// log error
request.onerror = function ( event ) {
  console.log( event.target.errorCode );
};

function saveRecord( record ) {
  const transaction = db.transaction( [ 'new_pizza' ], 'readwrite' );

  // access obj store for 'new_pizza'
  const pizzaObjectStore = transaction.objectStore( 'new_pizza' );

  // add record to your store with add method
  pizzaObjectStore.add( record );
}

function uploadPizza() {
  // open a transaction on your db
  const transaction = db.transaction( [ 'new_pizza' ], 'readwrite' );

  // access object store
  const pizzaObjectStore = transaction.objectStore( 'new_pizza' );

  // get all records from store and set to variable
  const getAll = pizzaObjectStore.getAll();

  // upon successful .getAll(), run this
  getAll.onsuccess = function () {
    // if data in indexedDB store, send to api server
    if ( getAll.result.length > 0 ) {
      fetch( '/api/pizzas', {
        method: 'POST',
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify( getAll.result )
      } )
        .then( response = response.json() )
        .then( serverResponse => {
          if ( serverResponse.message ) {
            throw new Error( serverResponse );
          }
          // open one more transaction
          const transaction = db.transaction( [ 'new_pizza' ], 'readwrite' );
          // access new_pizza obj. store
          const pizzaObjectStore = transaction.objectStore( 'new_pizza' );
          // clear all items in obj. store
          pizzaObjectStore.clear();

          alert( 'All saved pizza submitted' );
        } )
        .catch( err => console.log( err ) );
    }
  };
}
