window.addEventListener('beforeunload', function (event) {
    const confirmationMessage = 'Session Not Saved, You Sure To Leave?'
    (event || window.event).returnValue = confirmationMessage
    return confirmationMessage
})