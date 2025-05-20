import config from "../conf/index.js";
async function fetchReservations() {

  try {
    const response = await fetch(`${config.backendEndpoint}/reservations/`);
    if (!response.ok) {
      throw new Error("Failed to fetch reservations");
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error("Error fetching reservations:", error);
    return null;
  }
}

function addReservationToTable(reservations) {
  
    const noReservationBanner = document.getElementById("no-reservation-banner");
    const reservationTableParent = document.getElementById("reservation-table-parent");
    const tableBody = document.getElementById("reservation-table");

    if (!tableBody) {
        console.error("Table body element not found");
        return;
    }

    tableBody.innerHTML = "";

    if (!reservations || reservations.length === 0) {
        noReservationBanner.style.display = "block";
        reservationTableParent.style.display = "none";
    } else {
        noReservationBanner.style.display = "none";
        reservationTableParent.style.display = "block";

        reservations.forEach((reservation) => {

            const row = document.createElement("tr");


            const formattedDate = new Date(reservation.date).toLocaleDateString("en-IN");
            const formattedBookingDate = new Date(reservation.time).toLocaleString("en-IN", { dateStyle: "long" });
            const formattedBookingTime = new Date(reservation.time).toLocaleString("en-IN", { timeStyle: "medium" });

            row.innerHTML = `
        <td>${reservation.id}</td>
        <td>${reservation.name}</td>
        <td>${reservation.adventureName}</td>
        <td>${reservation.person}</td>
        <td>${formattedDate}</td>
        <td>${reservation.price}</td>
        <td>${formattedBookingDate}, ${formattedBookingTime}</td>
        <td id="${reservation.id}">
          <a href="../detail/?adventure=${reservation.adventure}">
            <button class="reservation-visit-button" style="border: none;">Visit Adventure</button>
          </a>
        </td>
      `;


            tableBody.appendChild(row);
        });
    }
}

export { fetchReservations, addReservationToTable };
