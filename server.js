const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {

res.json({

project: "FraudWatch",

status: "Online",

version: "2.0.0",

message: "FraudWatch API is running successfully."

});

});

app.get("/api/health", (req, res) => {

res.json({

success: true,

status: "healthy",

service: "FraudWatch API",

time: new Date().toISOString()

});

});

function detectInputType(input){

const value = input.trim();

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;

const websiteRegex = /^(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,}$/i;

const phoneRegex = /^[+]?[0-9()\-\s]{7,20}$/;

const usernameRegex = /^@?[A-Za-z0-9_.]{3,}$/;

if(emailRegex.test(value)) return "email";

if(ipRegex.test(value)) return "ip";

if(websiteRegex.test(value)) return "website";

if(phoneRegex.test(value)) return "phone";

if(usernameRegex.test(value) && !value.includes(" "))

return "username";

return "general";

}

app.post("/api/verify",(req,res)=>{

const input = (req.body.input || "").trim();

if(input===""){

return res.status(400).json({

success:false,

message:"No input provided."

});

}

const type = detectInputType(input);

let analysis = {

type,

title:"Verification Analysis",

summary:"FraudWatch analysed your submission and prepared educational guidance.",

recommendations:[]

};

switch(type){

case "email":

analysis.title="Email Address Analysis";

analysis.summary="The submitted value appears to be an email address.";

analysis.recommendations=[

"Verify the sender independently before responding.",

"Be cautious of unexpected attachments and links.",

"Never send passwords, banking PINs, recovery phrases, or one-time verification codes (OTPs).",

"An email address alone cannot confirm a person's identity or location."

];

break;

case "website":

analysis.title="Website & Domain Analysis";

analysis.summary="The submitted value appears to be a website or domain.";

analysis.recommendations=[

"Check that the website address is spelled correctly.",

"Look for HTTPS and verify the organisation independently.",

"Be cautious of unrealistic offers or pressure to act quickly.",

"Review contact information and company details before making payments."

];

break;

case "phone":

analysis.title="Phone Number Analysis";

analysis.summary="The submitted value appears to be a phone number.";

analysis.recommendations=[

"Be cautious of unexpected calls requesting money or sensitive information.",

"Never share passwords or one-time verification codes (OTPs).",

"If you are unsure, hang up and call the organisation using its official number."

];

break;

case "ip":

analysis.title="IP Address Analysis";

analysis.summary="The submitted value appears to be an IP address.";

analysis.recommendations=[

"An IP address may indicate a network location but does not reliably identify a specific person.",

"VPNs and mobile networks can affect apparent location.",

"Future versions of FraudWatch will support enhanced IP lookups using trusted services."

];

break;

case "username":

analysis.title="Username Analysis";

analysis.summary="The submitted value appears to be a username.";

analysis.recommendations=[

"Check whether the account is linked from an official website.",

"Be cautious of impersonation attempts.",

"Do not send money without independently confirming who you are communicating with."

];

break;

default:

analysis.title="General Verification";

analysis.summary="FraudWatch could not determine the exact type of information submitted.";

analysis.recommendations=[

"Verify information through trusted, independent sources.",

"Be cautious of urgent requests for money or personal information.",

"If something feels suspicious, pause before taking action."

];

}

res.json({

success: true,

input,

analysis

});

});

app.use((req, res) => {

res.status(404).json({

success: false,

message: "Endpoint not found."

});

});

app.listen(PORT, () => {

console.log(`🛡 FraudWatch API running on port ${PORT}`);

});
