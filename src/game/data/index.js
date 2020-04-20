export function getStructures() {
    return JSON.parse(localStorage.getItem('structures')) || []
}

export function saveStructures(structures = []) {
    localStorage.setItem('structures', JSON.stringify(structures))
}

export function getState() {
    return JSON.parse(localStorage.getItem('stats') || '{}')
}

export function setState(state) {
    localStorage.setItem('stats', JSON.stringify(state))
}
