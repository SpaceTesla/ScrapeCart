document.addEventListener("DOMContentLoaded", function () {
  document.querySelector("select").addEventListener("change", function () {
    if (this.value === "select") {
      document.querySelector("form button").disabled = true;
    }
  });
});

document.getElementById("search-form").addEventListener("submit", function (e) {
  e.preventDefault(); // prevent the default form submission

  let domain = document.getElementById("domain").value;
  let q = document.querySelector('input[name="q"]').value;
  q = q.replace(" ", "+"); // replace all spaces with "+"
  console.log(q);

  // construct the URL
  let url = "/" + domain + "/search" + "?q=" + q;

  // redirect to the URL
  window.location.href = url;
});
