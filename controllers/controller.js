const User = require("../models/user-model");
const RefreshToken = require("../models/refresh-token-model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const ROLE_LIST = require("../config/roles-list");

const get = (req, res) => {
    res.status(200).json({
        data: "success",
    });
};

const registerUser = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({
            message: "Username and passord required.",
        });
    }

    try {
        const check = await User.findOne({
            username,
        });

        if (check) {
            return res.status(409).json({
                message: "The username is already taken.",
            });
        }
    } catch (err) {
        res.status(500).json({
            message: err.message,
        });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        User.create({
            username,
            password: hashedPassword,
            roles: [ROLE_LIST.User],
        });
        return res.status(201).json({
            message: `New user: ${username} created.`,
        });
    } catch (err) {
        return res.status(500).json({
            message: err.message,
        });
    }
};

// Authentication
const handleLogin = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({
            message: "Username and passord required.",
        });
    }

    try {
        const user = await User.findOne({
            username,
        });

        if (!user) {
            return res.sendStatus(401);
        }

        const match = await bcrypt.compare(password, user.password);

        if (match) {
            const roles = user.roles;
            const accessToken = jwt.sign(
                {
                    userInfo: {
                        username: user.username,
                        roles,
                    },
                },
                process.env.ACCESS_TOKEN_SECRET,
                {
                    expiresIn: "5m",
                }
            );
            const refreshToken = jwt.sign(
                {
                    username: user.username,
                },
                process.env.REFRESH_TOKEN_SECRET,
                {
                    expiresIn: "1d",
                }
            );

            RefreshToken.create({
                username: user.username,
                token: refreshToken,
            });

            res.cookie("jwt", refreshToken, {
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000, // 1day
            });
            res.status(200).json({
                accessToken,
            });
        } else {
            res.sendStatus(401);
        }
    } catch (err) {
        res.status(500).json({
            message: err.message,
        });
    }
};

const refreshToken = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) {
        return res.sendStatus(401);
    }
    const refreshToken = cookies.jwt;
    try {
        const user = await RefreshToken.findOne({
            token: refreshToken,
        });

        if (!user) {
            return res.sendStatus(403);
        }

        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            async (err, decoded) => {
                if (err || user.username !== decoded.userInfo.username) {
                    return res.sendStatus(403);
                }

                const userData = await User.findOne({
                    username: user.username,
                });

                const roles = userData.roles;

                const accessToken = jwt.sign(
                    {
                        userInfo: {
                            username: decoded.userInfo.username,
                            roles,
                        },
                    },
                    process.env.ACCESS_TOKEN_SECRET,
                    { expiresIn: "5m" }
                );
                res.status(200).json({ accessToken });
            }
        );
    } catch (err) {
        res.status(500).json({
            message: err.message,
        });
    }
};

const handleLogout = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) {
        return res.sendStatus(204); // No content to send
    }
    const refreshToken = cookies.jwt;

    try {
        const user = await RefreshToken.findOne({
            token: refreshToken,
        });

        if (!user) {
            res.clearCookie("jwt", { httpOnly: true });
            return res.sendStatus(204);
        }

        await jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            async (err, decoded) => {
                if (err || user.username !== decoded.userInfo.username) {
                    res.clearCookie("jwt", { httpOnly: true });
                    return res.sendStatus(204);
                }
                await RefreshToken.deleteOne({
                    token: refreshToken,
                    username: decoded.userInfo.username,
                });
                res.clearCookie("jwt", { httpOnly: true });
                return res.sendStatus(204);
            }
        );
    } catch (err) {
        res.status(500).json({
            message: err.message,
        });
    }
};

module.exports = {
    get,
    registerUser,
    handleLogin,
    refreshToken,
    handleLogout,
};
