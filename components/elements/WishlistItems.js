'use client'
import { addCart } from "@/features/shopSlice"
import {  deleteWishlist } from "@/features/wishlistSlice"
import Link from "next/link"
import { useDispatch, useSelector } from "react-redux"

const WishlistItems = () => {
    const { wishlist } = useSelector((state) => state.wishlist) || {}

    const dispatch = useDispatch()

    const addToCart = (id) => {
        const item = wishlist?.find((item) => item._id === id)
        dispatch(addCart({ product: item }))
    }

    // delete cart item
    const deleteCartHandler = (id) => {
        dispatch(deleteWishlist(id))
    }

   

    return (
        <>
            {wishlist?.map((item) => (
                <tr className="cart-item" key={item._id}>
                    <td className="product-thumbnail">
                        <Link href={`/shop/${item._id}`}>
                            <img
                                src={`${item.images[0]}`} alt="cart added product" />
                        </Link>
                    </td>

                    <td className="product-name">
                        <Link href={`/shop/${item._id}`}>
                            {item.name}
                        </Link>
                    </td>

                    <td className="product-price">PKR{item.price}</td>


                    <td className="product-add-to-cart">
                        <a onClick={() => addToCart(item._id)} className="tp-btn tp-color-btn  tp-wish-cart banner-animation cursor-pointer" style={{cursor:"pointer"}}>Add To Cart</a>
                    </td>
                    <td className="product-remove">
                        <button
                            onClick={() => deleteCartHandler(item?._id)}
                            className="remove"
                        >
                            <span className="flaticon-dustbin">Remove</span>
                        </button>
                    </td>
                </tr>
            ))}
        </>
    )
}

export default WishlistItems
