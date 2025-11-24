// 导入ethers包
import { ethers, AlchemyProvider } from "ethers";

// 利用ethers默认的Provider连接以太坊网络
// const provider = new ethers.getDefaultProvider();
// const ALCHEMY_MAINNET_URL = 'https://eth-mainnet.g.alchemy.com/v2/oKmOQKbneVkxgHZfibs-iFhIlIAl6HDN';
// const provider = new ethers.JsonRpcProvider(ALCHEMY_MAINNET_URL)

// 网络名称、api key
// const provider = new AlchemyProvider("mainnet", "OqrhDyEGmnOqi2v76o7h9");

// ENS服务仅在以太坊主网可用，测试网不支持
// 如果一定要用测试网，下面执行 getBalance 时，需要传入地址
const provider = new AlchemyProvider("sepolia", "OqrhDyEGmnOqi2v76o7h9");

const main = async () => {
  // 查询vitalik的ETH余额
  //   const balance = await provider.getBalance(`vitalik.eth`);
  const balance = await provider.getBalance(
    `0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045`
  );
  // 将余额输出在console
  console.log(`ETH Balance of vitalik: ${ethers.formatEther(balance)} ETH`);
};
main();
