import config from "../conf/index.js";

// Fetch all reservations from backend API
async function fetchReservations() {
  try {
    let reservationsProm = await fetch(config.backendEndpoint + "/reservations");
    let reservationsData = await reservationsProm.json();
    return reservationsData;
  } catch (err) {
    return null;
  }
}

// Add reservations to the reservations table in the DOM
// If no reservations, show the "no reservation" banner and hide the table
function addReservationToTable(reservations) {
  let noResv_banner = document.getElementById("no-reservation-banner");
  let table_parent = document.getElementById("reservation-table-parent");

  if (!reservations || reservations.length === 0) {
    noResv_banner.style.display = "block";
    table_parent.style.display = "none";
  } else {
    noResv_banner.style.display = "none";
    table_parent.style.display = "block";

    let table_body = document.getElementById("reservation-table");
    table_body.innerHTML = ""; // Clear previous rows to avoid duplication

    reservations.forEach((res) => {
      let adv_link = `../detail/?adventure=${res.adventure}`;
      table_body.innerHTML += `
        <tr>
          <td><b>${res.id}</b></td>
          <td>${res.name}</td>
          <td>${res.adventureName}</td>
          <td>${res.person}</td>
          <td>${new Date(res.date).toLocaleDateString("en-IN")}</td>
          <td>${res.price}</td>
          <td>${new Date(res.time).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}, ${new Date(res.time).toLocaleTimeString("en-IN")}</td>
          <td>
            <button class="reservation-visit-button" id=${res.id}>
              <a href="${adv_link}">Visit Adventure</a>
            </button>
          </td>
        </tr>
      `;
    });
  }
}

export { fetchReservations, addReservationToTable };
