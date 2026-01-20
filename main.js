// const fetch = require('node-fetch');

const locations = [
  "Andhra Pradesh, India",
  "Arunachal Pradesh, India",
  "Assam, India",
  "Bihar, India",
  "Chhattisgarh, India",
  "Goa, India",
  "Gujarat, India",
  "Harayana, India",
  "Himachal Pradesh, India",
  "JharKhand, India",
  "Karanataka, India",
  "Kerala, India",
  "Madhya Pradesh, India",
  "Maharastra, India",
  "Manipur, India",
  "Meghalaya, India",
  "Mizoram, India",
  "Nagaland, India",
  "Odisha, India",
  "Punjab, India",
  "Rajasthan, India",
  "Sikkim, India",
  "Tamil Nadu, India",
  "Telangana, India",
  "Tripura, India",
  "Uttar Pradesh, India",
  "Uttrakhand, India",
  "West Bengal, India",
  //union territories of india
  "Andaman and Nicobar Islands, India",
  "Chandigarh, India",
  "Dadra & Nagar Haveli, India",
  "Daman & Diu, India",
  "Delhi, India",
  "Jammu & Kashmir, India",
  "Ladhakh, India",
  "Lakshadweep, India",
  "Punucherry, India"
];

const apiKey = 'QFPFNERGEYGRJYB9D9MYSMT86';
const unitGroup = 'metric';
const startDate = 'next7days';

async function fetchWeather(states) {
  const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodeURIComponent(states)}/${startDate}?unitGroup=${unitGroup}&key=${apiKey}&contentType=json`;

  try {
    showBuffer(true);
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    // console.log(`Weather for ${location}:`, data);
    setTimeout(() => {
      showBuffer(false);
    }, 3000)
    displayAll(data);
  } catch (error) {
    console.error(`Error fetching weather for ${location}:`, error);
    showBuffer(false);
  }
}

// fetchWeather(locations[0]);

function displayAll(data) {

  // Get the Time,day, and date directly from the getTime() function
  const current = new Date();

  let formattedTime = current.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
  let formattedDay = current.toLocaleDateString(undefined, {
    weekday: 'short'
  });
  let formattedDate = current.toLocaleDateString(undefined, {
    dateStyle: 'long'
  });

  // Displaying time,weekday, and date
  document.querySelector(".time-display").innerHTML = formattedTime;
  document.querySelector(".day-display").innerHTML = formattedDay;
  document.querySelector(".date-display").innerHTML = formattedDate;
  // Displaying location from data.address
  document.querySelector(".location").innerHTML = `${data.address}`;
  // Displaying celsius from data.temp
  document.querySelector(".celcius").innerHTML = `${data.currentConditions.temp} °C`;
  //displaying weatherSVG with the help of data.currentContion.icon
  weatherSVG(data.currentConditions.icon, data.currentConditions.temp);
  dayList(data.days);
};

//dynamic search function 
SearchLoacation()
function SearchLoacation() {
  const allOptions = document.querySelector(".search-location");
  const searchScope = document.querySelector('.search-container');

  //this will add the list of search options
  let addLocation = '';
  locations.forEach((location) => {
    addLocation += `<li class="location-list">${location}</li> `;
    allOptions.innerHTML = addLocation;
  })

  const input = document.querySelector(".search-input");
  const options = document.querySelectorAll(".location-list");

  //little search toggle effect which will make the user experience interesting
  searchScope.addEventListener("mouseout", () => {
    allOptions.style.display = "none";
    // input.value = '';
  })
  searchScope.addEventListener("mouseover", () => {
    allOptions.style.display = "block";
  })

  // Add an event listener to run the code every time searching
  input.addEventListener("input", () => {
    const filter = input.value.toUpperCase();
    for (let i = 0; i < options.length; i++) {
      const text = options[i].innerText;
      if (filter.length <= 1 & filter.length > 0) {
        document.querySelector(".search-location").style.height = "200px";
      }
      else {
        document.querySelector(".search-location").style.height = "auto";

      }

      // Check if text matches the filter
      if (filter.length == 0) {
        options[i].style.display = "none";
      } else if (text.toUpperCase().includes(filter)) {
        options[i].style.display = "block";
        // console.log(filter.length)
      } else {
        options[i].style.display = "none";
      }
    }
  });

  //on list click this will add the value in input.
  options.forEach((option) => {
    option.addEventListener("click", (event) => {
      input.value = event.target.textContent;
      // console.log(event.target.textContent);
    })
  });

  //on click fetch the searched location
  document.querySelector(".search-button").addEventListener("click", () => {
    const query = input.value;
    if (query) {
      // Direct call: Visual Crossing accepts the string directly
      fetchWeather(query);
    }
  });
  fetchWeather("Maharastra, India");
}

//drop downlist function

function dayList(day) {
  let selected = 'today';
  const dayList = document.querySelector('#day-dropdown');
  dayList.addEventListener("change", (event) => {
    selected = event.target.value;
    console.log(selected)

    switch (selected) {
      case 'tomorrow':
        addHourList(day[1]);
        break;
      case 'week':
        addDayList(day);
        break;
      case 'today':
        addHourList(day[0]);
    }
  })
  // console.log(selected);
  dayList.dispatchEvent(new Event('change'));

  //add hour list function 
  function addHourList(day) {
    
    let addData = '';
    // console.log(day);
    Object.values(day.hours).forEach((each) => {
      // console.log(each.conditions);
      const time = new Date(each.datetimeEpoch *1000);
      let formattedTime = time.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      });
      
      const iconUrl = `https://raw.githubusercontent.com/visualcrossing/WeatherIcons/58c79610addf3d4d91471abbb95b05e96fb43019/SVG/3rd%20Set%20-%20Monochrome/${each.icon}.svg`;
      addData += `
          <div class="forecast-item">
            <div class="time">${formattedTime}</div>
            <div class="condition">${each.conditions}</div>
            <div class="weather-icon">
                <img src="${iconUrl}" alt="${each.icon}" width="25">
            </div>
            <div class="temperature">${each.temp} °C</div>
          </div>
          <hr>`

          document.querySelector('.forecast-list').innerHTML = addData;
    })
  }

  //add day list function.
  function addDayList(day) {
    
    let addData = '';
    // console.log(day);
    Object.values(day).forEach((each) => {
      // console.log(each.conditions);

      const day = new Date(each.datetime);
      let formattedDay = day.toLocaleString(undefined, {
        weekday:'short'
      });
      let formattedDate = day.toLocaleString(undefined, {
        dateStyle:'medium'
      });

      const iconUrl = `https://raw.githubusercontent.com/visualcrossing/WeatherIcons/58c79610addf3d4d91471abbb95b05e96fb43019/SVG/3rd%20Set%20-%20Monochrome/${each.icon}.svg`;
      addData += `
          <div class="forecast-item">
            <div class="time"><div class="date">${formattedDate}</div><div class="day">${formattedDay}</div></div>
            <div class="condition">${each.conditions}</div>
            <div class="weather-icon">
                <img src="${iconUrl}" alt="${each.icon}" width="25">
            </div>
            <div class="temperature">${each.temp} °C</div>
          </div>
          <hr>`

          document.querySelector('.forecast-list').innerHTML = addData;
    })
  }
}


