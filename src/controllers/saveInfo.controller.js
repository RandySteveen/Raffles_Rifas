const Raffles = require('../models/raffles.js')
const { handleCombinedUpload , setCustomFileName} = require('../utils/image-setup.js')
const fs = require('fs')
const path = require('path')

const controller = {}

// ----- Save Raffle -----
controller.regRaffle = async (req, res) => {
  try {
    const raffle = { id_boss, name_raffle, description_raffle, awards, img_awards, special_awards, special_img, cant_tickets, price_tickets, state_raffle, sector_raffle, sellers_raffle, date_created, end_date, special_date } = req.body
    
    const filterRaffle = Object.keys(req.body)

    if (filterRaffle.length > 0) {
      let verify = await Raffles.verifyRaffle(name_raffle)

      if(verify.code == 200){
        const processReg = await Raffles.regRaffle(raffle)        
        console.log(processReg)
        return res.status(200).json(processReg)        
      }else{
        return res.status(400).json(verify)
      }

    } else {
      res.status(400).json({ message: "No raffles provided in the request", status: false, code: 400 })
    }

  } catch (error) {
    res.status(500).json({ error: "Error al realizar la consulta" })
    console.log(error)
  }
}

// ----- Edit Raffle -----
controller.editRaffle = async (req, res) => {
  try {
    const raffle = { id_raffle, name_raffle, description_raffle, awards, img_awards, special_awards, special_img, cant_tickets, price_tickets, state_raffle, sector_raffle, sellers_raffle, date_created, end_date, special_date } = req.body
    
    userRaffle = await Raffles.editRaffle(raffle)    
    res.status(userRaffle.code).json(userRaffle)
  
  } catch (error) {
    res.status(500).json({ error: "Error al realizar la consulta" })
  }
}

// ----- Delete Raffle -----
controller.deleteRaffle = async (req, res) => {
  try {
    const data = {id_raffle , activation_status } = req.params

    userRaffle = await Raffles.deleteRaffle(data)
    res.status(userRaffle.code).json(userRaffle)
  
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "Error al realizar la consulta" })
  }
}

module.exports = controller
