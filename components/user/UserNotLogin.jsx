
import theme from '@/data.js'
const UserNotLogin = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] p-6">
    <div className="text-center max-w-md mx-auto">
      {/* Illustration */}
      <div className="mb-8">
        <svg 
          className="w-40 h-40 mx-auto" 
          viewBox="0 0 200 200" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="100" cy="100" r="80" fill={theme.color.secondary} stroke={theme.color.primary} strokeWidth="8"/>
          <circle cx="100" cy="80" r="30" fill={theme.color.primary}/>
          <path 
            d="M100 120C120 120 140 140 140 160H60C60 140 80 120 100 120Z" 
            fill={theme.color.primary}
          />
          <path 
            d="M60 70L80 60M140 70L120 60" 
            stroke={theme.color.primary} 
            strokeWidth="4" 
            strokeLinecap="round"
          />
        </svg>
      </div>
  
      {/* Message */}
      <h2 className="text-2xl md:text-3xl font-bold mb-3" style={{ color: theme.color.primary }}>
        Please Sign In
      </h2>
      <p className="text-gray-600 mb-8">
        Access your personalized dashboard by logging in to your account
      </p>
  
      {/* Login Button */}
      <a
        href="/authentication" 
        className="inline-block px-8 py-3 rounded-lg font-medium text-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
        style={{ 
          backgroundColor: theme.color.primary,
          boxShadow: `0 4px 14px ${theme.color.primary}40`
        }}
      >
        Go to Login Page
      </a>
  
      {/* Signup Link */}
      <p className="mt-6 text-gray-600">
        Don't have an account?{' '}
        <a 
          href="/authentication" 
          className="font-medium hover:underline"
          style={{ color:'#d51243' }}
        >
          Sign up
        </a>
      </p>
    </div>
  </div>
  )
}

export default UserNotLogin