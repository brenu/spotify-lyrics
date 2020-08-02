/**
 * --------------------------------
 *   Arquivo Base
 * --------------------------------
 *  Aqui é onde chamamos o app e
 *  definimos a porta na qual ele
 *  deve escutar :)
 */

const path = require("path");
require("dotenv").config();

const app = require("./app");

app.listen(process.env.PORT || 3333);
