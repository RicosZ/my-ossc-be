const { request } = require('express');
const transection = require('../models/transection_data_model');

class AuthController {
    static async getDashboard(req, res, next) {
        try {
            console.log(req.query)
            const status = req.query.status
            const statusList = 
                ["เสร็จสิ้น","รับเข้า","คืนคำขอ"]
            const matchstatus = statusList[status]
            const yourstatus = await transection.find({
                status: matchstatus
            }).countDocuments()
            return res.status(200).json(yourstatus);
        } catch (error) {
            return next(error);
        }
    }
}

module.exports = AuthController