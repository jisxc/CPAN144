import React, { useEffect, useState } from 'react';
import Header from '../components/Header';

const getWeatherIcon = (temperature) => {
  if (temperature <= 10) {
    return '/images/cold.webp'; // Replace with actual cold image path
  } else if (temperature <= 25) {
    return '/images/warm.png'; // Replace with actual warm image path
  } else {
    return '/images/hot.png'; // Replace with actual hot image path
  }
};

const generateChartUrl = (labels, temperatureData, humidityData) => {
  const chartConfig = {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Temperature (°C)',
          fill: false,
          borderColor: 'rgba(75,192,192,1)',
          pointBackgroundColor: '#fff',
          pointRadius: 5,
          data: temperatureData
        },
        {
          label: 'Humidity (%)',
          fill: false,
          borderColor: 'rgba(192,192,75,1)',
          pointBackgroundColor: '#fff',
          pointRadius: 5,
          data: humidityData
        }
      ]
    },
    options: {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      }
    }
  };

  return `https://quickchart.io/chart?c=${encodeURIComponent(JSON.stringify(chartConfig))}`;
};

const Dashboard = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState('Toronto');
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    const getLocation = async () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            await fetchWeatherData(lat, lon);
          },
          (error) => {
            console.error(error);
            setLoading(false);
          },
          { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        );
      } else {
        console.log('Geolocation is not supported by this browser.');
        setLoading(false);
      }
    };
    getLocation();
  }, []);

  const fetchWeatherData = async (lat, lon) => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m&current_weather=true`
      );
      const data = await response.json();
      if (data.current_weather && data.hourly) {
        setWeatherData(data);
      } else {
        throw new Error('Invalid data structure from API');
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      const response = await fetch(`https://geocode.xyz/${searchValue}?json=1`);
      const data = await response.json();
      setCity(searchValue);
      await fetchWeatherData(data.latt, data.longt); 
    } catch (error) {
      console.error('Error fetching location data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!weatherData) {
    return <div>Error loading data, please try again later.</div>;
  }

  const labels = weatherData.hourly.time.map(time => new Date(time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
  const temperatureData = weatherData.hourly.temperature_2m;
  const humidityData = weatherData.hourly.relative_humidity_2m;
  const chartUrl = generateChartUrl(labels, temperatureData, humidityData);
  const currentTemperature = weatherData.current_weather.temperature;
  const currentHumidity = weatherData.current_weather.relative_humidity;
  const currentWindSpeed = weatherData.current_weather.windspeed_10m;
  const weatherIcon = getWeatherIcon(currentTemperature);

  return (
    <div className="w-full max-w-[1280px] h-auto bg-white flex flex-col items-center mx-auto">
      <div className="self-stretch h-[1214px] bg-white flex-col justify-start items-start flex">
        <div className="self-stretch h-[1214px] flex-col justify-start items-start flex">
          <Header />
          <div className="self-stretch h-[1149px] px-40 py-5 justify-center items-start inline-flex">
            <div className="w-[960px] py-5 flex-col justify-start items-start inline-flex">
              <div className="self-stretch h-[76px] px-4 pt-6 pb-3 flex-col justify-start items-center flex">
                <div className="self-stretch text-center text-[#111616] text-[32px] font-bold font-['Plus Jakarta Sans'] leading-10">You are in {city}</div>
              </div>
              <div className="self-stretch h-[72px] px-4 py-3 flex-col justify-start items-start flex">
                <div className="self-stretch h-12 flex-col justify-start items-start flex">
                  <div className="self-stretch grow shrink basis-0 rounded-xl justify-start items-start inline-flex">
                    <div className="self-stretch pl-4 bg-[#eff2f4] rounded-tl-xl rounded-bl-xl justify-center items-center flex">
                      <div className="h-6 relative">
                        <div className="w-5 h-5 left-0 top-0 absolute" />
                      </div>
                    </div>
                    <div className="grow shrink basis-0 self-stretch pl-2 pr-4 py-2 bg-[#eff2f4] rounded-tr-xl rounded-br-xl justify-start items-center flex">
                      <input type="text" value={searchValue} onChange={(e) => setSearchValue(e.target.value)} placeholder="Search for another location" className="w-full h-full bg-[#eff2f4] border-none outline-none text-[#111616] text-sm font-normal font-['Plus Jakarta Sans'] leading-[21px]" />
                      <button onClick={handleSearch}>
                        <div className="h-6 relative">
                          <div className="w-5 h-5 left-0 top-0 absolute" />
                          <i className="fas fa-search text-[#111616] text-lg" />
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="self-stretch h-[47px] px-4 pt-4 pb-2 flex-col justify-start items-start flex">
                <div className="self-stretch text-[#111616] text-lg font-bold font-['Plus Jakarta Sans'] leading-[23px]">Current Metrics</div>
              </div>
              <div className="self-stretch h-[203px] p-4 flex-col justify-start items-start flex">
                <div className="self-stretch rounded-xl justify-between items-start inline-flex">
                  <div className="w-[608px] h-[171px] flex-col justify-start items-start gap-1 inline-flex">
                    <div className="self-stretch h-[21px] flex-col justify-start items-start flex">
                      <div className="self-stretch text-[#637c87] text-sm font-normal font-['Plus Jakarta Sans'] leading-[21px]">{city}</div>
                    </div>
                    <div className="self-stretch h-[21px] flex-col justify-start items-start flex">
                      <div className="self-stretch text-[#637c87] text-sm font-normal font-['Plus Jakarta Sans'] leading-[21px]">{new Date(weatherData.current_weather.time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}, {currentTemperature}°C</div>
                    </div>
                  </div>
                  <img className="h-[171px] relative rounded-xl" src={weatherIcon} alt="Weather" />
                </div>
              </div>
              <div className="self-stretch h-[47px] px-4 pt-4 pb-2 flex-col justify-start items-start flex">
                <div className="self-stretch text-[#111616] text-lg font-bold font-['Plus Jakarta Sans'] leading-[23px]">Today</div>
              </div>
              <div className="self-stretch h-[217px] p-4 flex-col justify-start items-start flex">
                <div className="self-stretch py-2 justify-between items-start inline-flex">
                  <div className="flex-col justify-start items-start inline-flex">
                    <div className="text-[#637c87] text-sm font-normal font-['Plus Jakarta Sans'] leading-[21px]">Sunrise</div>
                  </div>
                  <div className="flex-col justify-start items-start inline-flex">
                    <div className="text-right text-[#111616] text-sm font-normal font-['Plus Jakarta Sans'] leading-[21px]">6:42 am</div>
                  </div>
                </div>
                <div className="self-stretch py-2 justify-between items-start inline-flex">
                  <div className="flex-col justify-start items-start inline-flex">
                    <div className="text-[#637c87] text-sm font-normal font-['Plus Jakarta Sans'] leading-[21px]">Sunset</div>
                  </div>
                  <div className="flex-col justify-start items-start inline-flex">
                    <div className="text-right text-[#111616] text-sm font-normal font-['Plus Jakarta Sans'] leading-[21px]">7:57 pm</div>
                  </div>
                </div>
                <div className="self-stretch py-2 justify-between items-start inline-flex">
                  <div className="flex-col justify-start items-start inline-flex">
                    <div className="text-[#637c87] text-sm font-normal font-['Plus Jakarta Sans'] leading-[21px]">Wind Speed</div>
                  </div>
                  <div className="flex-col justify-start items-start inline-flex">
                    <div className="text-right text-[#111616] text-sm font-normal font-['Plus Jakarta Sans'] leading-[21px]">{currentWindSpeed} km/h</div>
                  </div>
                </div>
                <div className="self-stretch py-2 justify-between items-start inline-flex">
                  <div className="flex-col justify-start items-start inline-flex">
                    <div className="text-[#637c87] text-sm font-normal font-['Plus Jakarta Sans'] leading-[21px]">Humidity</div>
                  </div>
                  <div className="flex-col justify-start items-start inline-flex">
                    <div className="text-right text-[#111616] text-sm font-normal font-['Plus Jakarta Sans'] leading-[21px]">{currentHumidity}%</div>
                  </div>
                </div>
              </div>
              <div className="self-stretch h-[47px] px-4 pt-4 pb-2 flex-col justify-start items-start flex">
                <div className="self-stretch text-[#111616] text-lg font-bold font-['Plus Jakarta Sans'] leading-[23px]">This Week</div>
              </div>
              <div className="self-stretch h-[400px] p-4 flex-col justify-start items-start flex">
                <img src={chartUrl} alt="Weather Chart" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;