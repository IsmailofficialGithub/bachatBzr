export const NewOrdertoAdmin = (orderId, products = [], totalPrice) => {
  const productsHtml = products.map(
    (item) => `<li>${item.name} - PKR ${item.price}</li>`
  ).join("");
  const trackUrl = `${process.env.NEXT_PUBLIC_API_URL}/order/${orderId}`;
  return `
      <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f9f9f9;
          padding: 20px;
          color: #333;
        }
        .container {
          max-width: 600px;
          margin: auto;
          background: #ffffff;
          padding: 30px;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
        }
        .logo {
          text-align: center;
          margin-bottom: 20px;
        }
        .logo img {
          max-width: 150px;
        }
        h2 {
          color: #4CAF50;
        }
        ul {
          padding-left: 20px;
        }
        .btn {
          display: inline-block;
          margin-top: 20px;
          padding: 12px 24px;
          background-color: #4CAF50;
          color: white;
          text-decoration: none;
          border-radius: 5px;
        }
        .footer {
          margin-top: 30px;
          text-align: center;
          font-size: 13px;
          color: #777;
        }
        a {
          color: #4CAF50;
          text-decoration: none;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">
          <img src="https://res.cloudinary.com/dzkoeyx3s/image/upload/v1750419010/Bachat_2_tap7mv.png" alt="BachatBzr Logo">
        </div>
        <h2>🛍️ New Order !</h2>
        <p>SomeOne created a order . Let start work.</p>

        <p><strong>Order ID:</strong> ${orderId}</p>
        <p>This is  order ID to track new order.</p>

        <h3>🛍️ Products Ordered:</h3>
        <ul>${productsHtml}</ul>

        <h4>💵 Total Price: Rs.${totalPrice}</h4>

        <a href="${trackUrl}" style="background: #007BFF; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
      Track Order
    </a>

        <p style="margin-top: 30px;">Please start working on product to send order to customer</p>

        <div class="footer">&copy; ${new Date().getFullYear()} BachatBzr. All rights reserved.</div>
      </div>
    </body>
    </html>
  `;
};
