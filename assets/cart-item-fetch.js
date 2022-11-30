// fetch("/cart.js")
//   .then((res) => res.json())
//   .then((data) => {
//     console.log("cart-data", data);

//     if (data.items.length > 0) {
//       data.items.forEach((prod, index) => {
//         document.querySelector("#drawer-items").innerHTML +=
//           '<img class="drawer-img" src="' +
//           prod.featured_image.url +
//           '" alt="' +
//           prod.featured_image.url +
//           '"><h5>' +
//           prod.title +
//           "</h5><p>" +
//           prod.quantity +
//           "x" +
//           prod.line_price +
//           "</p>";
//       });
//     } else {
//       document.querySelector("#drawer-items").innerHTML =
//         "<p>Cart is Empty</p>";
//       document
//         .querySelector("#drawer-checkout-btn")
//         .setAttribute("disabled", "disabled");
//       document.querySelector("#drawer-checkout-btn").style.pointerEvents =
//         "none";
//     }

//     document.querySelector("#drawer_amount").innerHTML = data.total_price;
//   });
