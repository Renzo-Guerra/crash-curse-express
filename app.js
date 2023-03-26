import express from 'express';
import dotenv from 'dotenv';
import {getNotas, getNota} from './database.js';

dotenv.config();

const app = express();

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index.ejs", {
    numberOfItterations: 50
  });
});

app.get("/tareas/:id", async(req, res) =>{
  let idEspecifico = req.params.id;
  try{
    // En caso de que id NO sea un numero, se tira un error
    if(isNaN(idEspecifico)){ throw new Error("El id debe ser un numero!");}
  }catch(error){
    console.log(error);
    res.status(400).send(error.message);
  }

  const tarea = await getNota(idEspecifico);
  if(!tarea){res.status(404).send("No existe tarea con dicho id!");}
  
  res.render("tarea.ejs", {
    tarea: tarea
  });
})

app.use(express.static("public"));

app.get("/tareas", async (req, res) => {
  const notas = await getNotas();
  res.render("tareas.ejs", {
    tareas: notas
  });
});

app.listen(process.env.MYSQL_PORT, () => {
  console.log(`Corriendo desde el puerto: ${process.env.MYSQL_PORT}`);
});