"use client";
import Layout from "@/components/layout/Layout";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import { applyDiscount } from "@/lib/discountHandler";
import StripePayment from "@/app/components/stripPayment";
import { createOrder } from "@/lib/createorderApiCall";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import EmptyCart from "@/app/components/EmptyCart";
export default function Checkout() {
  const router=useRouter()
  const [totalAmount, setTotalAmount] = useState();
  const [cashOnDelivery, setCashOnDelivery] = useState(false);
  const [payment, setPayment] = useState('');
  const { cart } = useSelector((state) => state.shop) || {};
  const [session, setSession] = useState([]);
  const [message, setMessage] = useState("");
  const [loading,setLoading]=useState(false)
  const [orderDetails, setOrderDetails] = useState(null);
  const [address, setAddress] = useState({
    country: "pakistan",
    firstName: "",
    lastName: "",
    companyName: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    postcode: "",
    email: "",
    phone: "",
  });
  const [loginformData, setLoginFormData] = useState({
    email: "",
    password: "",
  });

  //calculate total amount
  const calculateTotals = (shippingfee = false) => {
    if (!cart || cart.length === 0) {
      return 0;
    }

    const productTotal = cart.reduce((total, product) => {
      // Use discounted_price if available and not null, otherwise use regular price
      const productPrice =
        product.discounted_price !== null &&
        product.discounted_price !== undefined
          ? applyDiscount(product.price, product.discounted_price)
          : product.price;

      // Multiply by quantity, default to 1 if not specified

      return total + productPrice;
    }, 0);

    // If we need to include the order fee, add $150 per product
    if (shippingfee) {
      const orderFee = cart.length * 150;
      return productTotal + orderFee;
    }
    return productTotal;
  };

  useEffect(()=>{
   if(cart.length<1 || cart===undefined){
    router.push(`/shop`);
   } 
  },[cart])
  useEffect(() => {
    if (cashOnDelivery) {
      setTotalAmount(calculateTotals(true) + 50);
    } else {
      setTotalAmount(calculateTotals(true));
    }
  }, [cashOnDelivery]);

  async function updateUserMetadata(e) {
e.preventDefault()
    if (session && address.email != "" && address.phone != "") {
      const {
        data: { user },
        error,
      } = await supabase.auth.updateUser({
        data: {
          address: address,
        },
      });

      if (error) {
        console.error("Error updating user metadata:", error);
      } else {
        toast.success("User address updated successfully");
      }
    } else {
      toast.error("Field incomplete");
    }
  }

  // storing email , password value onChange for login
  const handleLoginChange = (e) => {
    const { name, value } = e.target;

    // Update the state using the input's name attribute
    setLoginFormData({
      ...loginformData,
      [name]: value,
    });
  };
  //storing address details in address state while changing
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddress({
      ...address,
      [name]: value,
    });
  };
 

  //handle place order
  const handleAddOrder = async (e) => {
    e.preventDefault();
    setLoading(true)
    try {
      const errors = [];
    const requiredFields = [
      "firstName",
      "lastName",
      "postcode",
      "state",
      "address",
      "city",
      "email",
      "phone",
    ];
    if (!cashOnDelivery) {
      return;
    }
    const missingFields = requiredFields.filter((field) => !address[field]);

    if (missingFields.length > 0) {
      errors.push(
        `Please fill in the following fields: ${missingFields.join(", ")}`,
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (address.email && !emailRegex.test(address.email)) {
      errors.push("Please enter a valid email address");
    }

    const phoneRegex = /^\d{11}$/;
    if (address.phone && !phoneRegex.test(address.phone)) {
      errors.push("Phone number must contain exactly 11 digits");
    }

    if (!payment) {
      errors.push("Please select a payment method");
    }

    if (errors.length > 0) {
      toast.error(errors.join("\n"));
      return;
    }
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      toast.error("Please login to continue");
      return;
    }
    
 await createOrder(orderDetails);
   router.push(`/user/orders`) 
      
    } catch (error) {
      toast.error("Internel server Error")
    }finally{
 setLoading(false)
    }

  };

  // handleLoginSubmit
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginformData.email,
        password: loginformData.password,
      });
      if (error) {
        toast.error(error.message);
        setMessage({ text: `Failed , ${error.message}`, status: "error" });
      } else {
        toast.success("Login successful!");
        // Check if email is confirmed
        if (data.user.user_metadata?.email_verified === false) {
          // Send a new OTP for verification
          await supabase.auth.signInWithOtp({
            email,
            options: { shouldCreateUser: false },
          });
          setMessage({
            text: `Your email is not verified. A new verification Link has been sent on your email : ${email}`,
            status: "error",
          });
        } else {
          setLoginToggle(false);
        }
      }
    } catch (error) {
      toast.error("SomeThing wents wrong while login");
    }
  };

  const [isLoginToggle, setLoginToggle] = useState(false);
  const handleLoginToggle = () => setLoginToggle(!isLoginToggle);

  const [isCuponToggle, setCuponToggle] = useState(false);
  const handleCuponToggle = () => setCuponToggle(!isCuponToggle);

  const [isCboxToggle, setCboxToggle] = useState(false);
  const handleCboxToggle = () => setCboxToggle(!isCboxToggle);

  const [isShipToggle, setShipToggle] = useState(false);
  const handleShipToggle = () => setShipToggle(!isShipToggle);

  const [isActive, setIsActive] = useState({
    status: false,
    key: 0,
  });

  const handleClick = (key) => {
    if (key != 1) {
      setTotalAmount(calculateTotals(true));
      setCashOnDelivery(false);
    }

    if (isActive.key === key) {
      setIsActive({
        status: false,
      });
    } else {
      setIsActive({
        status: true,
        key,
      });
    }
  };

  
  useEffect(() => {
    console.log(cart,"cart")
    setOrderDetails({
      user_id: session?.user?.id,
      Receiver: `${address.firstName} ${address.lastName}`,
      product_ids: cart.map((item) => item._id),
      payment_method: cashOnDelivery?"cash_on_delivery":'card',
      delivery_address: address,
      phone: address.phone,
    });
  }, [session, address, cart,cashOnDelivery]);

  // getting session
  useEffect(() => {
    const gettingSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (data) {
        setSession(data.session);
        if (data?.session?.user.user_metadata.address) {
          setAddress(data.session.user.user_metadata.address);
        }
      } else {
        setLoginToggle(true);
      }
    };
    gettingSession();
  }, []);
 if (cart.length < 1 || cart === undefined) {
  return (
    <Layout headerStyle={3} footerStyle={1} breadcrumbTitle="Checkout">
      <EmptyCart />
    </Layout>
  );
}

  return (
    <>
      <Layout headerStyle={3} footerStyle={1} breadcrumbTitle="Checkout">
        <div>
          <section
            className="coupon-area pt-80 pb-30 wow fadeInUp"
            data-wow-duration=".8s"
            data-wow-delay=".2s"
          >
            <div className="container">
              <div className="row">
                <div className="col-md-6">
                  <div className="coupon-accordion">
                    {/* ACCORDION START */}
                    <h3>
                      Returning customer?{" "}
                      {session ? (
                        `Wellcome ${session?.user?.user_metadata.email}`
                      ) : (
                        <span id="showlogin" onClick={handleLoginToggle}>
                          Click here to login
                        </span>
                      )}
                    </h3>
                    <div
                      id="checkout-login"
                      className="coupon-content"
                      style={{ display: `${isLoginToggle ? "block" : "none"}` }}
                    >
                      <div className="coupon-info">
                        <p className="coupon-text">
                          To create order you have to first login ...
                        </p>
                        <form action="#">
                          <p className="form-row-first">
                            <label>
                              Email <span className="required">*</span>
                            </label>
                            <input
                              type="text"
                              name="email"
                              onChange={handleLoginChange}
                            />
                          </p>
                          <p className="form-row-last">
                            <label>
                              Password <span className="required">*</span>
                            </label>
                            <input
                              type="text"
                              name="password"
                              onChange={handleLoginChange}
                            />
                          </p>
                          <p className="form-row">
                            <button
                              onClick={handleLoginSubmit}
                              className="tp-btn tp-color-btn"
                              type="submit"
                            >
                              Login
                            </button>
                            <label>
                              <input type="checkbox" />
                              Remember me
                            </label>
                          </p>
                          <p className="lost-password">
                            <Link href="">Forget password?</Link>
                          </p>
                        </form>
                      </div>
                    </div>
                    {/* ACCORDION END */}
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="coupon-accordion">
                    {/* ACCORDION START */}
                    <h3>
                      Have a coupon?{" "}
                      <span id="showcoupon" onClick={handleCuponToggle}>
                        Click here to enter your code
                      </span>
                    </h3>
                    <div
                      id="checkout_coupon"
                      className="coupon-checkout-content"
                      style={{ display: `${isCuponToggle ? "block" : "none"}` }}
                    >
                      <div className="coupon-info">
                        <form action="#">
                          <p className="checkout-coupon">
                            <input type="text" placeholder="Coupon Code" />
                            <button
                              className="tp-btn tp-color-btn"
                              type="submit"
                            >
                              Apply Coupon
                            </button>
                          </p>
                        </form>
                      </div>
                    </div>
                    {/* ACCORDION END */}
                  </div>
                </div>
              </div>
            </div>
          </section>
          {/* coupon-area end */}
          {/* checkout-area start */}
          <section
            className="checkout-area pb-50 wow fadeInUp"
            data-wow-duration=".8s"
            data-wow-delay=".2s"
          >
            <div className="container">
              <form action="#">
                <div className="row">
                  <div className="col-lg-6 col-md-12">
                    <div className="checkbox-form">
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "rowReverse",
                        }}
                      >
                        <h3>Billing Details </h3>

                        {session?.user?.user_metadata.address && (
                          <span
                            style={{
                              textDecoration: "underline blue",
                              marginLeft: "2rem",
                              cursor: "pointer",
                            }}
                            onClick={() => {
                              setAddress({
                                country: "pakistan",
                                firstName: "",
                                lastName: "",
                                companyName: "",
                                address: "",
                                apartment: "",
                                city: "",
                                state: "",
                                postcode: "",
                                email: "",
                                phone: "",
                              });
                            }}
                          >
                            Clear
                          </span>
                        )}
                      </div>
                      <div className="row">
                        <div className="col-md-12">
                          <div className="country-select">
                            <label>
                              Country <span className="required">*</span>
                            </label>
                            <select
                              name="country"
                              value={address.country}
                              onChange={handleAddressChange}
                            >
                              <option value="pakistan">Pakistan</option>
                            </select>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="checkout-form-list">
                            <label>
                              First Name <span className="required">*</span>
                            </label>
                            <input
                              type="text"
                              name="firstName"
                              value={address.firstName}
                              onChange={handleAddressChange}
                              required
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="checkout-form-list">
                            <label>
                              Last Name <span className="required">*</span>
                            </label>
                            <input
                              type="text"
                              name="lastName"
                              value={address.lastName}
                              onChange={handleAddressChange}
                              required
                            />
                          </div>
                        </div>
                        <div className="col-md-12">
                          <div className="checkout-form-list">
                            <label>Company Name</label>
                            <input
                              type="text"
                              name="companyName"
                              value={address.companyName}
                              onChange={handleAddressChange}
                            />
                          </div>
                        </div>
                        <div className="col-md-12">
                          <div className="checkout-form-list">
                            <label>
                              Address <span className="required">*</span>
                            </label>
                            <input
                              type="text"
                              name="address"
                              value={address.address}
                              onChange={handleAddressChange}
                              placeholder="Street address"
                              required
                            />
                          </div>
                        </div>
                        <div className="col-md-12">
                          <div className="checkout-form-list">
                            <input
                              type="text"
                              name="apartment"
                              value={address.apartment}
                              onChange={handleAddressChange}
                              placeholder="Apartment, suite, unit etc. (optional)"
                            />
                          </div>
                        </div>
                        <div className="col-md-12">
                          <div className="checkout-form-list">
                            <label>
                              Town / City <span className="required">*</span>
                            </label>
                            <input
                              type="text"
                              name="city"
                              value={address.city}
                              onChange={handleAddressChange}
                              placeholder="Town / City"
                              required
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="checkout-form-list">
                            <label>
                              State / County <span className="required">*</span>
                            </label>
                            <input
                              type="text"
                              name="state"
                              value={address.state}
                              onChange={handleAddressChange}
                              required
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="checkout-form-list">
                            <label>
                              Postcode / Zip <span className="required">*</span>
                            </label>
                            <input
                              type="text"
                              name="postcode"
                              value={address.postcode}
                              onChange={handleAddressChange}
                              placeholder="Postcode / Zip"
                              required
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="checkout-form-list">
                            <label>
                              Email Address <span className="required">*</span>
                            </label>
                            <input
                              type="email"
                              name="email"
                              value={address.email}
                              onChange={handleAddressChange}
                              required
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="checkout-form-list">
                            <label>
                              Phone <span className="required">*</span>
                            </label>
                            <input
                              type="text"
                              name="phone"
                              value={address.phone}
                              onChange={handleAddressChange}
                              placeholder="Phone number"
                              required
                            />
                          </div>
                        </div>

                        {session ? (
                          <Button
                            style={{ width: "30%", marginBottom: "2rem" }}
                            variant="secondary"
                            onClick={updateUserMetadata}
                          >
                            Update
                          </Button>
                        ) : (
                          <>
                            <p>
                              No account yet? Sign up and complete your order!
                            </p>
                            <Link
                              href={"/authentication"}
                              style={{ marginBottom: "3rem" }}
                            >
                              {" "}
                              <Button> SignUp Now</Button>
                            </Link>
                          </>
                        )}
                      </div>

                      <div className="different-address">
                        <div className="order-notes">
                          <div className="checkout-form-list">
                            <label>Order Notes</label>
                            <textarea
                              id="checkout-mess"
                              cols={30}
                              rows={10}
                              placeholder="Notes about your order, e.g. special notes for delivery."
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-12">
                    <div className="your-order mb-30 ">
                      <h3>Your order</h3>
                      <div className="your-order-table table-responsive">
                        <table>
                          <thead>
                            <tr>
                              <th
                                className="product-name"
                              >
                                Product
                              </th>
                              <th className="product-total">Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            {cart?.map((item) => (
                              <tr className="cart_item">
                                <td className="product-name">
                                  {item.name}{" "}
                                  <strong className="product-quantity">
                                    {" "}
                                    × 1
                                  </strong>
                                </td>
                                <td className="product-total">
                                  <span className="amount">
                                    PKR{" "}
                                    {item.discounted_price
                                      ? applyDiscount(
                                          item.price,
                                          item.discounted_price,
                                        )
                                      : item.price}
                                  </span>
                                  <span> + [150 PKR shipping fee]</span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot>
                            <tr className="cart-subtotal">
                              <th>Cart Subtotal</th>
                              <td>
                                <span className="amount">
                                  PKR {calculateTotals(false)}
                                </span>
                              </td>
                            </tr>
                            <tr className="shipping">
                              <th>Shipping</th>
                              <td>
                                <ul>
                                  <li>
                                    <label>
                                      Flat Rate:{" "}
                                      <span className="amount">
                                        {cart.length * 150}
                                      </span>
                                    </label>
                                  </li>
                                </ul>
                              </td>
                            </tr>
                            <tr className="order-total">
                              <th>Order Total</th>
                              <td>
                                <strong>
                                  {/* start from here */}
                                  <span className="amount">
                                    PKR{" "}
                                    {totalAmount !== 0
                                      ? totalAmount
                                      : calculateTotals(true)}
                                  </span>
                                </strong>
                              </td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                      <div className="payment-method">
                        <h3>Select Payment method</h3>

                        <div className="accordion" id="checkoutAccordion">
                          {/* Cash on delivery */}
                          <div className="accordion-item">
                            <div className="accordion-body">
                              <input
                                type="checkbox"
                                id="cashOnDelivery"
                                value="cash_on_delivery"
                                checked={isActive.key === 1}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setCashOnDelivery(true);
                                    setPayment(e.target.value);
                                    setTotalAmount(calculateTotals(true) + 50);
                                  } else {
                                    setCashOnDelivery(false);
                                    setTotalAmount(calculateTotals(true));
                                  }
                                  handleClick(1);
                                }}
                              />{" "}
                              <label htmlFor="cashOnDelivery">
                                {" "}
                                Cash on Delivery [50 PKR Service Fee]
                              </label>
                            </div>
                          </div>

                                                 {/* card payment */}
                          <div className="accordion-item">
                            <input
                              type="checkbox"
                              id="onlinePayment"
                              value="card"
                              checked={isActive.key === 2}
                              onChange={(e) => {handleClick(2); setPayment(e.target.value);}}
                            />{" "}
                            <label htmlFor="onlinePayment">Card Payment</label>
                            <div
                              id="bankOne"
                              className={
                                isActive.key === 2
                                  ? "accordion-collapse collapse show"
                                  : "accordion-collapse collapse"
                              }
                            >
                              <div className="accordion-body">
                                <div
                                  className="accordion-body flex content-center"
                                  style={{
                                    display: "flex",
                                    justifyContent: "center",
                                  }}
                                >
                                  {isActive.key === 2 &&
                                    (orderDetails ? (
                                      <StripePayment
                                        amount={totalAmount}
                                        orderDetails={orderDetails}
                                      />
                                    ) : (
                                      <p>Gethering data for order...</p>
                                    ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>


                        {/* </div> */}
                        {cashOnDelivery ? (
                          <div className="order-button-payment mt-20">
                            <button

                            disabled={session?false:true}
                              onClick={handleAddOrder}
                              className="tp-btn tp-color-btn w-100 banner-animation"
                              style={{cursor:"pointer"}}
                            >
                              {loading?<Loader className="animate-spin"/>:session?"Place order":"Please login"}
                            </button>
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </section>
        </div>
      </Layout>
    </>
  );
}
