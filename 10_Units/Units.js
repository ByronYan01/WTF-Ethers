import { ethers } from "ethers";

// 以太坊中，许多计算都对超出JavaScript整数的安全值（js中最大安全整数为9007199254740991）
//因此，ethers.js使用 JavaScript ES2020 版本原生的 BigInt 类 安全地对任何数量级的数字进行数学运算

// 1. BigNumber
console.group("\n1. BigNumber类");

const oneGwei = ethers.getBigInt("1000000000"); // 从十进制字符串生成
console.log(oneGwei);
console.log(ethers.getBigInt("0x3b9aca00")); // 从hex字符串生成
console.log(ethers.getBigInt(1000000000)); // 从数字生成
// 不能从js最大的安全整数之外的数字生成BigNumber，下面代码会报错
// ethers.getBigInt(Number.MAX_SAFE_INTEGER);
console.log("js中最大安全整数：", Number.MAX_SAFE_INTEGER);

// 运算
// 注意：数值带后缀n会自动转换成BigInt
console.log("加法：", oneGwei + 1n);
console.log("减法：", oneGwei - 1n);
console.log("乘法：", oneGwei * 2n);
console.log("除法：", oneGwei / 2n);
// 比较
console.log("是否相等：", oneGwei == 1000000000n);

/**
 * 在以太坊中，1 ether等于10^18 wei
 * wei 0
 * kwei 3
 * mwei 6
 * gwei 9
 * szabo 12
 * finney 15
 * ether 18
 *
 * 用户可读单位：ether
 * gas 价格可读单位：gwei
 * 机器可读单位：wei
 */

// 2. 格式化：小单位转大单位
// 例如将wei转换为ether：formatUnits(变量, 单位)：单位填位数（数字）或指定的单位（字符串）
console.group("\n2. 格式化：小单位转大单位，formatUnits");
console.log(ethers.formatUnits(oneGwei, 0));
// '1000000000'
console.log(ethers.formatUnits(oneGwei, "gwei"));
// '1.0'
console.log(ethers.formatUnits(oneGwei, 9));
// '1.0'
console.log(ethers.formatUnits(oneGwei, "ether"));
// `0.000000001`
console.log(ethers.formatUnits(1000000000, "gwei"));
// '1.0'
console.log(ethers.formatEther(oneGwei));
// `0.000000001` 等同于formatUnits(value, "ether")
console.groupEnd();

// 3. 解析：大单位转小单位（返回 BigNumber 对象，最终都是转化为 wei）
// 例如将ether转换为wei：parseUnits(变量, 单位),parseUnits默认单位是 ether
console.group("\n3. 解析：大单位转小单位，parseUnits");
console.log(ethers.parseUnits("1.0").toString());
// { BigNumber: "1000000000000000000" }
console.log(ethers.parseUnits("1.0", "ether").toString());
// { BigNumber: "1000000000000000000" }
console.log(ethers.parseUnits("1.0", 18).toString());
// { BigNumber: "1000000000000000000" }
console.log(ethers.parseUnits("1.0", "gwei").toString());
// { BigNumber: "1000000000" }
console.log(ethers.parseUnits("1.0", 9).toString());
// { BigNumber: "1000000000" }
console.log(ethers.parseEther("1.0").toString());
// { BigNumber: "1000000000000000000" } 等同于parseUnits(value, "ether")
console.groupEnd();
