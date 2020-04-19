export function getStructures() {
    return JSON.parse(localStorage.getItem('structures')) || []
}

export function saveStructures(structures = []) {
    localStorage.setItem('structures', JSON.stringify(structures))
}
