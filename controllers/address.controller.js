const Address = require("../models/address");

const addAddress = async(req,res) => {
    try{
        const {userId,address,city,pinCode,phone,notes} = req.body;

        if(!userId || !address || !city || !pinCode || !phone || !notes){
            return res.status(400).json({
                success: false,
                message: "Invalid data provided"
            })
        }

        const newCreatedAddress = new Address({
            userId, address, city, pinCode, notes, phone 
        })

        await newCreatedAddress.save();

        res.status(201).json({
            success: true,
            data: newCreatedAddress
        })

    }catch(e){
        console.log(e);
        res.status(500).json({
            success: false,
            message: 'Error'
        })
    }
}

const getAllAddress = async(req,res) => {
    try{

        const {userId} = req.params
        if(!userId){
            return res.status(400).json({
              success: false,
              message: "User id is required", 
            });
        }

        const addressesList = await Address.find({userId});

        res.status(200).json({
            success: true,
            data: addressesList
        })

    }catch(e){
        console.log(e);
        res.status(500).json({
            success: false,
            message: 'Error'
        })
    }
}

const editAddress = async(req,res) => {
    try{

        const {userId , addressId} = req.params;
        const formData = req.body;

        if(!userId || !addressId){
            return res.status(400).json({
              success: false,
              message: "User and Address id is required", 
            });
        }

        const address = await Address.findByOneAndUpdate({
            _id: addressId,
            userId,
        },
        formData,
        {new: true}
        );

        if(!address) {
            return res.status(404).json({
                success: false,
                message: "Address not found"
            })
        }

        res.status(200).json({
            success: true,
            data: address
        })



        
    }catch(e){
        console.log(e);
        res.status(500).json({
            success: false,
            message: 'Error'
        })
    }
}

const deleteAddress = async(req,res) => {
    try{
        const {addressId, userId} = req.params;

        if(!userId || !addressId){
            return res.status(400).json({
              success: false,
              message: "User and Address id is required", 
            });
        }

        const address = await Address.findOneAndDelete({
            _id: addressId,
            userId
        })

        if(!address) {
            return res.status(404).json({
                success: false,
                message: "Address not found"
            })
        }

        res.status(200).json({
            success: true,
            message: "Address deleted Successfully",
        })

    }catch(e){
        console.log(e);
        res.status(500).json({
            success: false,
            message: 'Error'
        })
    }
}

module.exports = {addAddress, editAddress , getAllAddress , deleteAddress}