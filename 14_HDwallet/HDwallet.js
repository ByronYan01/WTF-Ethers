import { ethers } from "ethers";

/**
 * HD钱包（分层确定性钱包）
 * 核心用途：从单个助记词派生出无限数量的子钱包
 * Metamask 实现：
 * 创建时生成 24个单词的助记词（主种子）
 * 使用 BIP44 标准路径：m/44'/60'/0'/0/0
 * 每点击"创建账户"生成新地址 = 路径索引递增 (/0/1, /0/2等)
 * 优势：
 * 只需备份一次助记词，管理无限账户
 * 资产隔离（交易账户、储蓄账户等）
 * 支持跨设备同步（通过助记词恢复所有账户
 *
 *
 * 主钱包：用HD钱包管理日常账户（对应Metamask默认账户）
 * 子钱包：
 * 账户1：日常交易
 * 账户2：DeFi协议交互
 * 账户3：NFT收藏
 * 独立钱包：导入交易所提币地址等特殊账户
 */

// 1. 创建HD钱包 (ethers V6)
console.log("\n1. 创建HD钱包");
// 生成随机助记词 -- 主私钥 m 的种子
const mnemonic = ethers.Mnemonic.entropyToPhrase(ethers.randomBytes(32));
// 创建HD基钱包
// 基路径："m / purpose' / coin_type' / account' / change"
/**
 * m: 固定为"m"  ---  钱包树的根节点；通常省略不写；助记词通过 BIP39 转化的主私钥 m，不暴露给用户，加密存储
 * purpose：固定为"44"
 * coin_type：代币类型，比特币主网为0，比特币测试网为1，以太坊主网为60
 * account：账户索引，从0开始。
 * change：是否为外部链，0为外部链，1为内部链，一般填0.
 * address_index：地址索引，从0开始，想生成新地址就把这里改为1，2，3。
 */
const basePath = "44'/60'/0'/0";
// HD 钱包 = 基钱包 + 派生路径 有完整派生路径
const baseWallet = ethers.HDNodeWallet.fromPhrase(mnemonic, basePath);
console.log(baseWallet);

// 2. 通过HD钱包派生20个子钱包
console.log("\n2. 通过HD钱包派生20个子钱包");
const numWallet = 20;
// 派生路径：基路径 + "/ address_index"
// 我们只需要提供最后一位address_index的字符串格式，就可以从baseWallet派生出新钱包。V6中不需要重复提供基路径！
let wallets = [];
for (let i = 0; i < numWallet; i++) {
  let baseWalletNew = baseWallet.derivePath(i.toString());
  console.log(`第${i + 1}个钱包地址： ${baseWalletNew.address}`);
  wallets.push(baseWalletNew);
}

// 3. 保存钱包（加密json）
console.log("\n3. 保存钱包（加密json）");
// 这个是 主私钥 m，实际不能这么使用
const wallet = ethers.Wallet.fromPhrase(mnemonic);
console.log("通过助记词创建钱包：");
console.log(wallet);
// 加密json用的密码，可以更改成别的
const pwd = "password";
const json = await wallet.encrypt(pwd);
console.log("钱包的加密json：");
console.log(json);

// 4. 从加密json读取钱包
const wallet2 = await ethers.Wallet.fromEncryptedJson(json, pwd);
console.log("\n4. 从加密json读取钱包：");
console.log(wallet2);
