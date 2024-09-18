const express = require('express');
const router = express.Router();

// Load Book model
const Book = require('../../models/Books');

// @route GET api/books/test
// @description tests books route
// @access Public
router.get('/test', (req, res) => res.send('book route testing!'));

// @route   GET api/books
// @desc    Get all books
// @access  Public
router.get('/', (req, res) => {
    Book.find()
      .then(books => res.json(books))
      .catch(err => res.status(404).json({ nobooksfound: 'No Books found', err:err }));
  });


  // Search API

router.get('/search', (req, res) => {
    const { title, author, description,publisher } = req.query;  // Query parameters for search

    // Build a query object
    let query = {};
    
    if (title) {
        // Use a regular expression for partial match (case-insensitive)
        query.title = { $regex: title, $options: 'i' };
    }
    
    if (author) {
        query.author = { $regex: author, $options: 'i' };
    }

    if (description) {
        query.genre = { $regex: description, $options: 'i' };
    }

    if (publisher) {
        query.publisher = { $regex: publisher, $options: 'i' };
    }

    // Find books based on the query object
    Book.find(query)
        .then(books => {
            if (books.length === 0) {
                return res.status(404).json({ msg: 'No books found matching the criteria' });
            }
            res.json(books);
        })
        .catch(err => res.status(500).json({ error: 'An error occurred while searching for books', err: err }));
});
  
  // @route   GET api/books/:id
  // @desc    Get single book by id
  // @access  Public
  router.get('/:id', (req, res) => {
    Book.findById(req.params.id)
      .then(book => res.json(book))
      .catch(err => res.status(404).json({ nobookfound: 'No Book found', err:err }));
  });
  
  // @route   POST api/books
  // @desc    Add/save book
  // @access  Public
  router.post('/', (req, res) => {
    Book.create(req.body)
      .then(book => res.json({ msg: 'Book added successfully' , book:book}))
      .catch(err => res.status(400).json({ error: 'Unable to add this book', err:err }));
  });
  
  // @route   PUT api/books/:id
  // @desc    Update book by id
  // @access  Public
  router.put('/:id', (req, res) => {
    Book.findByIdAndUpdate(req.params.id, req.body)
      .then(book => res.json({ msg: 'Updated successfully', book:book }))
      .catch(err =>
        res.status(400).json({ error: 'Unable to update the Database', err:err })
      );
  });
  
  // @route   DELETE api/books/:id
  // @desc    Delete book by id
  // @access  Public
  router.delete('/:id', (req, res) => {
    Book.findByIdAndDelete(req.params.id)
      .then(book => res.json({ mgs: 'Book entry deleted successfully', book:book }))
      .catch(err => res.status(404).json({ error: 'No such a book' , err:err}));
  });


  //Multiple delete

  router.delete('/', (req, res) => {
    const { ids } = req.body;  // Expecting an array of IDs in the request body

    if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ error: 'Please provide an array of book IDs to delete.' });
    }

    Book.deleteMany({ _id: { $in: ids } })
      .then(book => {
        if (book.deletedCount > 0) {
          res.json({ msg: `${book.deletedCount} book(s) deleted successfully` });
        } else {
          res.status(404).json({ error: 'No books found for the provided IDs' });
        }
      })
      .catch(err => res.status(500).json({ error: 'Failed to delete books', err: err }));
});











  
module.exports = router;