let calculator = Vue.createApp({
    name: "Calculators",
    data() {
        return {
            loading: false,
            loanAmount: "100",
            currencyListsA: [],
            currencyLists: [],
            interest: "0.25",
            selectedCoinsPrice: "",
            collateral: null,
            visible: false,
            visibleOne: false,
            selectedCoinsA: null,
            selectedCoins: null,
            month: "6",
            monthlyInterest: "0.08",
            totalInterest: "",
            errorMsg: "",
            errorClass: "",
            moderateRisk: false,
            moderateRiskCoins: ["ada", "bnb", "omg", "xlm", "xtz", "zrx"],
            lowRisk: false,
            lowRiskCoins: [
                "bch",
                "btc",
                "dash",
                "eos",
                "eth",
                "gusd",
                "ltc",
                "mcdai",
                "pax",
                "paxg",
                "tusd",
                "usdc",
                "usdt",
                "wbtc",
                "wbgld",
                "xaut",
            ],
            highRisk: false,
            highRiskCoins: [
                "1inch",
                "aave",
                "avax",
                "bat",
                "bsv",
                "btg",
                "busd",
                "cel",
                "comp",
                "doge",
                "dot",
                "knc",
                "link",
                "lpt",
                "luna",
                "mana",
                "matic",
                "sga",
                "sgr",
                "snx",
                "sol",
                "sushi",
                "taud",
                "tcad",
                "tgp",
                "thkd",
                "uma",
                "uni",
                "xrp",
                "zec",
            ],
            timer: 0,
            number: {
                prefix: "$ ",
                numeral: true,
                numeralThousandsGroupStyle: "thousand",
                numeralPositiveOnly: true,
                noImmediatePrefix: true,
                rawValueTrimPrefix: true,
                numeralDecimalMark: ".",
                numeralDecimalScale: 2,
            },
        };
    },
    created() {
        this.fetchCoinA();
        this.fetchCoin();
        let gun = Math.ceil(Math.round(this.loanAmount / this.interest));
        this.collateral = (gun / this.selectedCoinsPrice).toFixed(4);

        // Interest Calculations*******
        this.monthlyInterest = ((this.loanAmount * (1 / 100) * 1) / 12).toFixed(2);
        this.totalInterest = this.roundFloat(this.month * this.monthlyInterest, 1).toFixed(2);
        console.log("not works");
    },
    methods: {
        roundFloat(num, decimalPlaces) {
            let p = Math.pow(10, decimalPlaces);
            let e = Number.EPSILON * num * p;
            return Math.round(num * p + e) / p;
        },
        away() {
            this.visible = false;
            this.visibleOne = false;
        },
        async fetchCoinA() {
            this.loading = true;
            let ids = "binance-usd,true-usd,usd,usd-coin,tether";
            // let cors_api_url = "https://cors.eu.org/";

            let url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}`;
            fetch(url)
                .then((res) => res.json())
                .then((data) => {
                    this.currencyListsA = data;
                    let usd = {
                        id: "usd",
                        symbol: "USD",
                        image: "//www.freeiconspng.com/uploads/dollar-black-circle-icon-28.png",
                        current_price: "1.00137539",
                    };
                    this.currencyListsA.push(usd);
                    this.selectedCoinsA = data[1];
                    this.currencyListsA.sort(function (a, b) {
                        var textA = a.symbol.toUpperCase();
                        var textB = b.symbol.toUpperCase();
                        return textA < textB ? -1 : textA > textB ? 1 : 0;
                    });
                    this.loading = false;
                })
                .catch((err) => {
                    alert("You sent too many request!");
                });
        },
        async fetchCoin() {
            this.loading = true;
            let ids = [
                "1inch",
                "aave",
                "cardano",
                "avalanche-2",
                "basic-attention-token",
                "bitcoin-cash",
                "binancecoin",
                "bitcoin",
                "bitcoin-gold",
                "binance-usd",
                // "COMP",
                "dash",
                "dogecoin",
                "polkadot",
                "eos",
                "ethereum",
                "kyber-network-crystal",
                "chainlink",
                "livepeer",
                "litecoin",
                "terra-luna",
                "decentraland",
                "matic-network",
                "omisego",
                "pax-gold",
                "havven",
                "solana",
                "sushi",
                "true-usd",
                "uma",
                "uniswap",
                "usd-coin",
                "tether",
                "wrapped-bitcoin",
                "stellar",
                "ripple",
                "tezos",
                "zcash",
                "0x",
            ];
            // let cors_api_url = "https://cors.eu.org/";
            let url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}&per_page=500`;
            fetch(url)
                .then((res) => res.json())
                .then((data) => {
                    this.currencyLists = data;
                    this.currencyLists.sort(function (a, b) {
                        var textA = a.symbol.toUpperCase();
                        var textB = b.symbol.toUpperCase();
                        return textA < textB ? -1 : textA > textB ? 1 : 0;
                    });
                    this.selectedCoins = data[7];
                    this.selectedCoinsPrice = data[7].current_price;

                    this.loading = false;
                })
                .catch((err) => {
                    alert("You sent too many request!");
                });
        },

        collateralCalFromLoan(e) {
            let gun = Math.floor(Math.round(this.loanAmount / this.interest));
            this.collateral = (gun / Number(this.selectedCoinsPrice).toFixed(2)).toFixed(4);
            (1 / 12 / 100) * 100;
        },
        collateralCal(e) {
            let gun = Math.floor(Math.round(this.loanAmount / this.interest));
            this.collateral = (gun / Number(this.selectedCoinsPrice).toFixed(2)).toFixed(4);
            (1 / 12 / 100) * 100;
        },
        collateralCalInter(e) {
            let interest = e.target.getAttribute("data-rate");
            this.monthlyInterest = ((interest / 12 / 100) * this.loanAmount).toFixed(2);
            this.totalInterest = Math.ceil(this.monthlyInterest * this.month).toFixed(2);
        },
        selectionValue(item) {
            this.selectedCoins = item;
            this.selectedCoinsPrice = item.current_price;
        },
        selectionValueOne(item) {
            this.selectedCoinsA = {...item};
            if (this.selectedCoinsA.symbol === "USD" && this.loanAmount < 1000) {
                this.errorMsg = "USD minimum: $1000";
                this.errorClass = "input-error";
            } else if (this.loanAmount < 100) {
                this.errorMsg = "Stablecoin minimum: $100.00";
                this.errorClass = "input-error";
            } else {
                this.errorMsg = "";
                this.errorClass = "";
            }
        },
        loanAmountCal() {
            this.loanAmount = Math.floor(
                Math.round(this.collateral * this.interest * this.selectedCoinsPrice).toFixed(4)
            );
        },
        totalInterestCal() {
            if (this.month == 6) {
                this.totalInterest = this.roundFloat(this.month * this.monthlyInterest, 1).toFixed(2);
            } else {
                this.totalInterest = Math.ceil(this.month * this.monthlyInterest).toFixed(2);
            }
        },
        toggleSelected() {
            this.visible = !this.visible;
        },
        toggleSelectedOne() {
            this.visibleOne = !this.visibleOne;
        },
        separateAtThousands(num) {
            var numArray = [],
                numStr = String(num);
            while (num >= 1000) {
                numArray.unshift(Math.round((num / 1000 - Math.floor(num / 1000)) * 1000));
                while (String(numArray[0]).length < 3) {
                    numArray[0] = "0" + numArray[0];
                }
                num = Math.floor(num / 1000);
            }
            numArray.unshift(num);
            return numArray.join(",");
        },
    },
    watch: {
        selectedCoinsPrice(newAmount) {
            let gun = Math.ceil(this.loanAmount / this.interest);
            this.collateral = (gun / Number(newAmount).toFixed(2)).toFixed(4);
        },
        loanAmount(newValue) {
            this.monthlyInterest = ((newValue * (1 / 100) * 1) / 12).toFixed(2);
            this.totalInterest = this.roundFloat(this.month * this.monthlyInterest, 1).toFixed(2);
            if (newValue < 100 && this.selectedCoinsA.symbol !== "USD") {
                this.errorMsg = "Stablecoin minimum: $100.00";
                this.errorClass = "input-error";
            } else if (this.selectedCoinsA.symbol === "USD" && newValue < 1000) {
                this.errorMsg = "USD minimum: $1000";
                this.errorClass = "input-error";
            } else {
                this.errorMsg = "";
                this.errorClass = "";
            }
        },
        selectedCoins(newValue) {
            let moderateRisk = this.moderateRiskCoins.some((item) => {
                return newValue.symbol.toLowerCase() == item;
            });
            moderateRisk ? (this.moderateRisk = true) : (this.moderateRisk = false);
            let lowRisk = this.lowRiskCoins.some((item) => {
                return newValue.symbol.toLowerCase() == item;
            });
            lowRisk ? (this.lowRisk = true) : (this.lowRisk = false);

            let highRisk = this.highRiskCoins.some((item) => {
                return newValue.symbol.toLowerCase() == item;
            });
            highRisk ? (this.highRisk = true) : (this.highRisk = false);
        },
    },
});

calculator.mount("#app");
calculator.use(VueCleave);
