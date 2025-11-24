// 检索事件的方法：
// const transferEvents = await contract.queryFilter("事件名", [起始区块高度，结束区块高度])
// 其中起始区块高度和结束区块高度为选填参数。

import { ethers } from "ethers";

const ALCHEMY_GOERLI_URL =
  "https://eth-sepolia.g.alchemy.com/v2/OqrhDyEGmnOqi2v76o7h9";
const provider = new ethers.JsonRpcProvider(ALCHEMY_GOERLI_URL);

// WETH ABI，只包含我们关心的Transfer事件
const abiWETH = [
  "event Transfer(address indexed from, address indexed to, uint amount)",
];

// 测试网WETH地址
const addressWETH = "0xf531B8F309Be94191af87605CfBf600D71C2cFe0";
// 声明合约实例
const contract = new ethers.Contract(addressWETH, abiWETH, provider);

const main = async () => {
  // 获取过去10个区块内的Transfer事件
  console.log("\n1. 获取过去10个区块内的Transfer事件，并打印出1个");
  // 得到当前block
  const block = await provider.getBlockNumber();
  console.log(`当前区块高度: ${block}`);

  // 目前此合约使用不频繁，导致严重落后区块高度，暂时直接固定为最近一次交易对应的块高度
  const contractBLock = 9688346;
  console.log(`打印事件详情:`);
  const transferEvents = await contract.queryFilter(
    "Transfer",
    contractBLock,
    contractBLock
  );
  // 打印第1个Transfer事件
  //   console.log(transferEvents);
  console.log(transferEvents[0]);

  // 解析Transfer事件的数据（变量在args中）
  console.log("\n2. 解析事件：");
  const amount = ethers.formatUnits(
    ethers.getBigInt(transferEvents[0].args["amount"]),
    "ether"
  );
  console.log(
    `地址 ${transferEvents[0].args["from"]} 转账${amount} WETH 到地址 ${transferEvents[0].args["to"]}`
  );
};

main();
