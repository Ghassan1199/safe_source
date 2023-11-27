function setHasMany(modelA, modelB, foreignKey = null) {

    modelA.hasMany(modelB, {
        foreignKey: foreignKey,
        onDelete: 'cascade',
        allowNull: false
    });

    modelB.belongsTo(modelA, {
        foreignKey: foreignKey
    });
}

function setBelongsToMany(modelA, modelB, modelCName) {


    modelA.belongsToMany(modelB, {
        through: modelCName,
        onDelete: 'cascade',
        allowNull: false
    });

    modelB.belongsToMany(modelA, {
        through: modelCName,
        onDelete: 'cascade',
        allowNull: false
    });
}

module.exports = { setHasMany, setBelongsToMany };