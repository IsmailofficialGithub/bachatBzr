"use client";
import { useCallback, useRef, useState } from "react";
import Link from "next/link";
import MobileMenu from "./MobileMenu";
import { useRouter } from "next/navigation";
import axios from "axios";

const debounce = (func, delay) => {
  const timer = useRef(null);

  return (...args) => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

export default function Sidebar({ isMobileMenu, handleMobileMenu }) {
  const router = useRouter();
  const [suggestions, setSuggestions] = useState([]);
  const [query, setQuery] = useState("");

  const fetchSuggestions = async (searchTerm) => {
    if (!searchTerm) return setSuggestions([]);

    try {
      const res = await axios.get(
        `api/product/searchSuggestion?q=${searchTerm}`,
      );
      const result = res.data;

      if (result.success) {
        setSuggestions(result.data);
      } else {
        setSuggestions([]);
      }
    } catch (error) {
      console.error("Axios fetch error:", error.message);
      setSuggestions([]);
    }
  };

  const debouncedFetch = useCallback(debounce(fetchSuggestions, 500), []);

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    debouncedFetch(value);
  };

  const handleSearchClick = (e) => {
    e.preventDefault();
    query && router.push(`/shop?q=${query}`);
    setSuggestions([]);
  };

  return (
    <>
      <div className={`tpsideinfo ${isMobileMenu ? "tp-sidebar-opened" : ""}`}>
        <button className="tpsideinfo__close" onClick={handleMobileMenu}>
          Close
          <i className="fal fa-times ml-10" />
        </button>
        <div className="tpsideinfo__search text-center pt-35">
          <span className="tpsideinfo__search-title mb-20">
            What Are You Looking For?
          </span>
          <form action="#">
            <input
              type="text"
              placeholder="Search Products..."
              onChange={handleChange}
            />
            <button
              onClick={(event) => {
                handleSearchClick(event);
                handleMobileMenu();
              }}
            >
              <i className="fal fa-search" />
            </button>
            {suggestions.length > 0 && (
              <ul className="suggestion-list absolute bg-white border  p-2 rounded shadow z-[1000] w-full max-h-60 overflow-y-auto">
                {suggestions.map((item, idx) => (
                  <li
                    key={idx}
                    className="py-1 px-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      handleMobileMenu();
                      router.push(`/shop?q=${item}`);
                      setSuggestions([]);
                    }}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </form>
        </div>
        <div className="tpsideinfo__nabtab">
          <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
            <li className="nav-item" role="presentation">
              <button
                className="nav-link active"
                id="pills-home-tab"
                data-bs-toggle="pill"
                data-bs-target="#pills-home"
                type="button"
                role="tab"
                aria-controls="pills-home"
                aria-selected="true"
              >
                Menu
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className="nav-link"
                id="pills-profile-tab"
                data-bs-toggle="pill"
                data-bs-target="#pills-profile"
                type="button"
                role="tab"
                aria-controls="pills-profile"
                aria-selected="false"
              >
                Categories
              </button>
            </li>
          </ul>
          <div className="tab-content" id="pills-tabContent">
            <div
              className="tab-pane fade show active"
              id="pills-home"
              role="tabpanel"
              aria-labelledby="pills-home-tab"
              tabIndex={0}
            >
              <MobileMenu
                isSuggestion={suggestions.length > 0 ? true : false}
              />
            </div>
            <div
              className="tab-pane fade"
              id="pills-profile"
              role="tabpanel"
              aria-labelledby="pills-profile-tab"
              tabIndex={0}
            >
              <div className="tpsidebar-categories">
                <ul>
                  <li>
                    <Link href="/shop">Furniture</Link>
                  </li>
                  <li>
                    <Link href="/shop">Wooden</Link>
                  </li>
                  <li>
                    <Link href="/shop">Lifestyle</Link>
                  </li>
                  <li>
                    <Link href="/shop-2">Shopping</Link>
                  </li>
                  <li>
                    <Link href="/track">Track Product</Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="tpsideinfo__account-link">
          <Link href="/authentication">
            <i className="fal fa-user" /> Login / Register
          </Link>
        </div>
        <div className="tpsideinfo__wishlist-link">
          <Link href="/wishlist" target="_parent">
            <i className="fal fa-heart" /> Wishlist
          </Link>
        </div>
      </div>
      <div
        className={`body-overlay ${isMobileMenu ? "opened" : ""}`}
        onClick={handleMobileMenu}
      />
    </>
  );
}
