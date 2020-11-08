const mongoose = require("mongoose");
//Conexion a la base de datos
mongoose
  .connect(process.env.MONGODB_URI, {
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })

  .then(() => console.log("Database connected"))
  .catch((error) => console.log(error));
