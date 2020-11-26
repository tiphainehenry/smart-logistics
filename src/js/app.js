App = {
    web3Provider: null,
    contracts: {},

    init: async function () {
        // Load resources.
        $.getJSON('../resources.json', function (data) {
            var resourcesRow = $('#resourcesRow');
            var resourceTemplate = $('#resourceTemplate');

            for (i = 0; i < data.length; i++) {
                resourceTemplate.find('.panel-title').text(data[i].name);
                resourceTemplate.find('img').attr('src', data[i].picture);
                resourceTemplate.find('.resource-breed').text(data[i].breed);
                resourceTemplate.find('.resource-age').text(data[i].age);
                resourceTemplate.find('.resource-location').text(data[i].location);
                resourceTemplate.find('.btn-adopt').attr('data-id', data[i].id);

                resourcesRow.append(resourceTemplate.html());
            }
        });

        return await App.initWeb3();
    },

    initWeb3: async function () {
        // Modern dapp browsers...
        if (window.ethereum) {
            App.web3Provider = window.ethereum;
            try {
                // Request account access
                await window.ethereum.enable();
            } catch (error) {
                // User denied account access...
                console.error("User denied account access")
            }
        }
        // Legacy dapp browsers...
        else if (window.web3) {
            App.web3Provider = window.web3.currentProvider;
        }
        // If no injected web3 instance is detected, fall back to Ganache
        else {
            App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
        }
        web3 = new Web3(App.web3Provider);

        return App.initContract();
    },

    initContract: function () {

        $.getJSON('Hiring.json', function (data) {
            // Get the necessary contract artifact file and instantiate it with @truffle/contract
            var HiringArtifact = data;
            App.contracts.Hiring = TruffleContract(HiringArtifact);

            // Set the provider for our contract
            App.contracts.Hiring.setProvider(App.web3Provider);

            // Use our contract to retrieve and mark the hired resources
            return App.markHired();
        });


        return App.bindEvents();
    },

    bindEvents: function () {
        $(document).on('click', '.btn-adopt', App.handleHire);
    },

    markHired: function () {
        var hiringInstance;

        App.contracts.Hiring.deployed().then(function (instance) {
            hiringInstance = instance;

            return hiringInstance.getEmployers.call();
        }).then(function (employers) {
            for (i = 0; i < employers.length; i++) {
                if (employers[i] !== '0x0000000000000000000000000000000000000000') {
                    $('.panel-resource').eq(i).find('button').text('Success').attr('disabled', true);
                }
            }
        }).catch(function (err) {
            console.log(err.message);
        });

    },

    handleHire: function (event) {
        event.preventDefault();

        var resourceId = parseInt($(event.target).data('id'));
        var hiringInstance;

        web3.eth.getAccounts(function (error, accounts) {
            if (error) {
                console.log(error);
            }

            var account = accounts[0];

            App.contracts.Hiring.deployed().then(function (instance) {
                hiringInstance = instance;

                // Execute adopt as a transaction by sending account
                return hiringInstance.hire(resourceId, {from: account});
            }).then(function (result) {
                return App.markHired();
            }).catch(function (err) {
                console.log(err.message);
            });
        });

    }

};

$(function () {
    $(window).load(function () {
        App.init();
    });
});
