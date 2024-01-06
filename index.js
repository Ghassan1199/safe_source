const express = require("express");
const morgan = require('morgan')
const app = express();
require('dotenv').config();

const { connection } = require("./api/database/db");

const userRoutes = require("./api/routes/user.routes");
const groupRoutes = require("./api/routes/group.routes");
const fileRoutes = require('./api/routes/files.routes');

const logger = require("./api/services/logging.services");

const bodyParser = require("body-parser");
const scheduler = require("./api/services/schedular.services");

app.use(morgan("dev"))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const port = process.env.SERVER_PORT;

app.listen(port, async () => {
  console.log(`Listening on port ${port}....`);

  connection.sequelize.sync({ alter: true }).then(() => {
    console.log("connected to the database....")
  });

});

app.use((req, res, next) => {
  const originalSend = res.send;

  if (process.env.FILE_LOGGING) logger.logReq(req);

  res.send = function (...args) {

    if (!res.locals.responseLogged) {
      const response = { code: res.statusCode, body: args[0] };
      // logger.logRes(response);
      if (process.env.FILE_LOGGING) logger.logRes(response);
      logger.create_log_record(req, response)

      res.locals.responseLogged = true;
    }



    originalSend.apply(res, args);
  };

  next();
});

app.use("/users", userRoutes);
app.use("/groups", groupRoutes);
app.use('/files', fileRoutes);



scheduler.run;
