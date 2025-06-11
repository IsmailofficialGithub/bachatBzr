// components/InitCategories.js
'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories } from '@/features/categoriesSlice';

export default function InitCategories() {
  const dispatch = useDispatch();
  const loadedOnce = useSelector((state) => state.categories.loadedOnce);

  useEffect(() => {
    if (!loadedOnce) {
      dispatch(fetchCategories());
    }
  }, [loadedOnce, dispatch]);

  return null; // nothing visible
}
