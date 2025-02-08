import React from "react"

const Input = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <input
      className={`block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm ${className}`}
      ref={ref}
      {...props}
    />
  )
})

Input.displayName = "Input"

export { Input }

