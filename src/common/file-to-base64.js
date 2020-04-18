export function fileToBase64(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()

        // When read send result to base64toBlob.
        reader.onload = (e) => resolve(e.target.result)
        reader.onerror = reject

        // Read the target as DataURL.
        reader.readAsDataURL(blob)
    })
}
