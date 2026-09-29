const express = require('express');
const { getCompanies, getCompanyById } = require('../controllers/companyController');

const router = express.Router();

router.get('/', getCompanies);
router.get('/:id', getCompanyById);

module.exports = router;
