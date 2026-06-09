const router = require("express").Router();

const {
  commitRound,
  startRound,
  revealRound,
  getRound,
  verifyRound,
  listRounds,
} = require("../controllers/round.controller");

router.post("/commit", commitRound);

router.get("/", listRounds);

router.post("/:id/start", startRound);

router.post("/:id/reveal", revealRound);

router.get("/verify", verifyRound);

router.get("/:id", getRound);

module.exports = router;
