const functions = require("firebase-functions");
const admin = require('firebase-admin')
const express = require('express')
const cors = require('cors')

const app = express()
admin.initializeApp({
    credential: admin.credential.cert('./permissions.json'),
    databaseURL: "https://the-vegan-community-api.firebaseio.com"
})

app.use(cors({ origin: true }))




const db = admin.firestore();

app.post("/api/productos", async (req, res) => {
    try{
        await db.collection("productos")
        .doc("/" + req.body.codebar + "/")
        .create({
            nombre: req.body.nombre,
            usuario: 'users/4aB4znfuPzZB37BrKNkc',
            precio: req.body.precio,
            vegano: req.body.vegano,
            foto_ingredientes: '',
            foto_principal: '',
            fecha_publicacion: Date.now(),
            valoracion: 1,
            veces_visto: 1
        })
        return res.status(205).json();
    } catch (error) {
        return res.status(500).send(error);
    }
})

app.get("/api/productos", async (req, res) => {
    try{
        const doc =  db.collection("productos")
        const querySnapshot = await doc.get();
        const docs = querySnapshot.docs
        const response = docs.map((doc) => ({
            codebar: doc.id,
            nombre: doc.data().nombre,
            usuario: doc.data().usuario,
            precio: doc.data().precio,
            vegano: doc.data().vegano,
            foto_ingredientes: doc.data().foto_ingredientes,
            foto_principal: doc.data().foto_principal,
            fecha_publicacion: doc.data().fecha_publicacion,
            valoracion: doc.data().valoracion,
            veces_visto: doc.data().veces_visto
        }))
        return res.status(200).json(response);
    } catch (error) {
        console.log(error)
        return res.status(500).send(error);
    }
})

exports.app = functions.https.onRequest(app);
