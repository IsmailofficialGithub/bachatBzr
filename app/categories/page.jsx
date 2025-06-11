"use client"
import Layout from '@/components/layout/Layout'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import '@/public/assets/css/tailwind-cdn.css'
import { useRouter } from 'next/navigation'


const AllCategories = () => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const router=useRouter()

  const fetchingCategories = async () => {
    setLoading(true)
    try {
      const response = await axios.get('/api/categories')
      if (response.data.success) {
        setCategories(response.data.data)
      }
    } catch (error) {
      console.error(error)
      toast.error('Error fetching categories')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchingCategories()
  }, [])

  // Function to generate a random color for category boxes
  const getRandomColor = (index) => {
    const colors = [
      'bg-blue-100 border-blue-300',
      'bg-green-100 border-green-300',
      'bg-yellow-100 border-yellow-300',
      'bg-purple-100 border-purple-300',
      'bg-pink-100 border-pink-300',
      'bg-indigo-100 border-indigo-300',
      'bg-red-100 border-red-300',
      'bg-teal-100 border-teal-300',
      'bg-orange-100 border-orange-300',
    ]
    return colors[index % colors.length]
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">All Categories</h1>
          <button
            onClick={fetchingCategories}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Refresh Categories
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="border rounded-lg p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <div 
              
              onClick={()=>{router.push(`/category/${category.name}`)}}

                key={category.id}
                className={`border rounded-lg p-6 transition-all cursor-pointer hover:shadow-md  ${getRandomColor(index)}`}
              >
                <h3 className="text-xl font-semibold mb-2 text-gray-800">
                  {category.name}
                 
                </h3>
                {category.description && (
                  <p className="text-gray-600 mb-3">{category.description}</p>
                )}
               
              </div>
            ))}
          </div>
        )}

        {!loading && categories.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No categories found</p>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default AllCategories
