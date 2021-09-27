import { ethers } from "ethers"
import { sleep } from "."
import {
  Web3,
  Uniswap,
  amountOutMinHex,
  deadlineHex,
  inputAmountHex,
  path,
} from "../configurations"
import { ACCOUNT, TOKEN_ADDRESS, AUTORUN } from "../configurations/environments"

let minABI = [
  // balanceOf
  {
    constant: true,
    inputs: [{ name: "_owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "balance", type: "uint256" }],
    type: "function",
  },
  // decimals
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", type: "uint8" }],
    type: "function",
  },
]

const sellTokens = async () => {
  const contract = new Web3.eth.Contract(minABI, TOKEN_ADDRESS)
  let balance = contract.methods
    .balanceOf(ACCOUNT)
    .call()
    .then((_balance) => {
      balance = _balance
    })

  const amountInHex = balance.toString(16)

  console.log("\x1b[41m%s\x1b[0m", "Selling Token...")
  const tx = await Uniswap.swapExactTokensForETH(
    amountInHex,
    amountOutMinHex,
    path,
    ACCOUNT,
    deadlineHex,
    {
      value: "0",
      gasPrice: ethers.BigNumber.from(gasPrice).toHexString(),
      gasLimit: ethers.BigNumber.from(gasLimit).toHexString(),
    }
  )
  console.log("\x1b[41m%s\x1b[0m", "Transaction Sent.")
  console.log("Sell Tx:", tx, "Tx Hash:", tx.hash)

  console.log("\x1b[1m%s\x1b[0m", "Waiting for sale confirmation...")
  let txReceiptance = null
  while (txReceiptance == null) {
    txReceiptance = await Web3.eth.getTransactionReceipt(tx.hash)
    await sleep(1000)
  }
  console.log("\x1b[42m%s\x1b[0m", "Sale Confirmed")

  if (AUTORUN == "true") {
    run()
  }
}

export const BuyTokens = async (txDetails) => {
  let gasPrice
  let gasLimit

  subscription.unsubscribe((error, success) => {
    if (success) {
      console.log("Ending Search In MEMPool...")
    }
  })

  console.log("\x1b[5m%s\x1b[0m", "Valid Transaction Found.")
  console.table([
    {
      "Tx Hash": txDetails.hash,
      Observations: "Valid Transaction",
      Timestamp: Date.now(),
    },
  ])

  gasPrice = Math.floor(txDetails.gasPrice * GAS_MULTIPLIER)
  gasLimit = Math.floor(txDetails.gas * 1)

  console.log("\x1b[42m%s\x1b[0m", "Buying Token...")
  const tx = await Uniswap.swapExactEthForTokens(
    amountOutMinHex,
    path,
    ACCOUNT,
    deadlineHex,
    {
      value: inputAmountHex,
      gasPrice: ethers.BigNumber.from(gasPrice).toHexString(),
      gasLimit: ethers.BigNumber.from(gasLimit).toHexString(),
    }
  )
  console.log("\x1b[42m%s\x1b[0m", "Transaction Sent.")
  console.log("Buying tx:", tx, "Tx Hash:", tx.hash)

  console.log("\x1b[1m%s\x1b[0m", "Waiting for Your Transaction to be Mined...")
  let txReceiptance = null
  while (txReceiptance === null) {
    txReceiptance = await Web3.eth.getTransactionReceipt(tx.hash)
    await sleep(1000)
  }
  console.log("\x1b[1m%s\x1b[0m", "Completed!")
  console.log(
    "\x1b[1m%s\x1b[0m",
    "Waiting for Original Transaction to be Mined Before Sale..."
  )

  txReceiptance = null
  while (txReceiptance === null) {
    txReceiptance = await Web3.eth.getTransactionReceipt(txDetails.hash)
    await sleep(1000)
  }
  console.log("\x1b[1m%s\x1b[0m", "Completed!")

  if (txReceiptance !== null) {
    sellTokens()
  }
}
