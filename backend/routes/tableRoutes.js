const express = require('express');
const router = express.Router();
const { getTables, createTable, updateTable, deleteTable } = require('../controllers/tableController');
const { protect } = require('../middleware/auth');

router.get('/', getTables);
router.post('/', protect, createTable);
router.put('/:id', protect, updateTable);
router.delete('/:id', protect, deleteTable);

module.exports = router;
