function setHasMany(modelA, modelB,foreignKey=null){
    
    modelA.hasMany(modelB,{
        foreignKey:foreignKey,
        onDelete: 'cascade'
    });
    modelB.belongsTo(modelA ,{foreignKey:foreignKey});
}

function setBelongsToMany(modelA, modelB, modelCName){

     
    modelA.belongsToMany(modelB,{ through: modelCName });
    modelB.belongsToMany(modelA,{ through: modelCName });
}

module.exports = {setHasMany, setBelongsToMany};