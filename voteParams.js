const { getRandomSignedInt, computeVoteHashAncillary } = require("@uma/common");
const fs = require("fs");

// User input variables
let roundId, identifier, ancillaryData, price, time;

function voteParams() {
  // networks file (https://github.com/UMAprotocol/protocol/blob/master/packages/core/networks/1.json)
  let votingContract = "0x8B1631ab830d11531aE83725fDa4D86012eCCd77";

  // safe address (should not need to be changed)
  let safe = "0xC75aDbf2a5a6A51302c1c7cC789366ed16e1E0F3";

  // Set votes array based on user input
  let votes = [
    {
      identifier,
      ancillaryData,
      price,
      time,
    },
  ];

  // helpers (no need to edit)
  let magicNumber = "-57896044618658097711785492504343953926634992332820282019728792003956564819968";
  let salt = 0;

  while (true) {
    let generatedNumber = getRandomSignedInt();
    if (
      generatedNumber < Math.abs(magicNumber) &&
      generatedNumber > magicNumber
    ) {
      salt = generatedNumber;
      break;
    }
  }

  let commits = [];
  let reveals = [];
  let rewards = [];

  if (salt > Math.abs(magicNumber) || salt < magicNumber) {
    console.log("Salt is above or below magic number");
    return;
  }
  votes.map((price) => {
    const hash = computeVoteHashAncillary({
      price: price.price,
      salt: salt,
      account: safe,
      time: price.time,
      ancillaryData: price.ancillaryData,
      roundId: roundId,
      identifier: price.identifier,
    });

    commits.push(`
        {
          "to": "${votingContract}",
          "value": "0",
          "data": null,
          "contractMethod": {
            "inputs": [
              {
                "internalType": "bytes32",
                "name": "identifier",
                "type": "bytes32"
              },
              {
                "internalType": "uint256",
                "name": "time",
                "type": "uint256"
              },
              {
                "internalType": "bytes",
                "name": "ancillaryData",
                "type": "bytes"
              },
              {
                "internalType": "bytes32",
                "name": "hash",
                "type": "bytes32"
              }
            ],
            "name": "commitVote",
            "payable": false
          },
          "contractInputsValues": {
            "identifier": "${price.identifier}",
            "time": "${price.time}",
            "ancillaryData": "${price.ancillaryData}",
            "hash": "${hash}"
        }
      }`);

  reveals.push(`
      {
        "to": "${votingContract}",
        "value": "0",
        "data": null,
        "contractMethod": {
          "inputs": [
            {
              "internalType": "bytes32",
              "name": "identifier",
              "type": "bytes32"
            },
            {
              "internalType": "uint256",
              "name": "price",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "salt",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "time",
              "type": "uint256"
            },
            {
              "internalType": "bytes",
              "name": "ancillaryData",
              "type": "bytes"
            }
          ],
          "name": "revealVote",
          "payable": false
        },
        "contractInputsValues": {
          "identifier": "${price.identifier}",
          "price": "${price.price}",
          "salt": "${salt}",
          "time": "${price.time}",
          "ancillaryData": "${price.ancillaryData}"
        }
      }`);

  rewards.push(`
      {
        "to": "${votingContract}",
        "value": "0",
        "data": null,
        "contractMethod": {
          "inputs": [
            {
              "internalType": "bytes32",
              "name": "identifier",
              "type": "bytes32"
            }
          ],
          "name": "collectReward",
          "payable": false
        },
        "contractInputsValues": {
          "identifier": "${price.identifier}"
        }
      }`);
});

fs.writeFileSync(
  "./transactions/commits.json",
  JSON.stringify(commits, null, 2)
);
fs.writeFileSync(
  "./transactions/reveals.json",
  JSON.stringify(reveals, null, 2)
);
fs.writeFileSync(
  "./transactions/rewards.json",
  JSON.stringify(rewards, null, 2)
);
}

voteParams();