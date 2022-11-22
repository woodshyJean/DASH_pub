import React, {useEffect, useState} from "react";

import { WiWindy, WiHumidity, WiBarometer, WiDirectionDown, WiDirectionUp} from "react-icons/wi";

import {BsSunrise, BsSunset} from "react-icons/bs"

import "./Weather.css"

export default function Weather(){

    let [weatherData, setWeaterData] = useState({
        name:"",
        temp:"",
        feelsLike:"",
        humidity:"",
        pressure:"",
        maxTemp:"",
        minTemp:"",
        sunrise:"",
        sunset:"",
        weather:"",
        weatherDesc:"",
        weatherImg:"",
    })
    

    useEffect(() => {
        navigator.geolocation.getCurrentPosition((res) => { //get user location
            let lat = res.coords.latitude; //users latitude
            let lon = res.coords.longitude; //users longitude

            fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=<API KEY>`) //api call with users location
            .then((res) => {
                return res.json() //convert response into json 
            })
            .then((data) =>  {
                //console.log(data)
                setWeaterData((prev) => { //inserting the received data into react state
                    return{
                        ...prev,
                        name:data.name,
                        temp:Math.round(data.main.temp),
                        feelsLike:data.main.feels_like,
                        humidity:Math.round(data.main.humidity),
                        pressure:Math.round(data.main.pressure),
                        maxTemp:Math.round(data.main.temp_max),
                        minTemp:Math.round(data.main.temp_min),
                        sunrise:new Date(data.sys.sunrise * 1000).toLocaleTimeString('en-US'),
                        sunset:new Date(data.sys.sunset * 1000).toLocaleTimeString('en-US'),
                        windSpeed:Math.round(data.wind.speed),
                        weatherDesc:data.weather[0].description,
                        weatherImg:`https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`,

                    }
                })

            })
            .catch((error) => console.error(`something went wrong while getting weather: ${error}`))
        })

        //console.log("Weather")

    }, [])

    return(
        <div className="weather-container">
            <div className="weather-main">
                <p className="weather-location">{weatherData.name}</p>
                <img className="icon" src={weatherData.weatherImg} title={weatherData.weatherDesc} alt={weatherData.weatherDesc}> 
                </img>
                <p className="weather-desc">{weatherData.weatherDesc}</p>
                <p className="weather-temp">{weatherData.temp}ºF</p>
                <div className="weather-main-bottom">
                    <p className="weather-max"><WiDirectionUp/>{weatherData.maxTemp}</p>
                    <p className="weather-min">{weatherData.minTemp}<WiDirectionDown/></p>
                </div>
            </div>
            <div className="weather-extraData">
                <p className="weather-windspeed"><WiWindy/>{weatherData.windSpeed}•mph</p>
                <p className="weather-humidity"><WiHumidity/>{weatherData.humidity}%</p>
                <p className="weather-pressure"><WiBarometer/>{weatherData.pressure}•hPa</p>
            </div>
            <div className="weather-sun">
                <p className="weather-sunrise"><BsSunrise/>{weatherData.sunrise}</p>
                <p className="weather-sunset"><BsSunset/>{weatherData.sunset}</p>
            </div>
        </div>
    )
}
