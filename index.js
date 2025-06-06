const searchEl = document.getElementById("crypto-search")

document.getElementById("crypto-menu-close-btn").addEventListener("click", () => toggleHidden('crypto-menu'))
document.getElementById("crypto-search-btn").addEventListener("click", () => searchCrypto())
document.getElementById("set-crypto-btn").addEventListener("click", () => toggleHidden('crypto-menu'))

// if no pinned cryptocurrency saved to localstorage, 'dogecoin' is shown by default
const shownCrypto = localStorage.getItem("pinnedCrypto") ? localStorage.getItem("pinnedCrypto").toLowerCase() : "dogecoin" 

// toggles 'hidden' class
function toggleHidden(el) {
    document.getElementById(el).classList.toggle("hidden")
}

function searchCrypto() {
    document.getElementById("crypto-search-res").innerHTML = `
        <div id="crypto-search-top-res"></div>
    `
    fetch(`https://api.coingecko.com/api/v3/coins/${searchEl.value.toLowerCase()}`)
    .then(res => {
        if (!res.ok) {
            throw Error("Something went wrong")
        }
        return res.json()
    })
    .then(data => {
        document.getElementById("crypto-search-top-res").innerHTML = `
            <img src=${data.image.small} />
            <span>${data.name}</span>            
        `

        document.getElementById("crypto-search-res").innerHTML += `
            <p>🎯: $${data.market_data.current_price.usd}</p>
            <p>👆: $${data.market_data.high_24h.usd}</p>
            <p>👇: $${data.market_data.low_24h.usd}</p>
            <button id="crypto-thumbtrack-btn"><i class="fa fa-thumb-tack" aria-hidden="true"></i></button>
        `
        document.getElementById("crypto-thumbtrack-btn").addEventListener("click", () => thumbtrackCrypto(data))
    })
    .catch(err => console.error(err))
}

// setting up background
fetch("https://apis.scrimba.com/unsplash/photos/random?orientation=landscape&query=nature")
    .then(res => res.json())
    .then(data => {
        document.body.style.backgroundImage = `url(${data.urls.regular})`
		document.getElementById("author").textContent = `Image By: ${data.user.name}`
    })
    .catch(err => {
        // Use a default background image/author
        document.body.style.backgroundImage = `url(https://images.unsplash.com/photo-1560008511-11c63416e52d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyMTEwMjl8MHwxfHJhbmRvbXx8fHx8fHx8fDE2MjI4NDIxMTc&ixlib=rb-1.2.1&q=80&w=1080
        )`
		document.getElementById("author").textContent = `Image By: Dodi Achmad`
    })

// setting up cryptocurrency info
fetch(`https://api.coingecko.com/api/v3/coins/${shownCrypto}`)
    .then(res => {
        if (!res.ok) {
            throw Error("Something went wrong")
        }
        return res.json()
    })
    .then(data => thumbtrackCrypto(data))
    .catch(err => console.error(err))

// pins crypto info on top left corner
function thumbtrackCrypto(data) {
    document.getElementById("crypto-top").innerHTML = `
        <img src=${data.image.small} />
        <span>${data.name}</span>
    `
    document.getElementById("crypto-bottom").innerHTML = `
        <p>🎯: $${data.market_data.current_price.usd}</p>
        <p>👆: $${data.market_data.high_24h.usd}</p>
        <p>👇: $${data.market_data.low_24h.usd}</p>
    `
    localStorage.setItem("pinnedCrypto", data.name)
}

function getCurrentTime() {
    const date = new Date()
    document.getElementById("time").textContent = date.toLocaleTimeString("ru-ru", {timeStyle: "short"})
}

setInterval(getCurrentTime, 1000)

navigator.geolocation.getCurrentPosition(position => {
    fetch(`https://apis.scrimba.com/openweathermap/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&units=metric`)
        .then(res => {
            if (!res.ok) {
                throw Error("Weather data not available")
            }
            return res.json()
        })
        .then(data => {
            const iconUrl = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
            document.getElementById("weather").innerHTML = `
                <img src=${iconUrl} />
                <p class="weather-temp">${Math.round(data.main.temp)}ºC</p>
                <p class="weather-city">${data.name}</p>
            `
        })
        .catch(err => console.error(err))
});