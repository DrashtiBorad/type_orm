import { appDataSource } from "../config/database";
import { Otp } from "../entities/otp";
import { User } from "../entities/user";
import jwt from "jsonwebtoken";
import nodeMailer from "nodemailer";

const userDataSource = appDataSource.getRepository(User);
const OtpDataSource = appDataSource.getRepository(Otp);
const jwtPrivateKey = process.env.JSON_KEY;

export const registration = async (req: any, res: any) => {
  const { name, email, password, confirmPassword, role } = req.body;

  try {
    const user = await userDataSource.find({
      where: {
        email: email,
      },
    });

    if (user.length > 0) {
      return res.status(400).json({ error: "Email is already registered." });
    }

    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ error: "Password and ConfirmPassword do not match." });
    }

    const result = await userDataSource.insert({
      name,
      email,
      password,
      role,
    });

    jwt.sign(
      { result },
      jwtPrivateKey as string,
      { expiresIn: "1h" },
      (error, token) => {
        if (token) {
          res.status(200).json({ result, auth: token });
        } else if (error) {
          console.log("error in jwt token", error);
        }
      }
    );
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export const logIn = async (req: any, res: any) => {
  const { email, password } = req.body;

  try {
    const result = await userDataSource.find({
      where: {
        email: email,
        password: password,
      },
    });
    if (result.length > 0) {
      jwt.sign(
        { result },
        jwtPrivateKey as string,
        { expiresIn: "1h" },
        (error, token) => {
          if (token) {
            res.status(200).json({ result, auth: token });
          } else if (error) {
            console.log("error in jwt token", error);
          }
        }
      );
    } else {
      res.status(400).json({ error: "Please Enter valid Email and password" });
    }
  } catch (err) {
    res.send(400).json({ error: err });
  }
};

export const sendOtp = async (req: any, res: any) => {
  const { email } = req.body;
  const otpCode = Math.floor(100000 + Math.random() * 900000);
  const expireAt = new Date(Date.now() + 5 * 60 * 1000);

  try {
    const transporter = nodeMailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.AUTH_USER_EMAIL,
        pass: process.env.AUTH_USER_PASSWORD,
      },
    });

    const info = transporter.sendMail({
      from: process.env.AUTH_USER_EMAIL,
      to: email,
      subject: "send mail",
      html: `OTP is ${otpCode}`,
    });

    console.log("expireAt", expireAt);

    OtpDataSource.save({ email, otpCode, expiredAt: expireAt });
    res.status(200).json(info);
  } catch (err) {
    res.send(400).json("Failed to send mail");
  }
};

export const otpVerify = async (req: any, res: any) => {
  const { email, otp } = req.body;

  const storedOtps = await OtpDataSource.find(email);
  const storedOtp = storedOtps[0];

  const expiredTime = new Date(storedOtp.expiredAt);

  if (!storedOtp) {
    res.status(400).json({ error: "OTP not found or expir]ed" });
  }

  if (new Date(Date.now()) > expiredTime) {
    await OtpDataSource.delete({ email: email });
    res.status(400).json({ error: "OTP expired" });
  }

  if (otp === storedOtp.otpCode) {
    const token = jwt.sign({ email }, jwtPrivateKey as string, {
      expiresIn: "1h",
    });
    await OtpDataSource.delete({ email: email });
    res.status(200).json({
      message: "OTP verified successfully",
      token,
    });
  } else {
    res.status(500).json({ eror: "Invalid OTP." });
  }
};

export const resetPassword = async (req: any, res: any) => {
  const { password, confirmPassword } = req.body;
  const token = req.headers["authorization"];

  if (!token) {
    res.status(401).json({ error: "Authorization header is missing" });
  }

  const extractedToken = token?.split(" ")[1];
  console.log("extractedTokenextractedToken", extractedToken);
  try {
    const decoded = jwt.verify(
      extractedToken as string,
      jwtPrivateKey as string
    );

    const { result }: any = decoded;
    const { email }: any = result;

    if (password === confirmPassword) {
      const result = await userDataSource.update(email, { password });

      res.status(200).json(result);
    } else {
      res
        .status(500)
        .json({ error: "Password and ConfirmPassword is not match." });
    }
  } catch (error) {
    res.status(500).json({ error: error });
  }
};
