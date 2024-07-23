import asyncFn from '@/utils/asyncFn'


let pending = false
const callbacks = []

export default function (cb) {
    callbacks.push(cb)
    if (!pending) {
        pending = true
        asyncFn(execCallBacks)
    }
}

function execCallBacks() {
    callbacks.forEach((cb) => cb())
    callbacks.splice(0)
    pending = false
}