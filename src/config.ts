import BigNumber from 'bignumber.js';

export let HttpHost = "http://192.168.50.216:5000"
export let unit = new BigNumber(1e18);
export let zero = new BigNumber(0);
export let contractAddr = "0x72Ca1aafE8E8f84ABbFba3705c35F084eCd21989"
export let MethodTopics = {
    creat: "0xb8c8322ac4e6ae368af6cfc837a0906e4ee9a35f49ef8b747adcd46dfdac5859",
    joinBet: "0xadd33c52831a0b1c1f1f17c56aa20b5c040473e944e6f3475d38556c779df755",
    withdrawBet: "0x73eed075d58172e0b579e14129d5943b894bbc02470e758208ed3cf164b4e7a9"
}

export let MethodABI = {
    getMatch: {
        "constant": true,
        "inputs": [
            {
                "name": "_id",
                "type": "uint256"
            }
        ],
        "name": "getQuiz",
        "outputs": [
            {
                "name": "id",
                "type": "uint256"
            },
            {
                "name": "stage",
                "type": "uint8"
            },
            {
                "name": "startTime",
                "type": "uint256"
            },
            {
                "name": "gameName",
                "type": "string"
            },
            {
                "name": "leftName",
                "type": "string"
            },
            {
                "name": "leftBet",
                "type": "uint256"
            },
            {
                "name": "leftScore",
                "type": "uint256"
            },
            {
                "name": "rightName",
                "type": "string"
            },
            {
                "name": "rightBet",
                "type": "uint256"
            },
            {
                "name": "rightScore",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function",
        "signature": "0xa3f7e096"
    },
    bet: {
        "constant": false,
        "inputs": [
            {
                "name": "_id",
                "type": "uint256"
            },
            {
                "name": "combatant",
                "type": "uint256"
            }
        ],
        "name": "join",
        "outputs": [],
        "payable": true,
        "stateMutability": "payable",
        "type": "function",
        "signature": "0x79e66b46"
    },
    withdrawBet: {
        "constant": false,
        "inputs": [
            {
                "name": "_id",
                "type": "uint256"
            },
            {
                "name": "combatant",
                "type": "uint256"
            }
        ],
        "name": "repent",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function",
        "signature": "0x6ce52790"
    },
    withdrawBonus: {
        "constant": false,
        "inputs": [
            {
                "name": "_id",
                "type": "uint256"
            }
        ],
        "name": "withdraw",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function",
        "signature": "0x2e1a7d4d"
    },
    getBet: {
        "constant": true,
        "inputs": [
            {
                "name": "_id",
                "type": "uint256"
            },
            {
                "name": "combatant",
                "type": "uint256"
            }
        ],
        "name": "getPlayerCombatantBet",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function",
        "signature": "0x3a4164f1"
    },
    getBonus: {
        "constant": true,
        "inputs": [
            {
                "name": "_id",
                "type": "uint256"
            }
        ],
        "name": "getPlayerAward",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function",
        "signature": "0xff87bcc2"
    }
}
export let EventABI = {
    joinBet: {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "name": "_id",
                "type": "uint256"
            },
            {
                "indexed": true,
                "name": "player",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "combatant",
                "type": "uint256"
            },
            {
                "indexed": false,
                "name": "stakes",
                "type": "uint256"
            }
        ],
        "name": "_join",
        "type": "event",
        "signature": "0xadd33c52831a0b1c1f1f17c56aa20b5c040473e944e6f3475d38556c779df755"
    },
    withdrawBet: {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "name": "_id",
                "type": "uint256"
            },
            {
                "indexed": true,
                "name": "player",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "combatant",
                "type": "uint256"
            },
            {
                "indexed": false,
                "name": "stakes",
                "type": "uint256"
            }
        ],
        "name": "_repent",
        "type": "event",
        "signature": "0x73eed075d58172e0b579e14129d5943b894bbc02470e758208ed3cf164b4e7a9"
    }
}
