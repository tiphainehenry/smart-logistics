.. _installing:

Introduction
============

Installing the Dapp
~~~~~~~~~~~~~~~~~~~~

 Locally:

 ``npm install``

 Dependencies
 -  Python 2.7
 -  Solidity 0.5.16
 -  Node.js
 -  Truffle

Launching the platform
~~~~~~~~~~~~~~~~~~~~~~~


Launch local blockchain in terminal:

``ganache-cli -m "east enjoy keen nut hat debris blur trophy alone steak large federal"``
In a second terminal, migrate your smart contracts:

``truffle migrate``
In a third terminal, run the bridge to connect the blockchain to the outside world:

``npm run bridge``
Then, in a fourth terminal, launch the frontend:

``cd client && npm run start``
The webapp is accessible at http://localhost:30000.
