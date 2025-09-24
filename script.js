document.addEventListener('DOMContentLoaded',()=>{
  fetchData("bitcoin");
  fetchChart("bitcoin");});
  const input = document.getElementById('input');
const search = document.getElementById('search');
const current_price = document.getElementById('current_price');
const change = document.getElementById('24hrchange'); // fixed id name
const cap = document.getElementById('market_cap');

async function fetchChart(coin) {
  try {
    const url = `https://api.coingecko.com/api/v3/coins/${coin}/market_chart?vs_currency=inr&days=7`;
    const res = await fetch(url);

    if (!res.ok) throw new Error("Chart data not found");

    const data = await res.json();
    console.log(data); // check structure

    const prices = data.prices.map(p => p[1]);  // only price values
    const labels = data.prices.map(p => {
      const d = new Date(p[0]);
      return `${d.getDate()}/${d.getMonth() + 1}`;
    });

    // Destroy old chart if exists
    if (window.cryptoChart) window.cryptoChart.destroy();

    const ctx = document.getElementById('priceChart').getContext('2d');
    window.cryptoChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: `${coin.toUpperCase()} (INR)`,
          data: prices,
          borderColor: '#22c55e',
          backgroundColor: 'rgba(34,197,94,0.2)',
          borderWidth: 2,
          tension: 0.5
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: true } },
        scales: { y: { beginAtZero: false } }
      }
    });
  } catch (error) {
    console.error("Error fetching chart:", error);
  }
}



async function fetchData(coin) {
  try {
    const url = `https://api.coingecko.com/api/v3/coins/${coin}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    const Price = data.market_data.current_price.inr;
    const change24 = data.market_data.price_change_24h_in_currency.inr;
    const market_cap = data.market_data.market_cap.inr;

    // update DOM
    current_price.innerHTML = `${Price.toLocaleString()} INR`;
    change.innerHTML = `${change24.toFixed(2)} INR`;
    cap.innerHTML = `${market_cap.toLocaleString()} INR`;

    // save in localStorage
    saveLocal(data);

  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

function saveLocal(data) {
  localStorage.setItem("coinData", JSON.stringify(data));
}

search.addEventListener('click', () => {
  const coin = input.value.trim().toLowerCase();
  if (!coin) {
     coin = "bitcoin"; // fallback if empty
  }
    fetchData(coin);
  fetchChart(coin);
});

