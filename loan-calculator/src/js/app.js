let calculator = Vue.createApp({
    name: "Calculators",
    data() {
        return {
            loading: false,
            loanAmount: "100.00",
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
                "shib",
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
    async mounted() {
        await this.fetchCoinA();
        await this.fetchCoin();
        let gun = Math.ceil(Math.round(this.loanAmount / this.interest));
        this.collateral = (gun / this.selectedCoinsPrice).toFixed(4);

        // Interest Calculations*******
        this.monthlyInterest = ((this.loanAmount * (1 / 100) * 1) / 12).toFixed(2);
        this.totalInterest = this.roundFloat(this.month * this.monthlyInterest, 1).toFixed(2);

        let numInput = document.querySelector(".total-loan span");

        numInput.textContent = numInput.innerHTML.slice(0, 3);
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
            let ids = "BUSD,TUSD,USD,USDC,USDT";
            let cors_api_url = "https://cors-anywhere.herokuapp.com/";
            let url = `https://api.nomics.com/v1/currencies/ticker?key=bd203c06a2629074324aa986b5922a46473ac557&ids=${ids}&interval=1d`;
            await fetch(cors_api_url + url)
                .then((res) => res.json())
                .then((data) => {
                    this.currencyListsA = data;
                    let usd = {
                        id: "USD",
                        currency: "USD",
                        logo_url: "//www.freeiconspng.com/uploads/dollar-black-circle-icon-28.png",
                        price: "1.00137539",
                    };
                    this.currencyListsA.push(usd);
                    this.currencyListsA.sort(function (a, b) {
                        var textA = a.currency.toUpperCase();
                        var textB = b.currency.toUpperCase();
                        return textA < textB ? -1 : textA > textB ? 1 : 0;
                    });
                    this.loading = false;
                    this.selectedCoinsA = {...data[1]};
                });
        },
        async fetchCoin() {
            this.loading = true;
            let ids = [
                "1INCH",
                "AAVE",
                "ADA",
                "AVAX",
                "BAT",
                "BCH",
                "BNB",
                "BTC",
                "BTG",
                "BUSD",
                "COMP",
                "DASH",
                "DOGE",
                "DOT",
                "EOS",
                "ETH",
                "KNC",
                "LINK",
                "LPT",
                "LTC",
                "LUNA",
                "MANA",
                "MATIC",
                "OMG",
                "PAXG",
                "SHIB",
                "SNX",
                "SOL",
                "SUSHI",
                "TUSD",
                "UMA",
                "UNI",
                "USD",
                "USDC",
                "USDT",
                "WBTC",
                "XLM",
                "XRP",
                "XTZ",
                "ZEC",
                "ZRX",
            ];
            let cors_api_url = "https://cors-anywhere.herokuapp.com/";
            let url = `https://api.nomics.com/v1/currencies/ticker?key=bd203c06a2629074324aa986b5922a46473ac557&ids=${ids}&interval=1d`;
            await fetch(cors_api_url + url)
                .then((res) => res.json())
                .then((data) => {
                    this.currencyLists = data;
                    this.loading = false;
                    this.currencyLists.sort(function (a, b) {
                        var textA = a.currency.toUpperCase();
                        var textB = b.currency.toUpperCase();
                        return textA < textB ? -1 : textA > textB ? 1 : 0;
                    });
                    this.selectedCoins = {...data[7]};
                    this.selectedCoinsPrice = data[7].price;
                });
        },

        collateralCal(e) {
            let gun = Math.floor(Math.round(this.loanAmount / this.interest));
            this.collateral = (gun / Number(this.selectedCoinsPrice).toFixed(2)).toFixed(4);
            // clearTimeout(this.timer);
            // this.timer = setTimeout(() => {
            //     if (e.target.value.indexOf(".") === -1 && e.target.value.length > 2) {
            //         e.target.value = e.target.value + ".00";
            //         console.log(e.target);
            //     }
            // }, 1000);
        },
        selectionValue(item) {
            this.selectedCoins = {...item};
            this.selectedCoinsPrice = item.price;
        },
        selectionValueOne(item) {
            this.selectedCoinsA = {...item};
            if (this.selectedCoinsA.currency === "USD" && this.loanAmount < 1000) {
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
            if (newValue < 100 && this.selectedCoinsA.currency !== "USD") {
                this.errorMsg = "Stablecoin minimum: $100.00";
                this.errorClass = "input-error";
            } else if (this.selectedCoinsA.currency === "USD" && newValue < 1000) {
                this.errorMsg = "USD minimum: $1000";
                this.errorClass = "input-error";
            } else {
                this.errorMsg = "";
                this.errorClass = "";
            }
        },
        selectedCoins(newValue) {
            let moderateRisk = this.moderateRiskCoins.some((item) => {
                return newValue.currency.toLowerCase() == item;
            });
            moderateRisk ? (this.moderateRisk = true) : (this.moderateRisk = false);
            let lowRisk = this.lowRiskCoins.some((item) => {
                return newValue.currency.toLowerCase() == item;
            });
            lowRisk ? (this.lowRisk = true) : (this.lowRisk = false);

            let highRisk = this.highRiskCoins.some((item) => {
                return newValue.currency.toLowerCase() == item;
            });
            highRisk ? (this.highRisk = true) : (this.highRisk = false);
        },
    },
});

calculator.mount("#app");
calculator.use(VueCleave);
