let dolar = 0; // Variável global para armazenar a cotação

async function getDollarRate() {
  try {
    let response = await fetch(
      "https://economia.awesomeapi.com.br/json/last/USD-BRL"
    );
    let data = await response.json();

    dolar = parseFloat(data.USDBRL.bid); // Pegando o valor do dólar
    console.log(`Cotação atual do dólar: R$ ${dolar}`);

    // Agora que temos a cotação, podemos fazer a conversão inicial
    convert("usd-to-brl");
  } catch (error) {
    console.error("Erro ao buscar a cotação do dólar:", error);
  }
}

// Chamando a função para buscar a cotação
getDollarRate();

let usdInput = document.querySelector("#usd");
let brlInput = document.querySelector("#brl");

usdInput.addEventListener("keyup", () => {
  convert("usd-to-brl");
});

brlInput.addEventListener("keyup", () => {
  convert("brl-to-usd");
});

usdInput.addEventListener("blur", () => {
  usdInput.value = formatCurrency(usdInput.value);
});

brlInput.addEventListener("blur", () => {
  brlInput.value = formatCurrency(brlInput.value);
});

function formatCurrency(value) {
  let fixedValue = fixValue(value);
  let options = {
    useGrouping: false,
    minimumFractionDigits: 2,
  };
  let formatter = new Intl.NumberFormat("pt-BR", options);
  return formatter.format(fixedValue);
}

function fixValue(value) {
  let fixedValue = value.replace(",", ".");
  let floatValue = parseFloat(fixedValue);
  if (isNaN(floatValue)) {
    floatValue = 0;
  }
  return floatValue;
}

function convert(type) {
  if (dolar === 0) {
    console.error("Cotação ainda não carregada.");
    return;
  }

  if (type == "usd-to-brl") {
    let fixedValue = fixValue(usdInput.value);
    let result = fixedValue * dolar;
    result = result.toFixed(2);
    brlInput.value = formatCurrency(result);
  }

  if (type == "brl-to-usd") {
    let fixedValue = fixValue(brlInput.value);
    let result = fixedValue / dolar;
    result = result.toFixed(2);
    usdInput.value = formatCurrency(result);
  }
}
