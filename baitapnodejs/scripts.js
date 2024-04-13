function clickbtn() {
    fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        }, body: JSON.stringify({
            username: document.getElementById('username').value,
            password: document.getElementById('password').value
        })
    })
        .then(function (data) {
            return data.json()
        }).then(function (data) {
            if (data.success) {
                console.log(data);
                alert("ok")
            } else {
                alert("!ok")
            }
        })
        .catch((err) => {
            alert("okn't")
        }).finally(() => {

        })
}