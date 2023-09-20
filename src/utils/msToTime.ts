export const msToTime = (ms: number): string => {
    let h,m,s;
h = Math.floor(ms/1000/60/60);
m = Math.floor((ms/1000/60/60 - h)*60);
s = Math.floor(((ms/1000/60/60 - h)*60 - m)*60);

s < 10 ? s = `0${s}`: s = `${s}`
m < 10 ? m = `0${m}`: m = `${m}`
h < 10 ? h = `0${h}`: h = `${h}`

const result = `${h}h ${m}m ${s}s`
console.log(result)

return result
}