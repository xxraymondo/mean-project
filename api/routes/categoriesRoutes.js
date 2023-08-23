// routes/categories.js

const express = require('express');
const router = express.Router();
const categoriesController = require('../controllers/categoriesController');
const authorization = require('../utils/authorization');
const constants = require('../utils/constants');

// Create a new category
router.post('/category', authorization.verifyAccess(constants.Actions.addCategory), categoriesController.createCategory);

// Get all categories
router.get('/category', categoriesController.getAllCategories);

// Get a specific category by ID
router.get('/category/:categoryId', categoriesController.getCategoryById);

// Update a category by ID
router.put('/category/:categoryId', authorization.verifyAccess(constants.Actions.updateCategory), categoriesController.updateCategoryById);

// Delete a category by ID
router.delete('/category/:categoryId', authorization.verifyAccess(constants.Actions.deleteCategory), categoriesController.deleteCategoryById);

module.exports = router;
