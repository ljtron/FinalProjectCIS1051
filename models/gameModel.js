const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Game = new Schema ({
    owner: { type: String, required: true },
    players: {type: Array},
    celebrities: {type: Array},
    type: { type: String, required: true },
    score: {},
    correct: {type: Number},
    rounds: {type: Number, required: true},
    questions: {type: Array}
})

module.exports = mongoose.model('game', Game)