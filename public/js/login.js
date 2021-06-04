function login(data) {
  fetch("/user/login", {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  })
    .then((res) => res.json())
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
}

function extractLoginData() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  return { username, password };
}

document.getElementById("login").addEventListener("submit", (e) => {
  e.preventDefault();
  login(extractLoginData());
});
