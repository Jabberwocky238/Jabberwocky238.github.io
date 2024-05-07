// 校验颜色的命名
export const checkClrName = (clr: string) => {
    clr = clr.toLowerCase().trim();
    if (clr.startsWith('#') && clr.length !== 7) {
        return clr.slice(1);
    }
    if (!clr.startsWith('#') && clr.length === 6) {
        return `#${clr}`;
    }
    return clr
}