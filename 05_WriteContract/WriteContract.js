// 声明只可写合约的规则：
// const contract = new ethers.Contract(address, abi, signer);
// 参数分别为合约地址`address`，合约ABI `abi`，Signer变量`signer`

import { ethers } from "ethers";
// playcode免费版不能安装ethers，用这条命令，需要从网络上import包（把上面这行注释掉）
// import { ethers } from "https://cdn-cors.ethers.io/lib/ethers-5.6.9.esm.min.js";

const ALCHEMY_GOERLI_URL =
  "https://eth-sepolia.g.alchemy.com/v2/OqrhDyEGmnOqi2v76o7h9";
const provider = new ethers.JsonRpcProvider(ALCHEMY_GOERLI_URL);

// 利用私钥和provider创建wallet对象
const privateKey =
  "0xa45ef72aab690a9fbb0d02b91432adc255713d75e34013533b8e14b2d8b90bd1";
const wallet = new ethers.Wallet(privateKey, provider);
console.log("\n1. 利用私钥和provider创建wallet对象");
console.log(wallet);

// WETH的ABI
const abiWETH = [
  "function balanceOf(address) public view returns(uint)",
  "function deposit() public payable",
  "function transfer(address, uint) public returns (bool)",
  "function withdraw(uint) public",
];
// // WETH合约地址（Goerli测试网）
// const addressWETH = "0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6";
// 修改后（Sepolia 地址）--- 直接去 sepolia.etherscan.io 网站 搜索 WETH
const addressWETH = "0xf531B8F309Be94191af87605CfBf600D71C2cFe0";
// WETH Contract

// 声明可写合约
const contractWETH = new ethers.Contract(addressWETH, abiWETH, wallet);
// 也可以声明一个只读合约，再用connect(wallet)函数转换成可写合约。
// const contractWETH = new ethers.Contract(addressWETH, abiWETH, provider)
// contractWETH.connect(wallet)

const main = async () => {
  const address = await wallet.getAddress();
  console.log("\n2. 利用wallet对象获取地址");
  console.log(address);
  // 1. 读取WETH合约的链上信息（WETH abi）
  console.log("\n1. 读取WETH余额");
  const balanceWETH = await contractWETH.balanceOf(address);
  console.log(`存款前WETH持仓: ${ethers.formatEther(balanceWETH)}\n`);
  //读取钱包内ETH余额
  const balanceETH = await provider.getBalance(wallet);

  // 如果钱包ETH足够
  if (ethers.formatEther(balanceETH) > 0.0015) {
    // 2. 调用deposit()函数，将0.001 ETH转为WETH
    console.log("\n2. 调用deposit()函数，存入0.001 ETH");
    // 发起交易
    const tx = await contractWETH.deposit({
      value: ethers.parseEther("0.001"),
    });
    // 等待交易上链
    await tx.wait();
    console.log(`交易详情：`);
    console.log(tx);
    const balanceWETH_deposit = await contractWETH.balanceOf(address);
    console.log(`存款后WETH持仓: ${ethers.formatEther(balanceWETH_deposit)}\n`);

    // 3. 调用transfer()函数，将0.001 WETH转账给 vitalik
    console.log("\n3. 调用transfer()函数，给vitalik转账0.001 WETH");
    // 发起交易
    const tx2 = await contractWETH.transfer(
      "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
      ethers.parseEther("0.001")
    );
    // 等待交易上链
    await tx2.wait();
    const balanceWETH_transfer = await contractWETH.balanceOf(address);
    console.log(
      `转账后WETH持仓: ${ethers.formatEther(balanceWETH_transfer)}\n`
    );
  } else {
    // 如果ETH不足
    console.log("ETH不足，去水龙头领一些Goerli ETH");
    console.log("1. chainlink水龙头: https://faucets.chain.link/goerli");
    console.log("2. paradigm水龙头: https://faucet.paradigm.xyz/");
  }
};

main();
