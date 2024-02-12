//API users
const express = require("express");
const app = express();
const port = 3000;
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
// Configuration Swagger
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Gestion des Utilisateurs API',
      version: '1.0.0',
      description: 'API pour la gestion des utilisateurs avec Node.js, Express, et Mongoose.',
    },
  },

  apis: ['./index.js'], 
};

const specs = swaggerJsdoc(options);
// Utilisation de Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/User");
const db = mongoose.connection;
db.on("error", () => {
    console.log("Erreur");
});
db.once("open", () => {
    console.log("Connexion avec succees");
});
const userModel = require("./models/user");
/**
 * @swagger
 * /user/ajouter:
 *   post:
 *     summary: Ajouter un utilisateur
 *     description: Endpoint pour ajouter un utilisateur.
 *     parameters:
 *       - in: body
 *         name: user
 *         description: Les détails de l'utilisateur à ajouter.
 *         schema:
 *           type: object
 *           properties:
 *             nom:
 *               type: string
 *             prenom:
 *               type: string
 *             email:
 *               type: string
 *             tel:
 *               type: string
 *     responses:
 *       200:
 *         description: Succès, renvoie l'utilisateur ajouté.
 *       400:
 *         description: Erreur de validation ou champ "nom" en double.
 */

// ajouter user

app.post("/user/ajouter", async (req, res) => {
    try {
        const { nom, prenom, email, tel } = req.body;

        const user = new userModel({
            nom: nom,
            prenom: prenom,
            email: email,
            tel: tel
        });

        const saveduser = await user.save();

        return res.status(200).json({ message: "User ajouté avec succès :", user: saveduser });
    } catch (err) {
        if (err.name === 'MongoError' && err.code === 11000) {
       
            return res.status(400).json({ message: 'Le champ "nom" doit être unique.' });
        } else {
            return res.status(400).json({ message: "Le User n'est pas ajouté ! Erreur : " + err.message });
        }
    }
});
/**
 * @swagger
 * /user/lister:
 *   get:
 *     summary: Récupérer la liste des utilisateurs
 *     description: Endpoint pour récupérer la liste de tous les utilisateurs.
 *     responses:
 *       200:
 *         description: Succès, renvoie la liste des utilisateurs.
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               liste:
 *                 - _id: 1
 *                   nom: Dupont
 *                   prenom: Jean
 *                   email: jean.dupont@email.com
 *                   tel: +1234567890
 *                 - _id: 2
 *                   nom: Martin
 *                   prenom: Sophie
 *                   email: sophie.martin@email.com
 *                   tel: +9876543210
 *       500:
 *         description: Erreur interne du serveur.
 */
//lister user
app.get('/user/lister', async (req, res) => {
    try {
        // Les traitements nécessaires pour lister les users
        const liste = await userModel.find({}).exec();
        return res.status(200).json({ success: true, liste });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: 'Erreur interne du serveur.'
        });
    }
});
/**
 * @swagger
 * /user/{id}/supprimer:
 *   get:
 *     summary: Supprimer un utilisateur par ID
 *     description: Endpoint pour supprimer un utilisateur par son ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de l'utilisateur à supprimer.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Succès, renvoie l'utilisateur supprimé.
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               userDeleted:
 *                 _id: 1
 *                 nom: Dupont
 *                 prenom: Jean
 *                 email: jean.dupont@email.com
 *                 tel: +1234567890
 *       404:
 *         description: Aucun utilisateur trouvé avec cet ID.
 *       500:
 *         description: Erreur interne du serveur.
 */
// supprimer user
app.get('/user/:id/supprimer', async (req, res) => {
    try {
        // Les traitements nécessaires pour supprimer un user
        const userDeleted = await
            userModel.findByIdAndDelete(req.params.id).exec();
        if (!userDeleted) {
            return res.status(404).json({ success: false, message: 'Aucun usertrouvé avec cet ID.' });
        }
        return res.status(200).json({ success: true, userDeleted });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'Erreur interne duserveur.' });
    }
});
/**
 * @swagger
 * /user/{id}/modifier:
 *   put:
 *     summary: Modifier un utilisateur par ID
 *     description: Endpoint pour modifier un utilisateur par son ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de l'utilisateur à modifier.
 *         schema:
 *           type: string
 *       - in: body
 *         name: user
 *         description: Les détails mis à jour de l'utilisateur.
 *         schema:
 *           type: object
 *           properties:
 *             nom:
 *               type: string
 *             prenom:
 *               type: string
 *             email:
 *               type: string
 *             tel:
 *               type: string
 *     responses:
 *       200:
 *         description: Succès, renvoie l'utilisateur modifié.
 *         content:
 *           application/json:
 *             example:
 *               userUpdated:
 *                 _id: 1
 *                 nom: Dupont
 *                 prenom: Jean
 *                 email: jean.dupont@email.com
 *                 tel: +1234567890
 *       404:
 *         description: Aucun utilisateur trouvé avec cet ID.
 *       400:
 *         description: Erreur lors de la modification de l'utilisateur.
 */

// modifier user
app.put('/user/:id/modifier', async (req, res) => {
    try {
        const updateduser = await userModel.findByIdAndUpdate(req.params.id, {
            nom: req.body.nom,
            prenom: req.body.prenom,
            email: req.body.email,
            tel: req.body.tel,
        }, { new: true });

        if (!updateduser) {
            return res.status(404).json({ message: 'user non trouvé' });
        }

        return res.status(200).json({ userUpdated: updateduser });
    } catch (err) {
        res.status(400).json({ message: 'Erreur lors de la modification du user : ' + err.message });
    }
});
/**
 * @swagger
 * /user/rechercher:
 *   get:
 *     summary: Rechercher des utilisateurs
 *     description: Endpoint pour rechercher des utilisateurs par nom et/ou prénom.
 *     parameters:
 *       - in: query
 *         name: nom
 *         description: Nom de l'utilisateur (recherche insensible à la casse).
 *         schema:
 *           type: string
 *       - in: query
 *         name: prenom
 *         description: Prénom de l'utilisateur (recherche insensible à la casse).
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Succès, renvoie la liste des utilisateurs correspondants.
 *         content:
 *           application/json:
 *             example:
 *               - _id: 1
 *                 nom: Dupont
 *                 prenom: Jean
 *                 email: jean.dupont@email.com
 *                 tel: +1234567890
 *               - _id: 2
 *                 nom: Martin
 *                 prenom: Sophie
 *                 email: sophie.martin@email.com
 *                 tel: +9876543210
 *       500:
 *         description: Erreur interne du serveur.
 */
// chercher user
app.get('/user/rechercher', async (req, res) => {
    try {
        const { nom, prenom } = req.query;
        if (!nom && !prenom) {
            return res.status(400).json({ message: 'Le nom ou le prenom est requis pour la recherche.' });
        }
        let rechercheParams = {};
        if (nom) {
            rechercheParams.nom = { $regex: new RegExp(nom, 'i') }; 
        }
        if (prenom) {
            rechercheParams.prenom = { $regex: new RegExp(prenom, 'i') };
        }
        const resultatsRecherche = await userModel.find(rechercheParams).exec();
        return res.status(200).json(resultatsRecherche);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erreur interne du serveur.' });
    }
});


















app.listen(3000, () => {
    console.log(`Serveur demarré http:localhost:${port}`);
});