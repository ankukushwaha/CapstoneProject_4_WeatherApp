import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const port = 3000;
const app = express();

const API_Key = "887adcc7c8ca4f8d9ef102934230510";
const API_URL = "http://api.weatherapi.com/v1/";

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", (req,res) => {
    res.render("index.ejs");
})

app.post("/", async (req,res) => {
    try {
        const city = req.body.name;
        const response = await axios.get(`${API_URL}search.json?key=${API_Key}&q=${city}`);
        const data = response.data;
        res.render("index.ejs", {content: data});
    } catch (error) {
        res.render("index.ejs", {content: error.message});
    }
})

app.post("/get", async (req,res) => {
    try {
        const latLonCity = req.body.q;
        // console.log(req.body.q); 
        const [lat, lon , city] = latLonCity.split(',');
        const latLon = (lat +","+ lon) ;
        const response = await axios.get(`${API_URL}current.json?key=${API_Key}&q=${city}&query=${latLon}`);
        const data = response.data;
        // console.log(data);   
        var dayOrNight = "Day";
        if(data.current.is_day === 0){
            dayOrNight = "Night";
        }

        const d = new Date(data.location.localtime);
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September","October", "November", "December"];
        const month = months[d.getMonth()];
        const days = ["Sunday", "Monday", "Tuesday", "Wednesday","Thursday", "Friday", "Saturday"];
        const day = days[d.getDay()];
        const time = d.toLocaleTimeString();
        var [onlyTime, AmPm] = time.split(" ");
        var [hour, min, sec] = onlyTime.split(":");
        var Time = hour + ":" + min;
        AmPm = AmPm.toUpperCase();
        
        res.render("weather.ejs", {content: data, dayOrNight, d, month, day, Time, AmPm});
    } catch (error) {
        res.render("weather.ejs", {value: error.message});
    }
})

app.listen(port, (req,res) => {
    console.log(`app is listening at port ${port}`);
})