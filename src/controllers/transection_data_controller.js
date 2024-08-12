const TransectionData = require('../models/transection_data_model');
const xlsx = require('xlsx');

class TransectionController {

    static async export2Excel(req, res, next) {
        const { act = '', desc = '', dateBefor, dateAfter } = req.body;
        let pipeline = [
            {
                '$match': {
                    'act': act == '' ? RegExp('') : act
                }
            }, {
                '$match': {
                    'desc': desc == '' ? RegExp('') : desc
                }
            }, {
                '$match': {
                    'date': {
                        $gte: new Date(dateBefor),
                        $lte: new Date(dateAfter),
                    }
                }
            }, {
                '$sort': {
                    '_id': 1
                }
            }
        ]
        // await TransectionData.find({}).sort({_id:1})
        await TransectionData.aggregate(Array.prototype.concat(pipeline)).then(result => {
            // if(result.length > 0 ){
            let response = JSON.parse(JSON.stringify(result));
            let workbook = xlsx.utils.book_new();
            let worksheet = xlsx.utils.json_to_sheet(response);
            xlsx.utils.book_append_sheet(workbook, worksheet, 'sheet1');
            xlsx.writeFile(workbook, 'downloads/ossc-data.xlsx');
            return res.status(200).json({
                success: true
            });
            // } else {
            // return res.status(200).json({
            //     success: false
            // })
            // }
        })
    }

    static async getReceiveNumber() {
        const reNUmber = await TransectionData.findOne().sort({ _id: -1 });
        let number = parseInt(reNUmber.receiveNumber.split('/')[0].split('E')[1]) + 1
        console.log(number);
    }

    static async get(req, res, next) {
        try {
            const { act = '', desc = '', search = '', limit = 100 } = req.query;
            let pipeline = [
                {
                    '$match': {
                        'act': act == '' ? RegExp('') : act
                    }
                }, {
                    '$match': {
                        'desc': desc == '' ? RegExp('') : desc
                    }
                }, {
                    '$match': {
                        '$or': [
                            {
                                'receiveNumber': RegExp(search)
                            }, {
                                'customer': RegExp(search)
                            }, {
                                'company': RegExp(search)
                            }
                        ]
                    }
                }, {
                    '$sort': {
                        '_id': -1
                    }
                }
            ]
            const data = await TransectionData.aggregate(
                Array.prototype.concat(
                    limit != 0
                        ?
                        [
                            {
                                '$match': {
                                    'act': act == '' ? RegExp('') : act
                                }
                            }, {
                                '$match': {
                                    'desc': desc == '' ? RegExp('') : desc
                                }
                            }, {
                                '$match': {
                                    '$or': [
                                        {
                                            'receiveNumber': RegExp(search)
                                        }, {
                                            'customer': RegExp(search)
                                        }, {
                                            'company': RegExp(search)
                                        }
                                    ]
                                }
                            }, {
                                '$sort': {
                                    '_id': -1
                                }
                            }, {
                                '$limit': parseInt(limit)
                            }
                        ] : pipeline
                ));
            return res.status(200).json({
                success: true,
                data: data
            })
        } catch (error) {
            return next(error);
        }
    }

    static async add(req, res, next) {
        try {
            const { date, customer, company, district, tel, act, type, desc, cost, slipUrl, doc, requestStaff } = req.body;
            const reNUmber = await TransectionData.findOne().sort({ _id: -1 });
            var year = new Date().getUTCFullYear() + 543
            let number = parseInt(reNUmber.receiveNumber.split('/')[0].split('E')[1]) + 1
            let receiveNumber
            year > new Date(date).getFullYear() + 543
                ? receiveNumber = `E${1}/${year}`
                : receiveNumber = `E${number}/${year}`
            const data = {
                date,
                receiveNumber,
                customer,
                company,
                district,
                tel,
                act,
                type,
                desc,
                cost,
                slipUrl,
                doc,
                requestStaff,
                status: 'รับเข้า'
            };
            const transection = await TransectionData.create(data);
            return res.status(200).json({
                success: true,
                receiveNumber: transection.receiveNumber
            })
            // return res.status(401).json({});
        } catch (error) {

            return next(error);
        }
    }
    static async edit(req, res, next) {
        try {
            const data = req.body;
            console.log(data);
            await TransectionData.findOneAndUpdate(
                { receiveNumber: data.receiveNumber },
                data,
                { new: true }
            );
            return res.status(200).json({
                success: true
            })
        } catch (error) {
            console.log(error);
            return next(error);
        }
    }
}

module.exports = TransectionController