const mongoose = require('mongoose');

const transectionDataSchema = new mongoose.Schema(
  {
    date:Date,
    receiveNumber:String,
    customer:String,
    company:String,
    district:String,
    tel:String,
    act:String,
    type:String,
    desc:String,
    cost:String,
    slipUrl:String,
    doc:String,
    requestStaff:String,
    docStatus:String,
    inspectionTeam:String,
    recivedDate:String,
    waitingToCheck:String,
    checkLocation:String,
    results:String,
    sendResults:String,
    resultsStatus:String,
    officer2:String,
    recived:String,
    recivedResultDate:String,
    recivedName:String,
    recivedSign:String,
    license:String,
    licenseDate:String,
    licenseFee:String,
    licenseFeeSlip:String,
    placeNumber:String,
    licenseNumber:String,
    businessLicenseNumber:String,
    operationLicenseNumber:String,
    advertisingLicenseNumber:String,
    spaOperatorLicenseNumber:String,
    sign:String,
    receiveDate:String,
    parcelNumber:String,
    signature:String,
    status:String,
  },
);

const collectionName = 'transectionData';
const TransectionData = mongoose.model('TransectionData', transectionDataSchema, collectionName);

module.exports = TransectionData;
