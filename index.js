const express = require('express');
const bodyParser = require('body-parser')
const oneDriveAPI = require("onedrive-api")
// const http = require('http');
const pdfReader = require('pdf2json')
const authRouter = require('./src/routes/auth_route');
const transectionData = require('./src/routes/transection_data_route');
const dashboard = require('./src/routes/report_route')
const axios = require('axios');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require("path");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '/tmp/')
  },
  filename: function (req, file, cb) {
    const { fileName } = req.body
    cb(null, fileName)
  }
})

const app = express();
app.use(cors());
app.use(multer({ storage: storage, limits: { fieldSize: 50 * 1024 * 1024, fileSize: 50 * 1024 * 1024 } }).any());
const fs = require('fs');
app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', function (req, res) {
  const response = { message: 'API Works!!' }
  res.json(response)
});

app.use('/auth', authRouter)
app.use('/transection', transectionData)
app.use('/dashborad',dashboard)
app.put('/upload', async (req, res) => {
  const { token, directory, fileName } = req.body;
  console.log(directory);
  // console.log(file);
  let listUrl = [];
  // async function uploadFile2Onedrive(file){
  // }
  try {
    const filePath = `/tmp/${fileName}`;
    // const filePath = `uploads/${fileName}`;
    // const data = new Uint8Array(Buffer.from(file));
    // fs.appendFile(filePath, data,(err)=>{
    //   if(err)console.log(err);
    //   console.log('create file: ',filePath);
    // });
    const readStream = fs.createReadStream(filePath);
    await oneDriveAPI.items
      .uploadSimple({
        accessToken: token,
        filename: fileName,
        // filename: fileName,
        readableStream: readStream,
        parentPath: directory
      })
      .then((item) => {
        console.log(item);
        listUrl.push({
          // name:item.name,
          url: item.webUrl
        });
        fs.unlinkSync(filePath);
        return item.webUrl;
      });

    //  await uploadFile2Onedrive(req.files[i]);

    // for(var i in req.files){
    // await uploadFile2Onedrive(file);
    //  }
    res.json(listUrl);
  } catch (error) {
    res.statusCode;
  }
});


app.post('/renew-accesstoken', async (req, res) => {
  const { token } = req.body;
  console.log(token);
  axios({
    method: 'post',
    url: 'https://login.microsoftonline.com/organizations/oauth2/v2.0/token',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    data: {
      client_id: 'e1895f81-d211-4d80-b4a2-fdf0c9814ffc',
      scope: 'https://graph.microsoft.com/Files.ReadWrite.All',
      redirect_uri: 'https://myossc.web.app',
      grant_type: "refresh_token",
      client_secret: 'eKE8Q~gRq_OnTKi5pJCp4xWfHOo9EYfzF.lgaaX3',
      refresh_token: token, // This is the body part
    }
  }).then((response) => {
    // console.log(response);
    res.json(response.data);
  });
});

//NOTE - download file to server
app.post('/fetch', async (req, res) => {
  const { token, path2File,file } = req.body;
  if(!file)  return res.status(200).json({
    success: true,
  });
  const stream = fs.createWriteStream(`/tmp/${path2File.split('/')[3]}`);
  console.log(path2File);
  try {
    const promise = oneDriveAPI.items.download({
      accessToken: token,
      itemPath: path2File,
    });
    await promise.then((fileStream) => fileStream.pipe(stream));
    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
})

//NOTE - client download
app.get('/download/:filename', async (req, res) => {
  const { filename } = req.params;
  try {
    const fi = fs.readFileSync(path.resolve(`/tmp/${filename}`));
    res.send(fi);
  } catch (error) {
    console.log(error);
  }
});

app.get('/removefile/:filename',async(req,res)=>{
  const {filename} = req.params;
  const filePath = `/tmp/${filename}`;
  try {
    console.log('aaaaaaaaaaaaaaaaaaaa');
    fs.unlinkSync(filePath);
    res.send(true);
  } catch (error) {
    // console.log(error);
    res.send(false);
  }
})

app.get('/.well-known/microsoft-identity-association.json', async (req, res) => {
  // const { token, path2File } = req.body;
  // console.log(path2File);
  // console.log(file);
  // const stream = fs.createWriteStream(`downloads/${'test.pdf'}`);
  try {
    // fs.createReadStream(`microsoft-identity-association.json`).pipe(res);
    // res.send(JSON.stringify(`microsoft-identity-association.json`));
    fs.readFile(path.resolve(`microsoft-identity-association.json`), (err, json) => {
      let obj = JSON.parse(json);
      res.json(obj);
    });
    // const file = fs.exists(`microsoft-identity-association.json`);
    // res(file);
  } catch (error) {
    console.log(error);
  }
});

mongoose.connect('mongodb+srv://osscadmin:OsscAdmin2024@ossc-data.gok2lp3.mongodb.net/ossc-data', {
  //useNewUrlParser: true,
  //useUnifiedTopology: true,
}).then(() => {
  console.log('Database Connected');
}, (error) => {
  console.log(error.message);
});

//Run server in port
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  const intervalID = setInterval(myCallback, 5*60*1000);
  function myCallback() {
    if(new Date().getHours() > '12') {
      console.log('turn off api!! '+new Date().getHours());
    }else{
      axios({
        method: 'get',
        url: 'https://my-ossc-be-bs58.onrender.com/',
      }).then((response)=>{
        console.log('API Works!!'+'  '+new Date().getHours());
      });
    }
  }

  console.log('Run Server in Port ' + PORT)
});


