const crypto = require("crypto");
const { sha256 } = require("../utils/hash");

const createCommit = () => {
  const serverSeed = crypto.randomBytes(32).toString("hex");
  const nonce = crypto.randomUUID();
  const commitHex = sha256(`${serverSeed}:${nonce}`);

  return {
    serverSeed,
    nonce,
    commitHex,
  };
};

module.exports = { createCommit };
