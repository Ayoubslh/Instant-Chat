const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
});

let convohistory = [];
let result

exports.Generate = async (req, res, next) => {
    try {
        const prompt = req.body.prompt || " ";
        const imagebas64 = req.body.image || null;


        const userMessage = {
            role: "user",
            parts: [{ text: prompt }],
        };

        let additionalInputs = [];
        if (imagebas64) {
            additionalInputs.push({
                inlineData: {
                    data: imagebas64,
                    mimeType: "image/*",
                },
            });
        }


        convohistory.push(userMessage);

        const chat = model.startChat({
            history: convohistory,
        });

        if (imagebas64) {
            result = await chat.sendMessage([prompt, additionalInputs]);
        } else {
            result = await chat.sendMessage([prompt]);
        }


        convohistory.push({
            role: "model",
            parts: [{ text: result.response.text() }],
        });


        res.status(200).json({
            status: "Success",
            answer: result.response.text(),
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            status: "Error",
            message: err.message,
        });
    }
};
