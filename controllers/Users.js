/**
 * @author Rido Martupa Simbolon
 */

import Users from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

// ambil data all data user dari database tabel sc_mst.users
export const getUsers = async(req, res) => {
  try {
    const users = await Users.findAll({
      attributes: ['id', 'name', 'username', 'level', 'bagian']
    });
    res.json(users);
  } catch (error) {
    console.log(error);
  }
}

// registrasi user baru
export const Register = async(req, res) => {
  // construct req.body ke dalam array di bawah
  const { name, username, password, conf_password, level, bagian } = req.body;
  if (password !== conf_password) return res.status(400).json({msg: "Password dan konfirmasi password tidak cocok!"});
  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(password, salt);
  try {
    // cek apakah username sudah ada di db atau tidak
    const { count, rows } = await Users.findAndCountAll({
      where: { username: username }
    });

    if (count > 0) {
      res.json({msg: `Register gagal. Username: ${username} sudah ada di sistem. Silakan gunakan username lain!`});
    } else {
      // insert data user baru ke db
      await Users.create({
        name: name,
        username: username,
        password: hashPassword,
        level: level,
        bagian: bagian
      });
  
      res.json({msg: "Register user baru berhasil!"});
    }

  } catch (error) {
    console.log(error);
  }
}

// fungsi untuk login user
export const Login = async(req, res) => {
  try {
    const user = await Users.findAll({
      where: {
        username: req.body.username
      }
    });

    const match = await bcrypt.compare(req.body.password, user[0].password);
    if(!match) return res.status(400).json({msg: "Password salah!"});

    const userid = user[0].id;
    const name = user[0].name;
    const username = user[0].username;
    const level = user[0].level;
    const bagian = user[0].bagian;
    const accesToken = jwt.sign({userid, name, username, level, bagian}, process.env.ACCESS_TOKEN_SECRET,{
      expiresIn: '30s'
    });
    const refreshToken = jwt.sign({userid, name, username, level, bagian}, process.env.REFRESH_TOKEN_SECRET,{
      expiresIn: '1d'
    });

    // simpan refresh token ke database
    await Users.update({
      refresh_token: refreshToken
    }, {
      where: {
        id: userid
      }
    });
    res.cookie('refreshToken', refreshToken, {
      httponly: true,
      maxAge: 24 * 60 * 1000,
    });

    res.json({ accesToken });
  } catch (error) {
    res.status(404).json({msg: `Username ${req.body.username}, tidak ditemukan!`});
  }
}

// logout
export const Logout = async(req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if(!refreshToken) return res.sendStatus(204);
  const user = await Users.findAll({
    where: {
      refresh_token: refreshToken
    }
  });
  if(!user[0]) return res.sendStatus(204);
  const userId = user[0].id;

  // set refresh token null by user id
  await Users.update({refresh_token: null},{
    where: {
      id: userId
    }
  });
  res.clearCookie('refreshToken');
  return res.sendStatus(200);
}