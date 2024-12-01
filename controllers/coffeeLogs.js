const express = require('express');
const verifyToken = require('../middleware/verify-token.js');
const CoffeeLog = require('../models/coffeelog.js');
const router = express.Router();

// ================== Public Routes =======================

// ================== Protected Routes ====================

router.use(verifyToken); 

