const express = require('express');
const bodyParser = require('body-parser')
const oneDriveAPI = require("onedrive-api")
// const http = require('http');
const axios = require('axios');

const cors = require('cors');
const multer = require('multer');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
    },
    filename: function (req, file, cb) {
      const {fileName} = req.body
      cb(null, fileName)
    }
})

const app = express()   ;
app.use(cors());
app.use(multer({storage: storage,limits: { fieldSize: 50 * 1024 * 1024 ,fileSize: 50 * 1024 * 1024}}).any());
const fs = require('fs');
app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/',function(req,res){
    const response = {message: 'API Works!!'}
    res.json(response)
});

app.put('/upload',async (req,res)=>{
  const { token, directory, fileName } = req.body;
  console.log(directory);
  // console.log(file);
    let listUrl = [];
    // async function uploadFile2Onedrive(file){
      // }
      try {
      const filePath = `uploads/${fileName}`;
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
                  url:item.webUrl
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

app.get('/download',async (req,res)=>{
  const { token, path2File } = req.body;
  console.log(path2File);
  // console.log(file);
  const stream = fs.createWriteStream(`downloads/${'test.pdf'}`);
    try {
      const promise = oneDriveAPI.items.download({
        accessToken: token,
        itemPath: path2File,
      });
      await promise.then((fileStream) => fileStream.pipe(stream));
        // for(var i in req.files){
          // await uploadFile2Onedrive(file);
      //  }
      const file = fs.readFileSync(`downloads/${'test.pdf'}`);
        res.json(file);
    } catch (error) {
        console.log(error);
    }
});

app.post('/renew-accesstoken',async (req,res)=>{
  const { token } = req.body;
  console.log(token);
  // const options = {
  //   hostname: 'https://login.microsoftonline.com',
  //   path: '/common/oauth2/v2.0/token',
  //   method: 'POST'
  // };
  // const response = http.request(options, (res)=>{
  //   return res;
  // });
  // console.log(response);

    // const response = axios.post('https://login.microsoftonline.com/common/oauth2/v2.0/token',{
    //   'client_id':'e1895f81-d211-4d80-b4a2-fdf0c9814ffc',
    //   'scope':'https://graph.microsoft.com/Files.ReadWrite.All',
    //   'redirect_uri':'https://myossc.web.app',
    //   'grant_type':'refresh_token',
    //   'client_secret':'eKE8Q~gRq_OnTKi5pJCp4xWfHOo9EYfzF.lgaaX3',
    //   'refresh_token':'M.C106_BAY.-Cqlolrko!C*XbD1PTtfr5HTBgwCyWc!ykHpChD53FlzTlHvkQnDdUkkDnplM3d34U8jQGvz2J7dZAN8mrjZcrc503O7D3zMvD3HWNT!jkhgknA0aO0qhh4sfelAGwAtVjVAmHcqkXDz8nHCPB!SAKES3amiysZnatpsCdYbl2sE9SXy11SVWZdiElMSd3BMnq*m5u6Uve!sPgvl6aO*!N9HXcG3e9wg4rWErx4qDiJsmNrZDHkF4dpyYGpntu*oSa3o1VuwY8IdwfY5*6QbrO*pT4OtYg2YJGz2fCGBoaIz8rCGRalFewQN1eq29YF*z4Vk4ll!nvXDNKwG!yZz8bOycS6baNOP2wrsIzjEn2Og9CqNdKKidVSIdDMjcmuBVlF8TSHG2!vEJAFrCl9iVhSY$',
    //   headers: {
    //     'Content-Type': 'application/x-www-url-form-urlencoded'
    //   }
    // });
    axios({
      method: 'post',
      url: 'https://login.microsoftonline.com/organizations/oauth2/v2.0/token',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}, 
      data: {
        client_id:'e1895f81-d211-4d80-b4a2-fdf0c9814ffc',
        scope:'https://graph.microsoft.com/Files.ReadWrite.All',
        redirect_uri:'https://myossc.web.app',
        grant_type:"refresh_token",
        client_secret:'eKE8Q~gRq_OnTKi5pJCp4xWfHOo9EYfzF.lgaaX3',
        refresh_token:token, // This is the body part
      }
    }).then((response)=>{
      // console.log(response);
      res.json(response.data);
    });
});

app.get('/.well-known/microsoft-identity-association.json',async (req,res)=>{
  // const { token, path2File } = req.body;
  // console.log(path2File);
  // console.log(file);
  // const stream = fs.createWriteStream(`downloads/${'test.pdf'}`);
    try {
      // fs.createReadStream(`microsoft-identity-association.json`).pipe(res);
      // res.send(JSON.stringify(`microsoft-identity-association.json`));
      fs.readFile(`microsoft-identity-association.json`, (err, json) => {
        let obj = JSON.parse(json);
        res.json(obj);
      });
      // const file = fs.exists(`microsoft-identity-association.json`);
        // res(file);
    } catch (error) {
        console.log(error);
    }
});
function myCallback(interval) {
  // Your code here
  // Parameters are purely optional.
  console.log('Refresh: '+interval);
}

//Run server in port
const PORT = process.env.PORT || 3000
app.listen(PORT,()=>{
    const intervalID = setInterval(myCallback, 180000, "Server");
    console.log('Run Server in Port ' + PORT)
});


