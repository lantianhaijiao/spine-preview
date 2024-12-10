/*
 * @Author: haobin.wang
 * @Date: 2024-04-25 11:22:42
 * @LastEditors: haobin.wang
 * @LastEditTime: 2024-04-25 17:21:39
 * @Description: Do not edit
 */
export const getEncourage = () => {
  const encourageList = [
    "你真棒!",
    "你可真🐂🍺",
    "帅气风发的你",
    "你还敢再来一次吗？",
    "你今天有点奇怪......有点可爱",
    "你知道可爱的别称是什么吗？你的名字。",
    "还没到迪士尼就见到公主了",
    "把你自拍发来，我要换手机屏保了。",
    "世事如书，我偏爱你这一句",
    "有什么不懂的你尽管吻我",
  ];
  return encourageList[Math.floor(Math.random() * encourageList.length)]; 
};