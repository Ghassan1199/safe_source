const {Mutex} = require("async-mutex");




const fileMutexes = new Map();


const getFileMutex = (file_id)=>{
    if (!fileMutexes.has(file_id)) {
      fileMutexes.set(file_id, new Mutex());
    }

    console.log("size when get", fileMutexes.size);
    return fileMutexes.get(file_id);
  }

  const deleteFileMutex = (file_id)=>{
    console.log("size when delete", fileMutexes.size);

     fileMutexes.delete(file_id);
  }

  module.exports = {getFileMutex, deleteFileMutex};
