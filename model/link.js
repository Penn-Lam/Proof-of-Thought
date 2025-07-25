const mongoose = require("mongoose");

/**
 * Proof-of-Thought Link Schema
 * This schema defines the structure for each shortened link, integrating
 * the original 'warp' functionality with the new 'Proof-of-Thought' features.
 */
const linkSchema = new mongoose.Schema({

    path: {
        type: String,
        unique: true,       // A unique identifier for the shortened link.
        required: [true, 'Path is required.'], // Can be user-defined or system-generated.
        index: true         // Indexing for faster lookups.
    },
    url: {
        type: String,
        required: [true, 'Original URL is required.'] // The final destination URL.
    },
    views: {
        type: Number,
        default: 0          // A simple view counter from the original project.
    },

    scene: {
        type: String,
        // The context scene for the shared link.
        enum: ['ai_chat', 'ai_art', 'ai_code', 'general'],
        required: [true, 'Scene selection is required.']
    },
    potData: {
        // A flexible object to store the form data from the user.
        // Its structure will vary depending on the 'scene'.
        // For 'ai_chat', it might be { insight: '...', interpretation: '...', query: '...' }
        type: mongoose.Schema.Types.Mixed,
        required: [true, 'Proof of Thought data cannot be empty.']
    },
    // The pre-formatted text for the user to copy.
    // Example: "Check out my thoughts on this AI chat: {short_link}"
    copyTemplate: {
        type: String,
        required: [true, 'Copy template is required.']
    },
    createdAt: {
        type: Date,
        default: Date.now // Timestamp for when the link was created.
    }
});

module.exports = mongoose.model("Link", linkSchema);
