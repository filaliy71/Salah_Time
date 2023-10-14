const http = new XMLHttpRequest();
let result = document.querySelector("pre");
let results; // Define results at a higher scope

document.addEventListener("DOMContentLoaded", () => {
  findMyCoordinate();
});

function findMyCoordinate() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const bdcAPI = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}`;
        getAPI(bdcAPI);
      },
      (err) => {
        alert(err.message);
      }
    );
  } else {
    alert("Geolocation is not supported");
  }
}

function getAPI(bdcAPI) {
  http.open("GET", bdcAPI);
  http.send();
  http.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      //result.innerHTML = this.responseText;
      results = JSON.parse(this.responseText); // Assign results at this point
      console.log(results.city);

      // Check if results is defined before calling salah
      if (results) {
        salah();
      } else {
        console.log("Results not available yet.");
      }
    }
  };
}

function salah() {
  if (!results) {
    return;
  }

  var year = new Date().getFullYear();
  var month = new Date().getMonth() + 1;
  var day = new Date().getDate() - 1;
  fetch(
    "https://api.aladhan.com/v1/calendarByCity/" +
      year +
      "/" +
      month +
      "?city=" +
      results.city +
      "&country=" +
      results.countryName +
      "&method=3"
  )
    .then((Response) => Response.json())
    .then((data) => {
      var time = data;
      var Fajr = data.data[day].timings.Fajr;
      var Duhr = data.data[day].timings.Dhuhr;
      var Asr = data.data[day].timings.Asr;
      var Maghib = data.data[day].timings.Maghrib;
      var Isha = data.data[day].timings.Isha;
      var method = data.data[day].meta.method.name;
      var hijri = data.data[day].date.hijri.date;
      var gregorian = data.data[day].date.gregorian.date;
      console.log(time);
      var wak = document.getElementById("fajr");
      wak.innerHTML = Fajr.replace("(+01)", "");
      var dohr = document.getElementById("dhuhr");
      dohr.innerHTML = Duhr.replace("(+01)", "");
      var isr = document.getElementById("asr");
      isr.innerHTML = Asr.replace("(+01)", "");
      var maghb = document.getElementById("maghrib");
      maghb.innerHTML = Maghib.replace("(+01)", "");
      var ish = document.getElementById("isha");
      ish.innerHTML = Isha.replace("(+01)", "");
      document.querySelector(".hhh").innerHTML = results.city;
      document.querySelector(".method").innerHTML =
        "<i>method :  </i>" + method;
      document.querySelector(".date").innerHTML =
        "Miladi :" + gregorian + " | " + "hijri :" + hijri;
    });
}

const sunicon = document.querySelector(".sun");
const moonicon = document.querySelector(".moon");

const userTheme = localStorage.getItem("theme");
const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches;

const icontoggle = () => {
  moonicon.classList.toggle("display-none");
  sunicon.classList.toggle("display-none");
};

const themecheck = () => {
  if (userTheme === "dark" || (!userTheme && systemTheme)) {
    document.documentElement.classList.add("dark");
    moonicon.classList.add("display-none");
    return;
  }
  sunicon.classList.add("display-none");
};

const themeswitch = () => {
  if (document.documentElement.classList.contains("dark")) {
    document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", "light");
    icontoggle();
    return;
  }
  document.documentElement.classList.add("dark");
  localStorage.setItem("theme", "dark");
  icontoggle();
};

sunicon.addEventListener("click", themeswitch);
moonicon.addEventListener("click", themeswitch);
themecheck();
