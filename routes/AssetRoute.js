const express = require('express')
const router = express.Router()
const {GetAsset,AddAsset,DeleteAsset,UpdateAsset}=require('../controllers/AssetController')


router.route('/employeeassets/assets/:id?').get(GetAsset).post(AddAsset).put(UpdateAsset).delete(DeleteAsset)

module.exports=router