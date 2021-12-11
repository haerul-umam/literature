'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Literatur extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Literatur.belongsTo(models.User,{
        as: "user",
        foreignKey: {
          name: "idUser"
        }
      })
      Literatur.hasMany(models.Collection,{
        as: "collection",
        foreignKey: {
          name: "id"
        }
      })
      Literatur.hasMany(models.Cancel, {
        as: "message",
        foreignKey: {
          name: "id"
        }
      })
    }
  };
  Literatur.init({
    title: DataTypes.STRING,
    pubDate: DataTypes.DATE,
    pages: DataTypes.INTEGER,
    isbn: DataTypes.STRING,
    author: DataTypes.STRING,
    files: DataTypes.STRING,
    idUser: DataTypes.INTEGER,
    status: DataTypes.ENUM('Approve', 'Cancel', 'Waiting to be verified')
  }, {
    sequelize,
    modelName: 'Literatur',
  });
  return Literatur;
};