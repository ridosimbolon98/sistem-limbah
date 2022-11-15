import { Sequelize } from 'sequelize';
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

// create table sc_mst.users
const Users = db.define('users', {
  name:{
    type: DataTypes.STRING
  },
  username:{
    type: DataTypes.STRING
  },
  password:{
    type: DataTypes.STRING
  },
  level:{
    type: DataTypes.STRING
  },
  bagian:{
    type: DataTypes.STRING
  },
  refresh_token:{
    type: DataTypes.TEXT
  },
},{
  freezeTableName: true,
  schema: 'sc_mst',
});

export default Users;