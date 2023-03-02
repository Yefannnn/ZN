// 工具函数
/**
 * 
 * @param {*} params 时间
 * @returns Object { y,m,d,hh,mm,ss} 年 月 日 小时 分钟 秒
 */
export const formatterTime = (params) => {
    let date = new Date(params);
    let y = date.getFullYear()
    let m =
        date.getMonth() + 1 < 10
            ? "0" + (date.getMonth() + 1)
            : date.getMonth() + 1;
    let d = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    let hh =
        date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
    let mm =
        date.getMinutes() < 10
            ? "0" + date.getMinutes()
            : date.getMinutes();
    let ss =
        date.getMilliseconds() < 10
            ? "0" + date.getMilliseconds()
            : date.getMilliseconds();
    return {
        y,
        m,
        d,
        hh,
        mm,
        ss
    };
}