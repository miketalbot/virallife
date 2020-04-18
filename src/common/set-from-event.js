export function setFromEvent(fn, after = null) {
    return (event) => {
        fn(event?.target?.value)
        after && after(event)
    }
}
