function createAccount(data) {
  fetch("/user/signup", {
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

function extractAccountData() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  return { username, password };
}

document.getElementById("createAccount").addEventListener("submit", (e) => {
  e.preventDefault();
  createAccount(extractAccountData());
});