//all animation below 

//show browsing animation until data is fetched

function showBuffer(isLoading) {

  const displayBuffer = document.querySelector('.buffer');
  const displayWeatherApp = document.querySelector('.weather-container');
  if (isLoading) {
    displayBuffer.style.display = "block";
    displayWeatherApp.style.display = "none";
    buffer();
  } else {
    displayBuffer.style.display = "none";
    displayWeatherApp.style.display = "grid";
  }


}


function buffer() {
  fetch('./media/buffer.svg')
    .then((res) => { return res.text(); })
    .then((svg) => {
      document.querySelector('.buffer').innerHTML = svg;
      // console.log(svg);
      document.querySelector('.buffer svg').setAttribute('viewBox', "0 0 400 800");

      let runAnimation = gsap.timeline({ repeat: -1, yoyo: true, });
      runAnimation.fromTo('.buffer svg', {
        rotate: '30',
        transformOrigin: 'top center',
      }, {
        duration: 2,
        rotate: '-30',
        transformOrigin: 'top center',
        ease: "sine.inOut"
      }).to(['#E1', '#E2'], 0.1, {
        scaleY: '0'
      })
    })
};

//This will make conditons for svg to load
function weatherSVG(condition, temp) {

  if (condition.includes("rain") || condition.includes("showers")) {
    loadSvg("rainy.svg", animateRainy);
    document.querySelector(".weather-container").style.backgroundColor = "#586D90";
  } else if (condition.includes("thunder") || condition.includes("storm")) {
    loadSvg("stormy.svg", animateStormy);
    document.querySelector(".weather-container").style.backgroundColor = "#9E6ED1";
  } else if (condition.includes("snow") || temp <= 5) {
    loadSvg("snowy.svg", animateSnowy);
    document.querySelector(".weather-container").style.backgroundColor = "#5762C8";
  } else if (condition.includes("fog")) {
    loadSvg("foggy.svg", animateFoggy);
    document.querySelector(".weather-container").style.backgroundColor = "#008585";
  } else if (condition.includes("clear") || condition.includes("sunny")) {
    loadSvg("sunny.svg", animateSunny);
    document.querySelector(".weather-container").style.backgroundColor = "#EA6614";
  } else {
    // Default fallback for cloudy, partly-cloudy, or anything else
    loadSvg("cloudy.svg", animateCloud);
    document.querySelector(".weather-container").style.backgroundColor = "#5594E6";

  }
};

// function to put path and animation on display
function loadSvg(path, animation) {
  fetch(`./media/${path}`)
    .then((res) => { return res.text(); })
    .then((svg) => {
      document.querySelector('.svg-icon').innerHTML = svg;
      // console.log(svg);
      animation();
    })
}
// for rainy animation
function animateRainy() {
  let runAnimation = gsap.timeline({
    repeat: -1,
    repeatRefresh: true,
    defaults: {
      duration: 1,
      scale: 0,
      transformOrigin: 'left top',
      ease: "sine.inOut"
    }
  });
  runAnimation.from("#R1, #R2, #R3, #R4", {
    y: -20,
    scaleY: 0,
    opacity: 0,
    stagger: {
      each: 0.4,
      from: "random"
    },
    force3D: true
  }, 0);
}

