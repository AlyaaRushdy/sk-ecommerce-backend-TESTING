const express = require('express');

const {addAddress,getAllAddress,editAddress,deleteAddress} = require('../controllers/address.controller')

const router = express.Router();

router.post('/add', addAddress)
router.get('/get/:userId', getAllAddress)
router.delete('/delete/:userId/addressId',deleteAddress)
router.put('/update/:userId/:addressId',editAddress)

module.exports = router;