const express           = require('express')
const app               = express()
const _var              = require('./global/_var.js')
const cors              = require('cors')
const bodyParser        = require("body-parser")

// Url-Routes
const raffles           = require('./routes/raffles.routes.js')

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors())

// Configura el middleware body-parser con límites más altos
app.use(bodyParser.json({ limit: "500mb" }));  // Ajusta el límite según tus necesidades
app.use(bodyParser.urlencoded({ limit: "500mb", extended: true }));  // Ajusta el límite según tus necesidades


// Server
app.listen(_var.PORT, (err) => {
    if(err) throw err
	console.log(`Server running on http://localhost:${_var.PORT}`)
})

// Routes
app.use(raffles)
