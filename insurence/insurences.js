const { default: axios } = require("axios");
const express = require("express")
const router = express.Router();
const vehicleinsurence = require("./vehicleinsurence.js");
const lifeinsurence = require("./lifeinsurence.js");


router.post("/veichle/:type",async (req,res)=>{

    const type = req.params.type;
    const fields = vehicleinsurence[type];
    const body = req.body ||{};
        if(!fields){
            return res.status(400).json({"message":"Invalid type"})
        }
        const missing = fields.filter(field => !body[field] || body[field].toString().trim() === "");

  if (missing.length > 0) {
    return res.status(400).json({
      error: "Missing required fields",
      missing
    });
  }
//   console.log(body);

  res.json({ message: `${type} insurance registered successfully ✅` ,body});

})


router.post("/life-insurence/:type",async (req,res)=>{

      const type = req.params.type;
    const fields = lifeinsurence[type];
    const body = req.body ||{};
        if(!fields){
            return res.status(400).json({"message":"Invalid type"})
        }
        const missing = fields.filter(field => !body[field] || body[field].toString().trim() === "");

  if (missing.length > 0) {
    return res.status(400).json({
      error: "Missing required fields",
      missing
    });
  }

  res.json({ message: `${type} insurance registered successfully ✅` });

})

router.post("/travel-insurence",async (req,res)=>{

})
router.post("/home-insurence",async (req,res)=>{

})
router.post("/health-insurence",async (req,res)=>{
  
})



module.exports= router;