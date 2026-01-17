// CurrencyConveter.js
// Make sure you have country_list.js loaded before this file

const dropList = document.querySelectorAll("form select");
const fromCurrency = document.querySelector(".form select"); // fixed selector
const toCurrency = document.querySelector(".to select");
const getButton = document.querySelector("form button");
const exchangeRateTxt = document.querySelector(".exchange-rate");
const exchangeIcon = document.querySelector(".icon");
const amountInput = document.querySelector(".amount input");

// Populate dropdown lists
for (let i = 0; i < dropList.length; i++) {
  for (const currency_code in country_list) {
    let selected =
      i === 0
        ? currency_code === "INR"
          ? "selected"
          : ""
        : currency_code === "USD"
        ? "selected"
        : "";

    let optionTag = `<option value="${currency_code}" ${selected}>${currency_code}</option>`;
    dropList[i].insertAdjacentHTML("beforeend", optionTag);
  }

  dropList[i].addEventListener("change", (e) => loadFlag(e.target));
}

// Load flag images
function loadFlag(element) {
  for (const code in country_list) {
    if (code === element.value) {
      const imgTag = element.parentElement.querySelector("img");
      imgTag.src=`https://flagsapi.com/${country_list[code]}/flat/64.png`;
    }
  }
}

// Default on page load
window.addEventListener("load", () => {
  loadFlag(fromCurrency);
  loadFlag(toCurrency);
  getExchangeRate();
});

// Swap currencies when icon clicked
exchangeIcon.addEventListener("click", () => {
  let temp = fromCurrency.value;
  fromCurrency.value = toCurrency.value;
  toCurrency.value = temp;
  loadFlag(fromCurrency);
  loadFlag(toCurrency);
  getExchangeRate();
});

// Handle button click
getButton.addEventListener("click", (e) => {
  e.preventDefault();
  getExchangeRate();
});

// Get exchange rate using exchangerate-api.com
function getExchangeRate() {
  let amountVal = amountInput.value;
  if (amountVal === "" || amountVal === "0") {
    amountInput.value = "1";
    amountVal = 1;
  }

  exchangeRateTxt.innerText = "Getting exchange rate...";

  // Use your API key and FROM currency
  const apiKey = "b4280f61a48ee65ac512a540";
  const url = ` https://v6.exchangerate-api.com/v6/${apiKey}/latest//${fromCurrency.value}`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      if (data.result === "success") {
        // ExchangeRate-API returns conversion rates like this:
        // data.conversion_rates["INR"] → exchange rate for 1 FROM = ? TO
        const exchangeRate = data.conversion_rates[toCurrency.value];
        const convertedAmount = (amountVal * exchangeRate).toFixed(2);

        exchangeRateTxt.innerText = `${amountVal} ${fromCurrency.value} = ${convertedAmount} ${toCurrency.value}`;
      } else {
        exchangeRateTxt.innerText = "Something went wrong... Try again later.";
      }
    })
    .catch(() => {
      exchangeRateTxt.innerText = "Error fetching data. Check your connection.";
    });
}
