let currentLocation = ""
let locationInput = document.getElementById("locationInput")

//creating forcast data in form of array

async function getData() {
    const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    if (currentLocation == "") {
        let firstReq = await fetch("https://geo.ipify.org/api/v2/country?apiKey=at_ttTif7FnIWbWquaqaKfdhD3NL94UL")
        let locate = await firstReq.json()
        let locateArr=locate.location.region.split(" ")
        currentLocation = locateArr[0]
        console.log(currentLocation);

    }
    let secondReq = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=7feaa2d50e1140f19d0213719230608&q=${currentLocation}&days=3`)
    let data = await secondReq.json()
    let todayData = {
        date: "",
        location: data.location.name,
        dayNum: 0,
        day: "",
        month: "",
        temp: data.current.temp_c,
        condIcon: data.current.condition.icon,
        condText: data.current.condition.text,
        windSpd: data.current.wind_kph,
        humid: data.current.humidity,
    }

    let forecastData = []
    data.forecast.forecastday.forEach((el, index) => {
        if (index == 0) {
            todayData.date = el.date
        }
        else {
            let dayData = {
                date: el.date,
                day: weekday[new Date(el.date).getDay()],
                maxTemp: el.day.maxtemp_c,
                minTemp: el.day.mintemp_c,
                condIcon: el.day.condition.icon,
                condText: el.day.condition.text,
            }

            forecastData.push(dayData)
        }
    });
    forecastData.unshift(todayData)

    let todayDate = new Date(todayData.date)

    todayData.dayNum = todayData.date.split("-")[2]
    todayData.day = weekday[todayDate.getDay()]
    todayData.month = monthNames[todayDate.getMonth()]

    return forecastData
}
/******************/ 


//displaying the data 

async function showData() {
    let forecastData = await getData()
    let temp = ``
    forecastData.forEach((el, i) => {
        if (i == 0) {
            temp += `<div class="col-md-4 ">
            <div class="item h-100 ">
                <h6 class="p-3 d-flex justify-content-between"><span>${el.day}</span><span class=>${el.dayNum}${el.month}</span>
                </h6>
                <div class="p-4">
                    <h5>${el.location}</h5>
                    <h2 class="fa-4x">${el.temp}^C</h2>
                    <img src="https:${el.condIcon}" alt="weather" class="bigImg">
                    <h4 class="my-3">${el.condText}</h4>
                    <div class="d-flex justify-content-start gap-4">
                        <div class="d-flex gap-2">
                            <img src="images/wind.png" class="smImg" alt="wind speed">
                            <h4>${el.windSpd}</h4>
                        </div>
                        <div class="d-flex gap-2">
                            <img src="images/humidity.png" class="smImg" alt="humidty">
                            <h4>${el.humid}</h4>
                        </div>
                    </div>
                </div>
            </div>
        </div>`
        }
        else {
            temp += `<div class="col-md-4 bg-dark border border-top-0 border-bottom-0 border-end-0  border-dark-subtle">
            <div class="item text-center ">
                <h6 class="p-3">${el.day}</h6>
                <div class="p-4">
                    <img src="https:${el.condIcon}" alt="weather" class="mdImg mb-4">
                    <h2 class="fa-3x">${el.maxTemp}^C</h2>
                    <h3 class="fa-2x">${el.minTemp}^C</h3>
                    <h4 class="my-3">${el.condText}</h4>
                </div>
            </div>
        </div>`
        }
    })
    document.getElementById("weatherData").innerHTML = temp



}

showData()
/*************/ 

//location finder
 
locationInput.addEventListener("keyup", function () {
    if (locationInput.value.length >= 3) {
        currentLocation = locationInput.value
        showData()
    }


})

