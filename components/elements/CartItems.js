'use client'
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import {  deleteCart } from "@/features/shopSlice";
import { applyDiscount } from "@/lib/discountHandler";
import { Button } from "../ui/button";

const CartItems = () => {
    const { cart } = useSelector((state) => state.shop) || {};
    const dispatch = useDispatch();

    // delete cart item
    const deleteCartHandler = (id) => {
        dispatch(deleteCart(id));
    };

    return (
        <>
            {cart?.map((item) => (
                <tr className="cart-item" key={item._id}>
                    <td className="product-thumbnail">
                        <Link href={`/shop/${item._id}`}>
                            <img 
                            src={`${item.images?.[0]}`} alt="cart added product" />
                        </Link>
                    </td>

                    <td className="product-name">
                        <Link href={`/shop/${item._id}`}>
                            {item.name}
                        </Link>
                    </td>

                    <td className="product-price">
                        {item.discounted_price &&<p>PKR {applyDiscount(item.price,item.discounted_price)}</p>}
                        <p className={item.discounted_price&& 'line-through'}>PKR {item.price}</p>
                    </td>

                    <td className="product-remove">
                        <Button variant="secondary"
                            onClick={() => deleteCartHandler(item?._id)}
                            className="remove"
                        >
                            <span className="flaticon-dustbin">Remove</span>
                        </Button>
                    </td>
                </tr>
            ))}
        </>
    );
};

export default CartItems;
