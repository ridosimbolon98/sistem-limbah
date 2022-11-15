import Users from "../models/UserModel.js";
import jwt from "jsonwebtoken";

export const refreshToken = async(req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken) return res.sendStatus(401);
    const user = await Users.findAll({
      where: {
        refresh_token: refreshToken
      }
    });

    if (!user[0]) return res.sendStatus(403);
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
      if(err) return sendStatus(403);
      const userid = user[0].id;
      const name = user[0].name;
      const username = user[0].username;
      const level = user[0].level;
      const bagian = user[0].bagian;
      const accesToken = jwt.sign({userid, name, username, level, bagian}, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '20s'
      });
      res.json({ accesToken });
    });
  } catch (error) {
    console.log(error);
  }
}