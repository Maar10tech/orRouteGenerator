import "./styles.css";
import Map from "./Map/Map";
import { useEffect, useState } from "react";
import axios from "axios";
import { getRoute } from "./Helper";
import { useRef } from "react";

export default function App() {

  const [route, setRoute] = useState([{
    lat: 52.5170365,
    lng: 13.3888599
  }]);

  const routesHistory = useRef([])

  const [place1, setPlace1] = useState("");
  const [place2, setPlace2] = useState("");
  const [place3, setPlace3] = useState("");
  const [place4, setPlace4] = useState("");
  const [place5, setPlace5] = useState("");
  const [place6, setPlace6] = useState("");

  const knownPlaces = useRef([])

  // Funktion zur Überprüfung, ob OpenStreetMap den Ort kennt
  async function checkOpenStreetMap(place) {
    if(!place || place.trim()==""){
      return true;
    }
    try {
      const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${place}`);
      if (response.data.length > 0) {
        console.log(`OpenStreetMap kennt den Ort: ${place}`);
        console.log(response.data)
        const bestPlace = response.data.reduce(function(prev, current) {
          return (prev && prev.importance > current.importance) ? prev : current
        })
        console.log(bestPlace)
        knownPlaces.current.push(bestPlace);
        return true;
      } else {
        Throw(`OpenStreetMap kennt den Ort nicht: ${place}`);
        return false;
      }
    } catch (error) {
      console.error(`Fehler bei der Überprüfung von OpenStreetMap für ${place}: ${error.message}`);
      return false;
    }
  }

  useEffect(() => {
      // setCorrds({
      //   latitude: position.coords.latitude,
      //   longitude: position.coords.longitude
      // });     
  }, []);

async function checkAll() {
  return {
    res1: await checkOpenStreetMap(place1),
    res2: await checkOpenStreetMap(place2),
    res3: await checkOpenStreetMap(place3),
    res4: await checkOpenStreetMap(place4),
    res5: await checkOpenStreetMap(place5),
    res6: await checkOpenStreetMap(place6),
  }
}
  
async function submitHandler() {
  
    knownPlaces.current = []

    const {res1, res2, res3, res4, res5, res6} = await checkAll();

    if(res1 && res2 && res3 && res4 && res5 && res6){
      try {
        const response = await getRoute(knownPlaces.current);
        console.log(response)

        const newRoute = []
        response.forEach(placeIndex => {
          //console.log({lat: knownPlaces.current[placeIndex].lat, lon: knownPlaces.current[placeIndex].lon})
          newRoute.push({lat: knownPlaces.current[placeIndex].lat, lng: knownPlaces.current[placeIndex].lon, name: knownPlaces.current[placeIndex].name})
        });
        routesHistory.current.push(newRoute)
        setRoute(newRoute)

      } catch (error) {
        console.error(error);
        return false;
      }
    }else{
      console.log("not all inputs are valid")
    } 
  }

  return (
    <div className="flex flex-col h-screen w-screen">
      <div className="flex flex-row justify-between m-2 font-bold text-xl border-b-2 border-black/50"><h1>Turiba University</h1><h1>OR Route generator</h1><h1 className="font-normal">©maar10media, 2023</h1></div>
      <div className="flex flex-row">
        <div className="flex flex-col basis-2/3">
          <h1 className="text-xl p-3">Enter The places</h1>
          <section className="grid grid-flow-row grid-cols-1 sm:grid-cols-2 md:grid-cols-3 mx-5">
            <div className="">
              <label className='text-xl m-3'>Startplace:</label>
              <input
                className='p-2 m-2 border-2 rounded-xl border-black/40'
                placeholder="choose a place"
                type="text"
                value={place1}
                onChange={(e) => {setPlace1(e.target.value)}}
                id="place1"
              />
            </div>
            <div>
              <label className='text-xl m-3'>Place 1:</label>
              <input
                className='p-2 m-2 border-2 rounded-xl border-black/40'
                placeholder="choose a place"
                type="text"
                value={place2}
                onChange={(e) => {setPlace2(e.target.value)}}
                id="place2"
              />
            </div>
            <div>
              <label className='text-xl m-3'>Place 2:</label>
              <input
                className='p-2 m-2 border-2 rounded-xl border-black/40'
                placeholder="choose a place"
                type="text"
                value={place3}
                onChange={(e) => {setPlace3(e.target.value)}}
                id="place3"
              />
            </div>
            <div>
              <label className='text-xl m-3'>Place 3:</label>
              <input
                className='p-2 m-2 border-2 rounded-xl border-black/40'
                placeholder="choose a place"
                type="text"
                value={place4}
                onChange={(e) => {setPlace4(e.target.value)}}
                id="place4"
              />
            </div>
            <div>
              <label className='text-xl m-3'>Place 4:</label>
              <input
                className='p-2 m-2 border-2 rounded-xl border-black/40'
                placeholder="choose a place"
                type="text"
                value={place5}
                onChange={(e) => {setPlace5(e.target.value)}}
                id="place5"
              />
            </div>
            <div>
              <label className='text-xl m-3'>Place 5:</label>
              <input
                className='p-2 m-2 border-2 rounded-xl border-black/40'
                placeholder="choose a place"
                type="text"
                value={place6}
                onChange={(e) => {setPlace6(e.target.value)}}
                id="place6"
              />
            </div>
          </section>
          <button className="p-3 m-4 border-2 rounded-xl border-blue-600 max-w-xl font-bold" onClick={() => submitHandler()}>Get Route</button>
        </div>
        <div className="flex-1 flex-col flex mx-5">
          <h1 className="text-xl p-3">History</h1>
          <div className="flex flex-row">
          {routesHistory.current.map((hisRoute, index) => (
            <button className="border-2 p-1 m-1 rounded-xl border-blue-600/50 max-w-xs" onClick={() => setRoute(hisRoute)}>
              Route {index+1}
            </button>
          ))}
          </div>
        </div>
      </div> 
      <div className='h-[80vh] flex-none md:flex-1 md:h-full w-full'>
        <Map route={route}  />
      </div>
    </div>
  );
}
