let express = require("express");
let app = express();
app.use(express.json());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE, HEAD"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );

  next();
});

var port = process.env.PORT || 2410
app.listen(port, () => console.log(`Node app Listening on port ${port}!`));

const { Client } = require("pg");
const client = new Client({
  user: "postgres",
  password: "Ashish7071122145@",
  database: "postgres",
  port: 5432,
  host: "db.lfccweznrefslsqkxxic.supabase.co",
  ssl: { rejectUnauthorized: false },
});

client.connect(function (res, error) {
  console.log("Connected!!!");
});

// function insertMobiles() {
//     let { mobiles } = require("./mobilesData.js");
//     let values = mobiles.map((m) => [m.name, m.price, m.brand, m.RAM, m.ROM, m.OS]);
//     let query = `INSERT INTO mobiles (name, price, brand, RAM, ROM, OS) VALUES ${values.map((_, i) => `($${i * 6 + 1}, $${i * 6 + 2}, $${i * 6 + 3}, $${i * 6 + 4}, $${i * 6 + 5}, $${i * 6 + 6})`).join(", ")}`;
//     let flattenedValues = [].concat(...values); // Flatten the array of arrays
//     client.query(query, flattenedValues, function (err, result) {
//         if (err) console.log(err);
//         else console.log("Successfully Inserted ", result.rowCount);
//     });
// }

// insertMobiles();

app.get("/mobiles", function (req, res, next) {
  let brand = req.query.brand;
  let ram = req.query.ram;
  let rom = req.query.rom;
  let os = req.query.os;
  let sortBy = req.query.sortBy;
  console.log(brand);
  let query = "SELECT * FROM mobiles WHERE 1=1 ";

  if (brand) {
    const brandList = brand.split(',').map(brand => `'${brand}'`).join(',');
    query += `AND brand IN (${brandList})`;
  }
  if (ram) {
    const ramList = ram.split(',').map(ram => `'${ram}'`).join(',');
    query += `AND ram IN (${ramList})`;
  }
  if (rom) {
    const romList = rom.split(',').map(rom => `'${rom}'`).join(',');
    query += `AND rom IN (${romList})`;
  }
  if (os) {
    const osList = os.split(',').map(os => `'${os}'`).join(',');
    query += `AND os IN (${osList})`;
  }

  if (sortBy) {
    query += ` ORDER BY ${sortBy} ASC`;
  }

  client.query(query, function (err, result) {
    if (err) {
      res.status(404).send(err);
    } else {
      res.send(result.rows);
    }
  });
});




app.get("/mobiles/:id", function (req, res, next) {
  let id = +req.params.id;
  let query = ` SELECT * FROM mobiles WHERE id = ${id} `;
  client.query(query, function (err, result) {
    if (err) res.status(404).send(err);
    else res.send(result.rows);
  });
});

app.get("/mobiles/brand/:brand", function (req, res, next) {
  let brand = req.params.brand;
  let query = ` SELECT * FROM mobiles WHERE brand = '${brand}'  `;
  client.query(query, function (err, result) {
    if (err) res.status(404).send(err);
    else res.send(result.rows);
  });
});
app.get("/mobiles/RAM/:ram", function (req, res, next) {
  let ram = req.params.ram;
  let query = ` SELECT * FROM mobiles WHERE ram = '${ram}'  `;
  client.query(query, function (err, result) {
    if (err) res.status(404).send(err);
    else res.send(result.rows);
  });
});
app.get("/mobiles/ROM/:rom", function (req, res, next) {
  let rom = req.params.rom;
  let query = ` SELECT * FROM mobiles WHERE rom = '${rom}'  `;
  client.query(query, function (err, result) {
    if (err) res.status(404).send(err);
    else res.send(result.rows);
  });
});
app.get("/mobiles/OS/:os", function (req, res, next) {
  let os = req.params.os;
  let query = ` SELECT * FROM mobiles WHERE os = '${os}'  `;
  client.query(query, function (err, result) {
    if (err) res.status(404).send(err);
    else res.send(result.rows);
  });
});


app.post("/mobiles", function (req, res, next) {
  var values = Object.values(req.body);
  console.log(values);
  let query = ` INSERT INTO mobiles(name, price, brand,ram, rom,os) VALUES ($1,$2,$3,$4,$5,$6) `;
  client.query(query, values, function (err, result) {
    if (err) res.status(404).send(err.message);
    else res.send(` ${result.rowCount} Insertion Succesfull`);
  });
});

app.put("/mobiles/:id", function (req, res, next) {
  let id = +req.params.id;
  let upMob = req.body;

  const query = `
          UPDATE mobiles 
          SET name = $1, price = $2, brand = $3, ram = $4, rom = $5 , os = $6
          WHERE id = $7
      `;

  const values = [
    upMob.name,
    upMob.price,
    upMob.brand,
    upMob.ram,
    upMob.rom,
    upMob.os,
    id,
  ];

  client.query(query, values, function (err, result) {
    if (err) {
      res.status(404).send(err.message);
    } else {
      res.send(`Updated mobile with id ${id}`);
    }
  });
});


app.delete("/mobiles/:id", function (req, res, next) {
  let id = +req.params.id;
  let query = ` DELETE FROM mobiles WHERE id = '${id}' `;
  client.query(query, function (err, result) {
    if (err) res.status(404).send(err);
    else res.send(`Deleted mobile with id ${id}`)
  })

})