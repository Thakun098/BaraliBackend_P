require("dotenv/config")
const db = require("../models");
const User = db.user;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
exports.signin = (req, res) => {
    
    const { email, password } = req.body
    User.findOne({
        where: {
            email: req.body.email
        }
    }).then((user) => {
        if (!user) {
            return res.status(404).json({
                message: "Email not found."
            })
        }
        let passwordIsValid = bcrypt.compareSync(
            req.body.password, 
            user.password 
        );
        if (!passwordIsValid) {
            return res.status(401).json({
                message: "Password is invalid"
            });
        }
        const token = jwt.sign(
            { id: user.id },
            process.env.SECRET_KEY,
            {
                algorithm: 'HS256',
                allowInsecureKeySizes: true,
                expiresIn: '1d'
            }
        );
        let authorities = [];
        user.getRoles()
            .then(roles => {
                for (let i = 0; i < roles.length; i++) {
                    authorities.push("ROLE_" + roles[i].name.toUpperCase());
                }
                res.status(200).json({
                    id: user.id,
                    name: user.firstname,
                    lastname: user.lastname,
                    email: user.email,
                    roles: authorities,
                    accessToken: token
                });
            });
    }).catch(err => {
        res.status(500).json({ message: err.message });
    });
}