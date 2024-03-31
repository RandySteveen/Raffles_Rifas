const pool = require('../utils/mysql.connect.js') 

const bcrypt = require("bcrypt")

// ----- Verify Raffle -----
const verifyRaffle = async (name_raffle) => {
  try {
    let msg = {
      status: false,
      message: "Raffle not found",
      code: 404
    }

    const connection = await pool.getConnection()

    let sql = `SELECT id_raffle , name_raffle FROM raffles WHERE name_raffle = ? ;`
    let [rows] = await connection.execute(sql,[name_raffle])

    if (rows.length > 0) {
      msg = {
        status: false,
        message: "Raffle already exist",
        code: 400,
        info: rows[0].name_raffle
      }
    }else{
      msg = {
        status: true,
        message: "New raffle to register",
        code: 200,
        info: name_raffle
      }
    }

    connection.release()

    return msg
  } catch (err) {
    let msg = {
      status: false,
      message: "Something went wrong...",
      code: 500,
      error: err,
    }
    return msg
  }
}

// ----- Save Raffle -----
const regRaffle = async ({raffle}) => {
  try {    
    let msg = {
      status: false,
      message: "Raffle not Registered",
      code: 500
    }

    const connection = await pool.getConnection()

    let sql = `INSERT INTO raffles ( id_boss , name_raffle , description_raffle , awards , img_awards , special_awards , special_img , cant_tickets , tickets_sold , price_tickets , state_raffle , sector_raffle , sellers_raffle , date_created , end_date , special_date , activation_status ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? , ? , ?, ?, ?);`
    const [result] = await connection.execute(sql, [id_boss , name_raffle , description_raffle , awards , img_awards , special_awards , special_img , cant_tickets , [] , price_tickets , state_raffle , sector_raffle , sellers_raffle , date_created , end_date , special_date , 1]);  

    if (result.affectedRows > 0) {
      msg = {
        status: true,
        message: "Raffle successfully registered",
        code: 200,
        info: name_raffle
      }
    }

    connection.release()

    return msg

  } catch (err) {
    let msg = {
      status: false,
      message: "Something went wrong...",
      code: 500,
      error: err,
    }
    return msg
  }
}

// ----- Get Raffles -----
const getRaffle = async ({ data }) => {
  try {
    let msg = {
      status: false,
      message: "Raffles not found",
      code: 404
    }

    const connection = await pool.getConnection()

    let sql = `SELECT id_raffle , name_raffle , description_raffle , awards , img_awards , special_awards , special_img , cant_tickets , tickets_sold , tickets_sold , price_tickets , state_raffle , sector_raffle , sellers_raffle , date_created , end_date , special_date , activation_status FROM raffles WHERE id_boss = ? ;`
    let [raffle] = await connection.execute(sql,[id_boss])

    if (raffle.length > 0) {
      msg = {
        status: true,
        message: "Raffles found",
        data: raffle,
        code: 200
      }
    }

    connection.release()

    return msg
  } catch (err) {
    let msg = {
      status: false,
      message: "Something went wrong...",
      code: 500,
      error: err,
    }
    return msg
  }
}

// ----- Get Detailed Raffles -----
const getDetailedRaffle = async ({ data }) => {
  try {
    let msg = {
      status: false,
      message: "Raffles not found",
      code: 404
    }

    const connection = await pool.getConnection()

    let sql = `SELECT id_raffle , name_raffle , description_raffle , awards , img_awards , special_awards , special_img , cant_tickets , tickets_sold , tickets_sold , price_tickets , state_raffle , sector_raffle , sellers_raffle , date_created , end_date , special_date , activation_status FROM raffles WHERE id_raffle = ? ;`
    let [raffle] = await connection.execute(sql,[id_raffle])

    if (raffle.length > 0) {
      msg = {
        status: true,
        message: "Raffles found",
        data: raffle,
        code: 200
      }
    }

    connection.release()

    return msg
  } catch (err) {
    let msg = {
      status: false,
      message: "Something went wrong...",
      code: 500,
      error: err,
    }
    return msg
  }
}

