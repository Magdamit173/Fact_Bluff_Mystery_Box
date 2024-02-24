window.addEventListener('beforeunload', function (event) {
    const confirmationMessage = 'Session Not Saved, You Sure To Leave?'
    (event || window.event).returnValue = confirmationMessage
    return confirmationMessage
})

function spliceAtFirstOccurrence(arr, value) {
    const index = arr.indexOf(value)

    if (index !== -1) {
        arr.splice(index, 1)
    }

    return arr
}