//for stormy animation
function animateStormy() {
  let runAnimation = gsap.timeline({
    repeat: -1,
  });
  runAnimation.from("#ST1", 0.1, { scale: 0, transformOrigin: "top left" }, +0.1)
    .from("#ST2", 0.1, { scale: 0, transformOrigin: "right right" }, +0.2)
    .from("#ST3", 0.1, { scale: 0, transformOrigin: "top left" }, +0.3)
    .from("#ST4", 0.1, { scale: 0, transformOrigin: "right right" }, +0.4)
    .from("#ST5", 0.1, { scale: 0, transformOrigin: "top left" }, +0.5)
    .from("#ST6", 0.1, { scale: 0, transformOrigin: "right right" }, +0.6)
    .from("#ST7", 0.1, { scale: 0, transformOrigin: "top" }, +0.7)
    .from("#ST8", 0.1, { scale: 0, transformOrigin: "right" }, +0.8)
    .from("#ST9", 0.1, { scale: 0, transformOrigin: "right top" }, +0.9)
    .from("#ST10", 0.1, { scale: 0, transformOrigin: "bottom left" }, +1)
    .from("#ST11", 0.1, { scale: 0, transformOrigin: "top 20%" }, +1.1)
    .from("#ST12", 0.1, { scale: 0, transformOrigin: "right top" }, +1.2)
    .from("#ST13", 0.1, { scale: 0, transformOrigin: "top top" }, +1.3)
}

//for snowy animation
function animateSnowy() {
  let runAnimation = gsap.timeline({
    repeat: -1,
    yoyo: true,
    defaults: {
      ease: "sine.inOut",
      duration: 2.5
    }
  });
  runAnimation.from(["#SN1", "#SN2", "#SN3"], {
    scale: "random(0.5, 1.5)",
    rotate: "random(-180, 180)",
    transformOrigin: "center center",
    stagger: {
      each: 0.4,
      from: "random"
    }
  });
}

//for foggy animation
function animateFoggy() {
  let runAnimation = gsap.timeline({
    defaults: {
      duration: 3,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true
    }
  });
  runAnimation
    .fromTo("#F6", { x: "-10%", opacity: 0.3 }, { x: "10%", opacity: 0.8 }, 0.2)
    .fromTo("#F1", { x: "-15%", opacity: 0.2 }, { x: "15%", opacity: 0.7 }, 0.4)
    .fromTo("#F2", { x: "15%", opacity: 0.2 }, { x: "-15%", opacity: 0.7 }, 0.6)
    .fromTo("#F3", { x: "10%", opacity: 0.3 }, { x: "-10%", opacity: 0.8 }, 0.8)
    .fromTo("#F4", { x: "12%", opacity: 0.2 }, { x: "-12%", opacity: 0.6 }, 1.0)
    .fromTo("#F5", { x: "-12%", opacity: 0.3 }, { x: "12%", opacity: 0.7 }, 1.2);
}

//for Sunny animation
function animateSunny() {
  let runAnimation = gsap.timeline({
    repeat: -1,
    defaults: { ease: "sine.inOut" }
  });

  let odd = [1, 3, 5, 7].map(num => `#SU${num}`);
  let even = [2, 4, 6, 8].map(num => `#SU${num}`);

  runAnimation
    .to(".svg-icon svg", {
      rotate: 360,
      duration: 10,
      ease: "none"
    }, 0)
    .to(odd, {
      scale: 0.7,
      duration: 1.5,
      yoyo: true,
      repeat: 1,
      transformOrigin: "center center",
      stagger: 0.1
    }, 0)
    .to(even, {
      scale: 1.3,
      duration: 1.5,
      yoyo: true,
      repeat: 1,
      transformOrigin: "center center",
      stagger: 0.1
    }, 0.5);
}

//for cloudy animantion
function animateCloud() {
  let runAnimation = gsap.timeline({
    repeat: -1,
    yoyo: true,
    defaults: {
      duration: 4,
      ease: "sine.inOut"
    }
  });

  runAnimation
    .fromTo("#C1",
      { x: "-5%", y: "0%", scale: 1 },
      { x: "10%", y: "-2%", scale: 1.05, transformOrigin: "center center" }, 0)
    .fromTo("#C2",
      { x: "5%", y: "0%", scale: 1 },
      { x: "-15%", y: "3%", scale: 1.05, transformOrigin: "center center" }, 0.5)
    .fromTo("#C3",
      { x: "10%", y: "0%", scale: 0.95 },
      { x: "-25%", y: "-4%", scale: 1.02, transformOrigin: "center center" }, 0.2)
    .fromTo("#C4",
      { x: "10%", y: "0%", scale: 0.95 },
      { x: "-25%", y: "-4%", scale: 1.02, transformOrigin: "center center" }, 0.2);
}
