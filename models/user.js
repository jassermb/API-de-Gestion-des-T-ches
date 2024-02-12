const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: [true, 'Le champ "nom" est requis.'],
        trim: true,
        unique: true
    },

    prenom: {
        type: String,
        required: [true, 'Le champ "prenom" est requis.'],
        trim: true
    },

    tel: {
        type: String,
        required: [true, 'Le champ "tel" est requis.'],
        validate: {
            validator: function (value) {
                // Exemple : Valider que le numéro de téléphone est un format valide
                return /^\d{8}$/.test(value);
            },
            message: 'Le numéro de téléphone doit contenir 8 chiffres.'
        },
    },

    email: {
        type: String,
        required: [true, 'Le champ "email" est requis.'],
        unique: true,
        trim: true,
        lowercase: true, // Convertir l'adresse e-mail en minuscules
        validate: {
            validator: function (value) {
                // Exemple : Valider le format de l'adresse e-mail
                return /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(value);
            },
            message: 'Veuillez saisir une adresse e-mail valide.'
        },
    }
}, {
    timestamps: true,
    indexes: [{ unique: true, fields: ['nom'] }],
});

module.exports = mongoose.model('user', ContactSchema);
