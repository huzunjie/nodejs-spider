nodejs-spider
=============

```js
import fs from 'fs';
import https from 'https';

function writeFilePromise(file, data){
  return new Promise((resolve, reject) => {
    fs.writeFile(file, data, err => {
      err ? reject(err) : resolve(file);
    });
  });
}

function getContentPromise(url){
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      var chunks = [], size = 0;
      res.on("data" , chunk => {
        chunks.push(chunk);
        size += chunk.length;
      });
      res.on("end" , () => {
        if(res.statusCode !== 200){
          return reject({ code:res.statusCode, errorMessage:'HTTP Error' });
        }
        var data = Buffer.concat(chunks , size).toString();
        resolve(data);
      })
    }).on('error' , reject);
  });
};
```


