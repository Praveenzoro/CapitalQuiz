import express from "express";
import bodyParser from "body-parser";
import pg from "pg"


const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "World",
  password: "star",
  port: 5432
});

db.connect();

const app = express();
const port = 3000;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let quiz = [
    { country: "France", capital: "Paris" },
    { country: "United Kingdom", capital: "London" },
    { country: "United States of America", capital: "New York" },
];


  


db.query("SELECT * FROM capitals",(err,res)=>{
  if(err){
    console.error("Error executing query", err.stack);
  }
  else{
    quiz = res.rows;
  }
  db.end();

  
})

let currentques ={}
let score = 0;

app.get("/",async (req,res)=>{
  await nextQues();
  res.render("index.ejs",{
    Question: currentques,
    
  })

})

app.post("/submit",(req,res)=>{
  let ic = false;
  const answer = req.body.answer.trim();
    if(currentques.capital.toLowerCase().replace(/\s+/g, '') === answer.toLowerCase().replace(/\s+/g, '')){
        score ++ ;
        ic = true;
    }
    nextQues();
    res.render("index.ejs",{
      Question: currentques,
      scoring : score,
      correct : ic
    })
})


async function nextQues(){
    const ran = quiz[Math.floor(Math.random()* quiz.length)]
    currentques = ran;
    }


    app.listen(port,()=>{

      console.log(`server running in ${port}`)
  })