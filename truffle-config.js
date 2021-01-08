const path = require("path");
const HDWalletProvider = require('truffle-hdwallet-provider');
const fs = require('fs');

let secrets;

if (fs.existsSync('secrets.json')) {
  secrets = JSON.parse(fs.readFileSync('secrets.json', 'utf8'));
 }
 
module.exports = {
  contracts_build_directory: path.join(__dirname, "client/src/contracts"), 

  networks: {
    development: {
	    network_id:"*",
	    host:'localhost',
	    port: 8545
    },
    ropsten:{
      provider: new HDWalletProvider(secrets.mnemonic, "https://ropsten.infura.io/v3/"+secrets.infuraApiKey),
      network_id: '3' 
    }
  },
};
