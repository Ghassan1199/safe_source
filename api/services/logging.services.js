const fs = require("fs");

const reqLogsPath = "./logfiles/reqlogs.log";
const resLogsPath = "./logfiles/reslogs.log";


const logReq = (req)=>{
    const data = `METHOD : ${req.method} | URL :  ${req.url} | PARAMS : ${JSON.stringify(req.params)} | QUERY : ${JSON.stringify(req.query)} | BODY ${JSON.stringify(req.body)} `;

    log(reqLogsPath, data);
}


const logRes = (res)=>{

  const body = typeof(res.body) === "object" ? JSON.stringify(res) : res.body;

    const data = `${res.code} | body ${body} `;

    log(resLogsPath, data);
}

const log = (path, data)=>{
    !fs.existsSync(`./logfiles`) && fs.mkdirSync(`./logfiles`, { recursive: true })

    const date = new Date().toLocaleString();

    const message = `${date} | ${data} \n`

      fs.appendFile(path, message, (err) => {
        if (err) {
          console.error('Error appending to the file:', err);
          return;
        }      
      });
}


module.exports = {logReq, logRes};