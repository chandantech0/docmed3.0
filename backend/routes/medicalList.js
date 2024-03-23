const express = require('express')
const router = express.Router();
const medicalList = require('../models/medicalLists');
const checkUth = require('../middileware/user-auth');

router.post('/api/user/getMedicalLists', async (req, res, next) => {
    try {
        const { area, city } = req.body;
        // Define the condition based on the presence of area or city
        const condition = area ? { area, isActive: true, isBlock: false } : { city, isActive: true, isBlock: false };
        const medicalListEntry = await medicalList.find(condition);
    
        res.status(200).json({
          status: 'success',
          message: 'Data fetch success',
          medicalLists: medicalListEntry,
        });
      } catch (error) {
        res.status(500).json({
          status: 'error',
          message: 'Error fetching medical list:', error,
        });
      }
    });

    // Search
    router.post('/api/user/getMedicalListsSearch', (req, res, next) => {
        const searchKey = req.body.searchKey || '';
        const regex = new RegExp(searchKey, 'i');
        medicalList.find({
          city: req.body.city, 
          isActive: true, 
          isBlock: false,
          title: {$regex: regex}
        }).then((data) => {
            res.status(200).json({
                status: "success",
                message: 'data fetch success',
                medicalLists: data
            });
        })
    }); 

    // Get Medical By Chemist SignUpID
    router.post('/api/user/getMedicalListsByChemistId', (req, res, next) => {
        medicalList.find({
          isActive: true, 
          isBlock: false, 
          chemistSignUpId: req.body.chemistSignUpId
        }).then((data) => {
            res.status(200).json({
                status: "success",
                message: 'data fetch success',
                medicalLists: data
            });
        })
        });

module.exports = router;