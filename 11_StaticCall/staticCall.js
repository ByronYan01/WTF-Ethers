// contract.函数名.staticCall(参数, {override})
import { ethers } from "ethers";

const ALCHEMY_MAINNET_URL =
  "https://eth-mainnet.g.alchemy.com/v2/OqrhDyEGmnOqi2v76o7h9";
const provider = new ethers.JsonRpcProvider(ALCHEMY_MAINNET_URL);

// 利用私钥和provider创建wallet对象
const privateKey =
  "0xa45ef72aab690a9fbb0d02b91432adc255713d75e34013533b8e14b2d8b90bd1";
const wallet = new ethers.Wallet(privateKey, provider);

// DAI的ABI
const abiDAI = [
  "function balanceOf(address) public view returns(uint)",
  "function transfer(address, uint) public returns (bool)",
];
// DAI合约地址（主网）
const addressDAI = "0x6B175474E89094C44Da98b954EedeAC495271d0F"; // DAI Contract

// 创建DAI合约实例
const contractDAI = new ethers.Contract(addressDAI, abiDAI, provider);

const main = async () => {
  try {
    const address = await wallet.getAddress();
    // 1. 读取DAI合约的链上信息
    console.log("\n1. 读取测试钱包的DAI余额");
    const balanceDAI = await contractDAI.balanceOf(address);
    const balanceDAIVitalik = await contractDAI.balanceOf("vitalik.eth");

    console.log(`测试钱包 DAI持仓: ${ethers.formatEther(balanceDAI)}\n`);
    console.log(`vitalik DAI持仓: ${ethers.formatEther(balanceDAIVitalik)}\n`);

    // 2. 用staticCall尝试调用transfer转账1 DAI，msg.sender为Vitalik，交易将成功
    console.log(
      "\n2.  用staticCall尝试调用transfer转账1 DAI，msg.sender为Vitalik地址"
    );
    // 发起交易
    const tx = await contractDAI.transfer.staticCall(
      "vitalik.eth",
      ethers.parseEther("1"),
      { from: await provider.resolveName("vitalik.eth") }
    );
    console.log(`交易会成功吗？：`, tx);

    // 3. 用staticCall尝试调用transfer转账10000 DAI，msg.sender为测试钱包地址，交易将失败
    console.log(
      "\n3.  用staticCall尝试调用transfer转账1 DAI，msg.sender为测试钱包地址"
    );
    const tx2 = await contractDAI.transfer.staticCall(
      "vitalik.eth",
      ethers.parseEther("10000"),
      { from: address }
    );
    console.log(`交易会成功吗？：`, tx2);
  } catch (e) {
    console.log(e);
  }
};

main();
