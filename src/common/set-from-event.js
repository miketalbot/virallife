export function setFromEvent(fn, after = null) {
    return (event) => {
        fn(event?.target?.value)
        after && after(event)
    }
}

export function bind(target, field, refresh) {
    return {
        value: target[field],
        onChange: refresh.planRefresh(setFromEvent((v) => (target[field] = v))),
    }
}
