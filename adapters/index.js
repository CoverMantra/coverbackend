const ZypeAdapter = require("./ZypeAdapter");
const MoneyviewAdapter = require("./MoneyviewAdapter");
const VivifiAdapter = require("./VivifiAdapter");
const FatakpayPlAdapter = require("./FatakpayPlAdapter");
const FatakpayDclAdapter = require("./FatakpayDclAdapter");

module.exports = {
  zype: new ZypeAdapter(),
  moneyview: new MoneyviewAdapter(),
  vivifi: new VivifiAdapter(),
  fatakPay: new FatakpayPlAdapter(),
  fatakPaydcl: new FatakpayDclAdapter()
};
