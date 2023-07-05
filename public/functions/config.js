function exibi(id) {
  var divs = document.querySelectorAll(".container");
  divs.forEach((div) => {
    div.style.display = 'none';
  });

  var display = document.getElementById(id).style.display;
  console.log(display)
  if (display == 'none') {
    document.getElementById(id).style.display = 'block';
  }
}