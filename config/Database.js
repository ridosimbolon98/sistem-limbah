/**
 * ==========================================================
 * +                koneksi ke database                     +
 * ==========================================================
 * @author Rido Martupa Simbolon
 * IT NBI SMG
 */

import { Sequelize } from 'sequelize';
import dotenv from "dotenv";
dotenv.config();

const db = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  dialect: 'postgres'
});
 
 export default db;
 
 