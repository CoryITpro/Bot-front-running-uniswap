require("dotenv").config()
const { Percent } = require("@uniswap/sdk")

export const AUTORUN = process.env.AUTORUN
export const SLIPPAGE = parseInt(process.env.SLIPPAGE)
export const SLIPPAGE_TOLERANCE = new Percent(SLIPPAGE, "100")
export const GAS_MULTIPLIER = parseFloat(process.env.GAS_MULTIPLIER)

export const TOKEN_ADDRESS = process.env.TOKEN_ADDRESS
export const ACCOUNT = process.env.ACCOUNT
export const EXCHANGER_ADDRESS = process.env.EXCHANGER_ADDRESS
export const ETH_AMOUNT = process.env.ETH_AMOUNT
export const ETH_AMOUNT_TARGET =
  parseInt(process.env.ETH_AMOUNT_TARGET) * 10 ** 18

export const WEB3_WSS_URL = process.env.RPC_WSS_URL
export const RPC_URL = process.env.RPC_URL

export const PRIVATE_KEY = process.env.PRIVATE_KEY
