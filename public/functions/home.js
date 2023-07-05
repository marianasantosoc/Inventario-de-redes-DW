function none_block() {
    var divs = document.querySelectorAll(".add-maq");
    for (let div of divs) {
        if (div.style.display == 'none') {
            div.style.display = 'block';
        }
        else {
            div.style.display = 'none';
        }
    }
}
