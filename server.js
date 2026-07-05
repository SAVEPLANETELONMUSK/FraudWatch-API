const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        project: "FraudWatch",
        status: "Online",
        version: "1.0.0"
    });
});

app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "FraudWatch API is running."
    });
});

app.post("/api/verify", (req, res) => {

    const input = req.body.input || "";

    let type = "Unknown";

    if (input.includes("@")) {

        type = "Email";

    } else if (input.startsWith("http") || input.includes(".")) {

        type = "Website / Domain";

    } else if (/^[+]?[0-9\s()-]+$/.test(input)) {

        type = "Phone Number";

    }

    res.json({

        success: true,

        input,

        detectedType: type,

        guidance: "FraudWatch provides educational guidance. Always verify information independently before making financial or personal decisions."

    });

});

const PORT = 3000;

app.listen(PORT, () => {

    console.log("FraudWatch API running on port " + PORT);

});
