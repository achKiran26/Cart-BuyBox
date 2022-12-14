function formatMoney(cents, format) {
  if (typeof cents == "string") {
    cents = cents.replace(".", "");
  }
  var value = "";
  var placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
  var formatString = format || this.money_format;

  function defaultOption(opt, def) {
    return typeof opt == "undefined" ? def : opt;
  }

  function formatWithDelimiters(number, precision, thousands, decimal) {
    precision = defaultOption(precision, 2);
    thousands = defaultOption(thousands, ",");
    decimal = defaultOption(decimal, ".");

    if (isNaN(number) || number == null) {
      return 0;
    }

    number = (number / 100.0).toFixed(precision);

    var parts = number.split("."),
      dollars = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1" + thousands),
      cents = parts[1] ? decimal + parts[1] : "";

    return dollars + cents;
  }

  switch (formatString.match(placeholderRegex)[1]) {
    case "amount":
      value = formatWithDelimiters(cents, 2);
      break;
    case "amount_no_decimals":
      value = formatWithDelimiters(cents, 0);
      break;
    case "amount_with_comma_separator":
      value = formatWithDelimiters(cents, 2, ".", ",");
      break;
    case "amount_no_decimals_with_comma_separator":
      value = formatWithDelimiters(cents, 0, ".", ",");
      break;
  }

  return formatString.replace(placeholderRegex, value);
}

//change input counter values
document
  .querySelectorAll(".cart-quantity-selector button")
  .forEach((button) => {
    button.addEventListener("click", () => {
      const input = button.parentElement.querySelector("input");
      console.log(input, "hi");
      const value = Number(input.value);
      const isPlus = button.classList.contains("plus");
      const key = button.closest(".cart-item").getAttribute("data-key");

      if (isPlus) {
        const newValue = value + 1;
        input.value = newValue;
        changeItemQuantity(key, newValue);
      } else if (value > 1) {
        const newValue = value - 1;
        input.value = newValue;
        changeItemQuantity(key, newValue);
      }
    });
  });

//loader text when fetch OP
const loader = document.querySelector(".cart-loader");
function displayLoading() {
  loader.classList.add("display");
  setTimeout(() => {
    loader.classList.remove("display");
  }, 5000);
}
function hideLoading() {
  loader.classList.remove("display");
}

//remove product
document.querySelectorAll(".remove-item").forEach((remove) => {
  remove.addEventListener("click", (e) => {
    e.preventDefault();
    displayLoading();
    const item = remove.closest(".cart-item");
    const key = item.getAttribute("data-key");
    axios
      .post("/cart/change.js", {
        id: key,
        quantity: 0,
      })
      .then((res) => {
        hideLoading();
        if (res.data.items.length === 0) {
          document.querySelector("#cart_form").remove();

          const html = document.createElement("div");
          html.innerHTML = `
          <div class="cart-empty">
          <p>Your shopping bag is empty.</p>
          <a class="button" href="/collections/all">Keep shopping</a>
        </div>
          `;
          document.querySelector(".cart .width").appendChild(html);
        } else {
          const format = document
            .querySelector("[data-money-format]")
            .getAttribute("data-money-format");

          const totalPrice = formatMoney(res.data.total_price, format);

          document.querySelector("#total-price").textContent = totalPrice;
          item.remove();
        }
      });
  });
});

//change item price dynamically - no refrsh
function changeItemQuantity(key, quantity) {
  console.log("item and quant", key, quantity);
  axios
    .post("/cart/change.js", {
      id: key,
      quantity,
    })
    .then((res) => {
      console.log("respn item", res.data);
      const format = document
        .querySelector("[data-money-format]")
        .getAttribute("data-money-format");

      const totalPrice = formatMoney(res.data.total_price, format);
      const item = res.data.items.find((item) => item.key === key);
      const itemPrice = formatMoney(item.final_line_price, format);

      document.querySelector("#total-price").textContent = totalPrice;
      document.querySelector(
        `[data-key="${key}"] .line-item-price`
      ).textContent = itemPrice;
    });
}
