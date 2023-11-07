import axios from 'axios';

// entfernung in km
// Funktion zur Berechnung der Entfernung zwischen Koordinaten
function calculateDistance(origin, destination) {
  // Hier können Sie eine geeignete Entfernungsformel verwenden, z.B. die Haversine-Formel.
  // Die Implementierung hängt von Ihren Anforderungen ab.
  // Ein einfaches Beispiel mit der Haversine-Formel:
  const R = 6371; // Durchschnittlicher Erdradius in Kilometern
  const dLat = (destination.lat - origin.lat) * (Math.PI / 180);
  const dLon = (destination.lon - origin.lon) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(origin.lat * (Math.PI / 180)) * Math.cos(destination.lat * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
}

// Funktion zur Berechnung der besten Reihenfolge und der Gesamtstrecke
function findBestOrder(distances) {
    const n = distances.length;
    const visited = new Array(n).fill(false);
    const bestOrder = [];
    let currentPlace = 0; // Startort (kann beliebig sein)
    visited[currentPlace] = true;
    bestOrder.push(currentPlace);
    let totalDistance = 0; // Gesamtstrecke
  
    for (let i = 1; i < n; i++) {
      let minDistance = Infinity;
      let nextPlace = -1;
  
      for (let j = 0; j < n; j++) {
        if (!visited[j] && distances[currentPlace][j] < minDistance) {
          minDistance = distances[currentPlace][j];
          nextPlace = j;
        }
      }
  
      if (nextPlace !== -1) {
        visited[nextPlace] = true;
        bestOrder.push(nextPlace);
        totalDistance += minDistance;
        currentPlace = nextPlace;
      }
    }
  
    // Zurück zum Startort, um die Schleife zu schließen
    totalDistance += distances[bestOrder[n - 1]][bestOrder[0]];
  
    return { order: bestOrder, distance: totalDistance };
  }


  //const knownPlaces = [];

export async function getRoute(knownPlaces) {
    console.log(knownPlaces)
    const distances = await calculateAllDistances(knownPlaces)
    console.log("")
    console.log('Entfernungen:');
    // for (let i = 0; i < knownPlaces.length; i++) {
    //     for (let j = 0; j < knownPlaces.length; j++) {
    //     console.log(`Die Entfernung zwischen ${knownPlaces[i].name} und ${knownPlaces[j].name} beträgt ${distances[i][j]} km`);
    //     }
    // }'

    // Rufen Sie die Funktion auf, um die beste Reihenfolge und die Gesamtstrecke zu finden
    const { order, distance } = findBestOrder(distances);

    console.log("")
    console.log("")
    // Ausgabe der besten Reihenfolge und der Gesamtstrecke
    console.log('Die beste Reihenfolge ist:');
    order.forEach((place, index) => {
    console.log(`${index + 1}. Ort ${knownPlaces[place].name}`);
    });
    console.log("")
    console.log(`Gesamtstrecke: ${distance} km`);

    return order
 }


// Funktion zum Berechnen und Speichern der Entfernungen in einem zweidimensionalen Array
async function calculateAllDistances(knownPlaces) {
  const distances = new Array(knownPlaces.length).fill(null).map(() => new Array(knownPlaces.length).fill(null));

  for (let i = 0; i < knownPlaces.length; i++) {
    for (let j = i + 1; j < knownPlaces.length; j++) {
      const origin = knownPlaces[i];
      const destination = knownPlaces[j];
      const distance = calculateDistance({lat: origin.lat, lon: origin.lon}, {lat: destination.lat, lon: destination.lon});
      distances[i][j] = distance;
      distances[j][i] = distance;
    }
  }

  return distances;
}
