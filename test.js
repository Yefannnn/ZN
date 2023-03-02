//  创建两个异步promise

let getAdata = new Promise((reslove, reject) => {
    setTimeout(() => {
        reject({
            isError: true
        })
    }, 1000);
})

let getBdata = new Promise((reslove, reject) => {
    setTimeout(() => {
        reslove([
            {
                name: 'yy',
                age: 18
            }
        ])
    }, 1500);
})

let data = Promise.allSettled([getAdata, getBdata])
console.log(data);

