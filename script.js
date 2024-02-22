const fromCurrency = document.getElementById('from-currency');
const toCurrency = document.getElementById('to-currency');
const fromAmount = document.getElementById('from-amount');
const toAmount = document.getElementById('to-amount');
const convertButton = document.getElementById('convert-button');
const editRatesButton = document.getElementById('edit-rates');
const rateEditor = document.getElementById('rate-editor');
const revertRateButton = document.getElementById('revert-rate');
const reverse = document.getElementById('reverse-button');
let selectedFrom;
let selectedTo;
let eff_rate = 1; 

const exchangeRatesTo = {
    USD: 82.14,
    INR: 1.0,
    DXB: 21.88,
    GBP: 101.03,
    EUR: 91.23,
    SGD: 62.15,
};

const exchangeRatesFrom = {
    USD: 0.012,
    INR: 1.0,
    DXB: 0.045,
    GBP: 0.0099,
    EUR: 0.011,
    SGD: 0.016,
};

function editTheRate() {
    rateEditor.style.display = 'block';
    updateExchangeRateBox();
}

function updateExchangeRateBox() {
    selectedFrom = fromCurrency.value;
    selectedTo = toCurrency.value;
    let initialRate;
    if(selectedFrom === selectedTo)
        initialRate = 1;
    else 
        initialRate = eff_rate === 1 ? exchangeRatesTo[selectedFrom] * exchangeRatesFrom[selectedTo] : eff_rate;

    let content = `<h2>Edit Exchange Rates (Press enter)</h2>
    <label for="${selectedFrom}-${selectedTo}">${selectedFrom} to ${selectedTo}:</label>
    <input type="number" id="${selectedFrom}-${selectedTo}" value="${initialRate}"><br>`;

    rateEditor.innerHTML = content;
}

function convertCurrency() {
    const from = fromCurrency.value;
    const to = toCurrency.value;
    const amt = parseFloat(fromAmount.value);

    let rate;
    if (eff_rate !== 1) {
        rate = eff_rate;
    } else {
        rate = exchangeRatesTo[from] * exchangeRatesFrom[to];
    }

    if(from === to)
        rate=1;

    const convertedAmount = rate * amt;
    toAmount.value = convertedAmount.toFixed(2);
    const convertedText = `${amt} ${from} = ${to} ${convertedAmount}`;
    document.getElementById('converted-amount').textContent = convertedText;
}

function revertRate() {
    eff_rate = 1; // Reset to original rate
    updateExchangeRateBox(); // Update displayed rate
    rateEditor.style.display = 'none';
}

function reverseConversion() {
    const temp = fromCurrency.value;
    fromCurrency.value = toCurrency.value;
    toCurrency.value = temp;
    handleCurrencyChange();
}

function handleCurrencyChange() {
    revertRate();
    //updateExchangeRateBox();
    convertCurrency();
}

convertButton.addEventListener('click', convertCurrency);
editRatesButton.addEventListener('click', editTheRate);
revertRateButton.addEventListener('click', revertRate);
reverse.addEventListener('click', reverseConversion);

fromCurrency.addEventListener('change', handleCurrencyChange);
toCurrency.addEventListener('change', handleCurrencyChange);

document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && rateEditor.style.display === 'block') {
        const input = document.getElementById(`${selectedFrom}-${selectedTo}`);
        const newRate = parseFloat(input.value);
        if (!isNaN(newRate)) {
            eff_rate = newRate;
            convertCurrency();
        } else {
            alert('Please enter a valid number.');
        }
    }
});
