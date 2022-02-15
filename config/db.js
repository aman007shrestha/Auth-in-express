const mongoose = require('mongoose');

const connectDb = async () => {
  const con = await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: true,
  });
  console.log(`MongoDB connected ${con.connection.host}`);
};

module.exports = connectDb;
