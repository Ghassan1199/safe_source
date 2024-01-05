const schedule = require('node-schedule');
const { Model, Op  } = require('../database/db')

const Booked_file = Model.BFR;
const File = Model.File;


const run = schedule.scheduleJob('*/10 * * * * *', async function () {
//'0 0 * * *'
//*/10 * * * * *

 

    await checkOutJop();



});





const checkOutJop = async () => {

  try {


    const data = await Booked_file.findAll({
        where: {
            check_out_date: null,
            exp_date: { [Op.lt]: new Date()}
         }});

    data.forEach(async bf =>{
     const file = await File.findByPk(bf.file_id);

     bf.check_out_date = new Date();
     await bf.save();

     file.check = false;
     await file.save();
    });

} catch (error) {
    console.log(error);

  }

};


module.exports = { run };