// ----- Get Sales Raffles -----
const getSalesRaffle = async ({ data }) => {
  try {
    let msg = {
      status: false,
      message: "Sales not found",
      code: 404
    }

    const connection = await pool.getConnection()

    if(type_supervisor == "ADM"){
      // Obtener tickets supervisados por ti (ADM)
      let sqlAdmin = `
        SELECT raffles.id_raffle, raffles.name_raffle, raffles.price_tickets, 
        tickets.id_ticket ,tickets.tickets_sold , tickets.amount_paid , tickets.amount_total , tickets.status_ticket, tickets.date_created, 
        chiefs.id_boss AS id_supervisor, chiefs.fullname AS fullname_supervisor , tickets.type_supervisor AS type_supervisor,  
        clients.id_client, clients.fullname, clients.phone, clients.address, clients.state, clients.sector
        FROM tickets
        INNER JOIN chiefs ON tickets.id_supervisor = chiefs.id_boss
        INNER JOIN raffles ON tickets.id_raffle = raffles.id_raffle
        INNER JOIN clients ON tickets.id_client = clients.id_client
        WHERE tickets.id_supervisor = ? AND tickets.type_supervisor = 'ADM'
        AND tickets.status_ticket != 0
      `;
      let [ticketsAdmin] = await connection.execute(sqlAdmin, [id_supervisor]);

      // Obtener tickets supervisados por tus vendedores y excluir los tickets ya obtenidos en la primera consulta
      let sqlSeller = `
        SELECT raffles.id_raffle, raffles.name_raffle, raffles.price_tickets, 
        tickets.id_ticket ,tickets.tickets_sold , tickets.amount_paid , tickets.amount_total , tickets.status_ticket, tickets.date_created, 
        sellers.id_seller AS id_supervisor , sellers.fullname AS fullname_supervisor , tickets.type_supervisor AS type_supervisor,  
        clients.id_client, clients.fullname, clients.phone, clients.address, clients.state, clients.sector
        FROM tickets
        INNER JOIN sellers ON tickets.id_supervisor = sellers.id_seller
        INNER JOIN raffles ON tickets.id_raffle = raffles.id_raffle
        INNER JOIN clients ON tickets.id_client = clients.id_client
        WHERE sellers.id_boss = ? AND tickets.type_supervisor != 'ADM'
        AND tickets.status_ticket != 0
      `;
      let [ticketsSeller] = await connection.execute(sqlSeller, [id_supervisor]);

      // Concatenar resultados en un solo arreglo
      let allTickets = ticketsAdmin.concat(ticketsSeller);

      if (allTickets.length > 0) {
        msg = {
          status: true,
          message: "Tickets found",
          data: allTickets,
          code: 200
        };
      }

    }else if(type_supervisor == "VED"){
      // Obtener clientes creados por ti (VED)
      let sqlBOSS = `SELECT id_boss FROM sellers WHERE id_seller = ?;`
      let [idBoss] = await connection.execute(sqlBOSS, [id_supervisor])
      
      // Obtener tickets supervisados por ti (ADM)
      let sqlAdmin = `
        SELECT raffles.id_raffle, raffles.name_raffle, raffles.price_tickets, 
        tickets.id_ticket ,tickets.tickets_sold , tickets.amount_paid , tickets.amount_total , tickets.status_ticket, tickets.date_created, 
        chiefs.id_boss AS id_supervisor, chiefs.fullname AS fullname_supervisor , tickets.type_supervisor AS type_supervisor,  
        clients.id_client, clients.fullname, clients.phone, clients.address, clients.state, clients.sector
        FROM tickets
        INNER JOIN chiefs ON tickets.id_supervisor = chiefs.id_boss
        INNER JOIN raffles ON tickets.id_raffle = raffles.id_raffle
        INNER JOIN clients ON tickets.id_client = clients.id_client
        WHERE tickets.id_supervisor = ? AND tickets.type_supervisor = 'ADM'
        AND tickets.status_ticket != 0
      `;
      let [ticketsAdmin] = await connection.execute(sqlAdmin, [idBoss[0].id_boss]);

      // Obtener tickets supervisados por tus vendedores y excluir los tickets ya obtenidos en la primera consulta
      let sqlSeller = `
      SELECT raffles.id_raffle, raffles.name_raffle, raffles.price_tickets, 
      tickets.id_ticket ,tickets.tickets_sold , tickets.amount_paid , tickets.amount_total , tickets.status_ticket, tickets.date_created, 
      sellers.id_seller AS id_supervisor , sellers.fullname AS fullname_supervisor , tickets.type_supervisor AS type_supervisor,  
      clients.id_client, clients.fullname, clients.phone, clients.address, clients.state, clients.sector
      FROM tickets
      INNER JOIN sellers ON tickets.id_supervisor = sellers.id_seller
      INNER JOIN raffles ON tickets.id_raffle = raffles.id_raffle
      INNER JOIN clients ON tickets.id_client = clients.id_client
      WHERE sellers.id_seller = ? AND tickets.type_supervisor != 'ADM'
      AND tickets.status_ticket != 0
      `;
      let [ticketsSeller] = await connection.execute(sqlSeller, [id_supervisor]);
    

      // Concatenar resultados en un solo arreglo
      let allTickets = ticketsAdmin.concat(ticketsSeller);

      if (allTickets.length > 0) {
        msg = {
          status: true,
          message: "Tickets found",
          data: allTickets,
          code: 200
        };
      }
    }

    connection.release()

    return msg
  } catch (err) {
    let msg = {
      status: false,
      message: "Something went wrong...",
      code: 500,
      error: err,
    }
    return msg
  }
}

