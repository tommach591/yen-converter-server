const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");

let rates = {};

router.get("/", (req, res) => {
  console.log(`Getting Currency Rates`);

  const storedData = rates;
  const todayUTC = new Date(
    Date.UTC(
      new Date().getUTCFullYear(),
      new Date().getUTCMonth(),
      new Date().getUTCDate(),
      0,
      0,
      0,
      0
    )
  );
  const targetDateUTC = storedData.time_next_update_utc
    ? new Date(storedData.time_next_update_utc)
    : new Date(
        Date.UTC(
          new Date().getUTCFullYear(),
          new Date().getUTCMonth(),
          new Date().getUTCDate(),
          0,
          0,
          0,
          0
        )
      );

  if (todayUTC < targetDateUTC) {
    /* Using last fetched data */
    console.log("Returning cached rates.");
    return res.json(rates);
  } else {
    /* Fetching new data */
    fetch(`https://open.er-api.com/v6/latest/JPY`)
      .then((result) => {
        result.json().then((data) => {
          console.log("Returning fetched rates.");
          rates = data;
          return res.json(rates);
        });
      })
      .catch((err) => {
        return res
          .status(404)
          .json({ userNotFound: "No user found in that region" });
      });
  }
});

module.exports = router;
