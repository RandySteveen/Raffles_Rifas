require('dotenv').config()

/* ----------- SERVER ----------- */
const PORT                      = process.env.PORT

/* ----------- DATABASE ----------- */
const PG_HOST                   = process.env._HOST
const PG_USER                   = process.env._USER
const PG_PASS                   = process.env._PASS
const PG_NAME                   = process.env._NAME

/* ----------- ROUTES ----------- */

// Users
const GET_RAFFLE                = process.env.GET_RAFFLE
const DETAILED_RAFFLE           = process.env.DETAILED_RAFFLE
const SALES_RAFFLE              = process.env.SALES_RAFFLE
const REGISTER_RAFFLE           = process.env.REGISTER_RAFFLE
const EDIT_RAFFLE               = process.env.EDIT_RAFFLE
const DELETE_RAFFLE             = process.env.DELETE_RAFFLE
const RAFFLES_SELLERS           = process.env.RAFFLES_SELLERS

module.exports = {
	// Server
  PORT,
  // Database
  PG_HOST, PG_USER, PG_PASS, PG_NAME,
  // Sellers
  GET_RAFFLE, DETAILED_RAFFLE, SALES_RAFFLE, REGISTER_RAFFLE, EDIT_RAFFLE, DELETE_RAFFLE, RAFFLES_SELLERS
 }