// ----- Get Sellers -----
const getRaffleSeller = async ({ data }) => {
  try {
    let msg = {
      status: false,
      message: "Raffles not found",
      code: 404
    }

    const connection = await pool.getConnection()

    let sql = `SELECT id_boss FROM sellers WHERE id_seller = ? ;`
    let [verify] = await connection.execute(sql,[id_seller])

    if(verify.length > 0) {
      let boss = verify[0].id_boss

      let sql = `SELECT id_raffle , name_raffle , description_raffle , awards , img_awards , special_awards , special_img , cant_tickets , tickets_sold , price_tickets , state_raffle , sector_raffle , sellers_raffle , date_created , end_date , special_date, activation_status FROM raffles WHERE id_boss = ? AND activation_status = 1;`
      let [raffle] = await connection.execute(sql,[boss])
  
      if (raffle.length > 0) {
        msg = {
          status: true,
          message: "Raffles found",
          data: raffle,
          code: 200
        }
      }
    }

    connection.release()

    return msg
  } catch (err) {
    let msg = {
      status: false,
      message: "Something went wrong...",
      code: 500,
      error: err,
    }
    return msg
  }
}

// ----- Edit Raffles -----
const editRaffle = async ({raffle}) => {
  try {
    let msg = {
      status: false,
      message: "Raffles not edited",
      code: 500
    }

    const connection = await pool.getConnection();

    let sql = 'SELECT id_raffle FROM raffles WHERE id_raffle = ?';
    let [verify] = await connection.execute(sql, [id_raffle]);

    if (verify.length > 0) {
      sql = 'UPDATE raffles SET name_raffle = ?, description_raffle = ?, awards = ?, img_awards = ?, special_awards = ?, special_img = ?, cant_tickets = ?, price_tickets = ?, state_raffle = ?, sector_raffle = ?, sellers_raffle = ?, date_created = ?, end_date = ?, special_date = ? WHERE id_raffle = ?';
      const [result] = await connection.execute(sql, [name_raffle, description_raffle, awards, img_awards, special_awards, special_img, cant_tickets, price_tickets, state_raffle, sector_raffle, sellers_raffle, date_created, end_date, special_date, id_raffle]);    

      if (result.affectedRows > 0) {
        msg = {
          status: true,
          message: "Raffle edited successfully",
          code: 200,
          info: name_raffle
        }
      } else {
        msg = {
          status: false,
          message: "Raffle not edited",
          code: 500,
          info: name_raffle
        }
      }
    } else {
      msg = {
        status: false,
        message: "Raffle not found",
        raffle: name_raffle
      }
    }

    connection.release();
    
    return msg;

  } catch (err) {
    console.log(err);
    const msg = {
      status: false,
      message: "Something went wrong...",
      code: 500,
      error: err,
    };
    return msg;
  }
};

// ----- Delete Seller -----
const deleteRaffle = async ({ data }) => {
  try {
    let msg = {
      status: false,
      message: "Raffle not deleted",
      code: 500
    }
    
    const connection = await pool.getConnection()
    
    let sql = `SELECT id_raffle FROM raffles WHERE id_raffle = ? ;`
    let [verify] = await connection.execute(sql,[id_raffle])

    if (verify.length > 0) {

      let updateSql = `UPDATE raffles SET activation_status = ? WHERE id_raffle = ?;`;
      const raffle =  await connection.execute(updateSql, [activation_status , id_raffle])

      if (raffle.length > 0 && activation_status == 1) {
        msg = {
          status: true,
          message: "Raffle Activated succesfully",
          code: 200
        }
      }else if (raffle.length > 0 && activation_status == 0) {
        msg = {
          status: true,
          message: "Raffle Disabled succesfully",
          code: 200
        }
      }
    }

    connection.release()

    return msg

  } catch (err) {
    console.log(err)
    let msg = {
      status: false,
      message: "Something went wrong...",
      code: 500,
      error: err,
    }
    return msg
  }
}

module.exports = {
  getRaffle,
  getDetailedRaffle,
  getSalesRaffle,
  getRaffleSeller,
  verifyRaffle,
  regRaffle,
  editRaffle,
  deleteRaffle
}
