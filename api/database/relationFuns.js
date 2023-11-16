function setHasMany(modelA, modelB){
    modelA.hasMany(modelB);
    modelB.belongsTo(modelA);
}

function setBelongsToMany(modelA, modelB, modelCName){

     
    modelA.belongsToMany(modelB,{ through: modelCName });
    modelB.belongsToMany(modelA,{ through: modelCName });
}

module.exports = {setHasMany, setBelongsToMany};