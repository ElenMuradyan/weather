const apiKey='840b1a6d067573c41b2da7a6e203c8e2'
const button=document.getElementById('searchbutton');
const input=document.getElementById('searchinput');
const temp=document.getElementById('temperaturep');
const cityp=document.getElementById('cityp');
const countryp=document.getElementById('countryp');
const loading=document.getElementById('loading')
const iconTemp=document.getElementById('icon');

button.addEventListener('click',()=>{
    const city=input.value.trim();
    cityResp(city);
    input.value=''
});
    
function loadingHandle(state){
    loading.style.display=state;
};
 
async function cityResp(city){
    if(!city){
        alert('Please enter a city name');
        return;
    };
    loadingHandle('flex');
    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
        if (!response.ok) throw new Error('City not found');

        const data = await response.json();
        iconTemp.style.display = 'block';
        iconTemp.src = `http://openweathermap.org/img/w/${data.weather[0].icon}.png`; 
        temp.innerHTML = `${data.main.temp} °C`;
        cityp.innerHTML = city.charAt(0).toUpperCase() + city.slice(1);
        countryp.innerHTML = data.sys.country;
    }catch(err){
        if(cityp.innerHTML===''){
            iconTemp.style.display='none';
        };
        alert('Could not determine your location. Please enter a city name.');
    }finally{
        loadingHandle('none');  
}};

if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(
        (position)=>{
            loadingHandle('flex');
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`)
            .then(resp => {
                return resp.json();
            })
            .then(data => {
                const city=data.address.city||data.address.town||data.address.village||'';
                cityResp(city);
            }).catch(()=>{
                alert('Could not determine your location. Please enter a city name.');
            }).finally(()=>{
                loadingHandle('none');
            });
        }),() => {
            alert('Geolocation is not enabled. Please enter a city name.');
        }}

input.addEventListener('keypress',function(event){
    if(event.key==='Enter'){
        let city=input.value.trim();
        cityResp(city);
        input.value='';
    }
})