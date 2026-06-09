const { createCommit } = require("../services/fairness.service");
const { generateRound, MULTIPLIERS, ROWS } = require("../services/engine.service");
const { sha256 } = require("../utils/hash");
const prisma = require("../config/prisma");

const commitRound = async (req, res) => {
  try {
    const { serverSeed, nonce, commitHex } = createCommit();
    const round = await prisma.round.create({
      data: { status: "CREATED", serverSeed, nonce, commitHex },
    });

    res.status(201).json({
      roundId: round.id,
      nonce,
      commitHex,
    });
  } catch (error) {
     console.error("COMMIT ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};



const startRound = async (req, res) => {
  try {
    const { id } = req.params;
    const { clientSeed, betCents, dropColumn } = req.body;
    const numericBetCents = Number(betCents);
    const numericDropColumn = Number(dropColumn);

    if (!clientSeed || typeof clientSeed !== "string") {
      return res.status(400).json({ message: "clientSeed is required" });
    }

    if (!Number.isInteger(numericBetCents) || numericBetCents <= 0) {
      return res.status(400).json({ message: "betCents must be a positive integer" });
    }

    if (!Number.isInteger(numericDropColumn) || numericDropColumn < 0 || numericDropColumn > ROWS) {
      return res.status(400).json({ message: `dropColumn must be an integer from 0 to ${ROWS}` });
    }

    const round = await prisma.round.findUnique({ where: { id } });

    if (!round) {
      return res.status(404).json({ message: "Round not found" });
    }

    if (round.status !== "CREATED") {
      return res.status(409).json({ message: "Round has already been started" });
    }

    const combinedSeed = sha256(`${round.serverSeed}:${clientSeed}:${round.nonce}`);
    const result = generateRound(combinedSeed, numericDropColumn);
    const payoutMultiplier = MULTIPLIERS[result.binIndex];
    const payoutCents = Math.floor(numericBetCents * payoutMultiplier);

    const updatedRound = await prisma.round.update({
      where: { id },
      data: {
        status: "STARTED",
        clientSeed,
        combinedSeed,
        pegMapHash: result.pegMapHash,
        rows: ROWS,
        dropColumn: numericDropColumn,
        binIndex: result.binIndex,
        payoutMultiplier,
        payoutCents,
        betCents: numericBetCents,
        pathJson: result.path,
      },
    });

    res.json({
      roundId: updatedRound.id,
      rows: ROWS,
      pegMapHash: result.pegMapHash,
      binIndex: result.binIndex,
      payoutMultiplier,
      payoutCents,
      path: result.path,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const revealRound = async (req, res) => {
  try {
    const { id } = req.params;
    const round = await prisma.round.findUnique({ where: { id } });

    if (!round) {
      return res.status(404).json({ message: "Round not found" });
    }

    await prisma.round.update({
      where: { id },
      data: { status: "REVEALED", revealedAt: new Date() },
    });

    res.json({
      serverSeed: round.serverSeed,
      nonce: round.nonce,
      clientSeed: round.clientSeed,
      commitHex: round.commitHex,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getRound = async (req, res) => {
  try {
    const round = await prisma.round.findUnique({ where: { id: req.params.id } });

    if (!round) {
      return res.status(404).json({ message: "Round not found" });
    }

    res.json(round);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const listRounds = async (req, res) => {
  try {
    const take = Math.min(Number(req.query.take) || 10, 50);
    const rounds = await prisma.round.findMany({
      take,
      orderBy: { createdAt: "desc" },
    });

    res.json(rounds);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



const verifyRound = async (req, res) => {
  //  console.log("QUERY:", req.query);
  try {
    const { serverSeed, clientSeed, nonce, dropColumn } = req.query;

    if (!serverSeed || !clientSeed || !nonce) {
      return res.status(400).json({
        message: "serverSeed, clientSeed, and nonce are required",
      });
    }

    const commitHex = sha256(`${serverSeed}:${nonce}`);
    const combinedSeed = sha256(
      `${serverSeed}:${clientSeed}:${nonce}`
    );

    const result = generateRound(
      combinedSeed,
      Number(dropColumn)
    );

    const payoutMultiplier =
      MULTIPLIERS[result.binIndex];

    res.json({
      commitHex,
      combinedSeed,
      pegMapHash: result.pegMapHash,
      binIndex: result.binIndex,
      payoutMultiplier,
      path: result.path,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  commitRound,
  startRound,
  revealRound,
  getRound,
  verifyRound,
  listRounds,
};