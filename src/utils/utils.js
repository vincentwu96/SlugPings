export const saveToDatabase = (marker) => {
  fetch(process.env.REACT_APP_API_URL + '/database/marker/add', {
    body: JSON.stringify(marker),
    mode: 'cors',
    headers: {
      'Accept': 'application/json',
      'Content-type': 'application/json'
    },
    method: 'POST'
  })
    .then(async (resp) => {
      let msg = await resp.json();

      if (msg.status !== 200)
        throw Error("Something went wrong when trying to add marker to the database");

      console.log("Successfully added new marker to database");
    })
    .catch(error => console.log(error));
};

export const editMarkerInDatabase = (id, marker, cb = null) => {
  fetch(process.env.REACT_APP_API_URL + '/database/marker/update/' + id, {
    body: JSON.stringify(marker),
    mode: 'cors',
    headers: {
      'Accept': 'application/json',
      'Content-type': 'application/json'
    },
    method: 'POST'
  })
    .then(async (resp) => {
      let msg = await resp.json();

      if (msg.status !== 200)
        throw Error("Something went wrong when trying to update marker in the database");

      console.log("Successfully updated the marker in the database");

      if (cb)
        cb();
    })
    .catch(error => console.log(error));
};

export const getMarkers = () => {
  return fetch(process.env.REACT_APP_API_URL + "/database/markers");
};

export const isMarkerInDatabase = (id) => {
  return fetch(process.env.REACT_APP_API_URL + "/database/marker/delete/special/" + id);
}

// Faking it til we make it baby
export const isMarkerInDbMarkers = (id, dbMarkers) => {
  for (let marker of dbMarkers) {
    if (marker.id === id) {
      return true;
    }
  }
  return false;
}

// const POST_URL = "https://fierce-hamlet-12953.herokuapp.com/api/marker";
// //const POST_URL = "http://192.168.1.134:2000/api/marker";

// export const postMarkerToServer = async ({ id, x, y, lat, lng, text }) => {
//   const response = await fetch(POST_URL, {
//     method: 'POST',
//     mode: 'cors',
//     headers: {
//       'Accept': 'application/json',
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({
//       id: id,
//       x: x,
//       y: y,
//       lat: lat,
//       lng: lng,
//       text: text,
//     })
//   })

//   const body = await response.json();

//   if (response.status !== 200) throw Error(body.message);

//   console.log(body.msg);
// };