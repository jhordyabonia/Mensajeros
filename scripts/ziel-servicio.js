function CloseDiv(divId) {
    document.getElementById(divId).style.display = 'none';
}
function OpenDiv(divId) {
    document.getElementById(divId).style.display = 'block';
}

function OpenMenu(IdMenu) {
    $(IdMenu).modal('show');
}