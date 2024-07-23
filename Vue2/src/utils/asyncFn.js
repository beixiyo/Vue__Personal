const asyncFn = (() => {
    let fn

    if (window.Promise) {
        fn = (task) => Promise.resolve().then(task)
    }
    else if (window.MutationObserver) {
        fn = (() => {
            let i = 0
            const el = document.createElement('p')
            const asyncFunc = (task) => {
                const ob = new MutationObserver(task)

                ob.observe(el, { childList: true })
                el.innerText = i++
            }

            return asyncFunc
        })()
    }
    else {
        fn = (task) => {
            setTimeout(() => task, 0)
        }
    }

    return fn
})()


export default asyncFn