import { Fetcher, ChainId, WETH, Route, Trade } from "@uniswap/sdk"
import ethers from "ethers"
import Web3 from "web3"
import {
  WEB3_WSS_URL,
  RPC_URL,
  PRIVATE_KEY,
  EXCHANGER_ADDRESS,
  ETH_AMOUNT,
  TOKEN_ADDRESS,
  SLIPPAGE_TOLERANCE,
} from "./environments"

const privateKey = new Buffer.from(PRIVATE_KEY, "hex")
const Provider = new ethers.providers.getDefaultProvider(RPC_URL)
const Signer = new ethers.Wallet(privateKey, Provider)
const Weth = WETH[ChainId.MAINNET]
const EthAmount = ethers.utils.parseEther(ETH_AMOUNT)
const Token = await Fetcher.fetchTokenData(
  ChainId.MAINNET,
  TOKEN_ADDRESS,
  Provider
)
const pair = await Fetcher.fetchPairData(Token, Weth, Provider)
const route = new Route([pair], Weth)

export const Web3 = new Web3(WEB3_WSS_URL)
export const Uniswap = new ethers.Contract(
  EXCHANGER_ADDRESS,
  [
    "function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts)",
    "function swapExactTokensForETH(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)",
  ],
  Signer
)
const trade = new Trade(
  route,
  new TokenAmount(Weth, EthAmount),
  TradeType.EXACT_INPUT
)
export const path = [Weth.address, Token.address]
const amountOutMin = trade.minimumAmountOut(SLIPPAGE_TOLERANCE).raw
export const amountOutMinHex = ethers.BigNumber.from(
  amountOutMin.toString()
).toHexString()

// 20 Min
const deadline = Math.floor(Date.now() / 1000) + 60 * 20
export const deadlineHex = ethers.BigNumber.from(
  deadline.toString()
).toHexString()

const inputAmount = trade.inputAmount.raw
export const inputAmountHex = ethers.BigNumber.from(
  inputAmount.toString()
).toHexString()
