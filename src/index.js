import mongoose from "mongoose";
import Team from "./models/teamsModel";
import City from "./models/cityModel";
import fs from "fs";

mongoose.connect("mongodb://localhost:27017/fansclub", {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
});

mongoose.connection.on("connected", async () => {
  let logs = "";
  try {
    const count = await Team.countDocuments({}).exec();
    console.log(count);
    let nu = 1;

    (async function loop() {
      if (nu <= count - 2) {
        console.log(nu);
        const team = await Team.find()
          .limit(1)
          .skip(nu + 1)
          .exec();

        const city = await City.findOne({
          name: team[0].city,
        }).exec();

        if (!city) {
          logs += `${team[0]} \n`;
        }
        nu = nu + 1;
        loop();
      } else {
        fs.writeFile("./logs.txt", logs, (err) => {
          console.log(err);
        });
        console.log("completed");
      }
    })();
  } catch (error) {
    console.error(error);
  }
});
