const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: [true, "Full name is required"],
            trim: true,
            minlength: [3, "Full name must be at least 3 characters"],
        },
        address: {
            type: String,
            required: false,
            trim: true,
        },
        phone: {
            type: String,
            required: false,
            match: [/^\d{10,15}$/, "Phone number must be 10-15 digits"],
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
            trim: true,
        },
        linkedEmails: {
            type: [String],
            validate: {
                validator: function (emails) {
                    return emails.every(email => /^\S+@\S+\.\S+$/.test(email));
                },
                message: "Each linked email must be a valid email address",
            },
            default: [],
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            select: false,
        },
        confirmPassword: {
            type: String,
            required: [true, "Password confirmation is required"],
            validate: {
                validator: function (value) {
                    // `this.password` is available only on `save()` or `create()`
                    console.log();
                    return value === this.password;
                },
                message: "Passwords do not match",
            },
        },
        role: {
            type: String,
            enum: ["Client", "Admin"],
            default: "Client",
        },
        image: {
            type: String,
        },
        googleId: {
            type: String,
            unique: true,
            sparse: true
        },
        resetCode: {
            type: Number,
            required: false,
        },
        resetCodeExpiresAt: {
            type: Date,
            required: false,
        },
        ChangesAt: {
            type: Date,
            required: false,
        },
        accessToken: String,
        refreshToken: String,
    },
    { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    this.confirmPassword = undefined; // Remove the confirmation field
    this.ChangesAt = Date.now() - 1000;
    next();
});

// Method to compare passwords
userSchema.methods.correctPassword = async function (candidatePassword, currentPassword) {
    return await bcrypt.compare(candidatePassword, currentPassword);
};
userSchema.methods.changedPasswordAfter = function (JWTTimestamps) {
    if (this.ChangesAt) {
        const changedTimestamps = parseInt(this.ChangesAt.getTime() / 1000, 10);
        return JWTTimestamps < changedTimestamps;
    }
    // false means that the pass does not changed
    return false;
}

userSchema.methods.createResetPassToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetExpires = new Date() + 10 * 60 * 1000;
    return resetToken
}
module.exports = mongoose.model("User", userSchema);
