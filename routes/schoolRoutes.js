const express = require('express');
const router = express.Router();
const { addSchool, listSchools } = require('../controllers/schoolController');

router.post('/add', addSchool);
router.get('/list', listSchools);

module.exports = router;