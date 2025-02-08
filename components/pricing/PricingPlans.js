"use client"

import { Check, ChevronRight } from "lucide-react"

export default function PricingPlans({ onSelectPlan }) {
  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="max-w-screen-xl px-4 py-8 mx-auto lg:py-16 lg:px-6">
        <div className="max-w-screen-md mx-auto mb-8 text-center lg:mb-12">
          <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Choose Your Driver Plan
          </h2>
          <p className="mb-5 font-light text-gray-500 sm:text-xl dark:text-gray-400">
            Select the plan that best fits your driving goals. Upgrade or downgrade anytime.
          </p>
        </div>
        <div className="space-y-8 lg:grid lg:grid-cols-3 sm:gap-6 xl:gap-10 lg:space-y-0">
          {/* Silver Plan */}
          <div className="flex flex-col max-w-lg p-6 mx-auto text-center text-gray-900 bg-white border border-gray-100 rounded-lg shadow dark:border-gray-600 xl:p-8 dark:bg-gray-800 dark:text-white transition-transform duration-300 hover:scale-105 hover:shadow-lg">
            <div className="bg-gray-200 -mx-6 -mt-6 p-4 rounded-t-lg">
              <h3 className="text-2xl font-semibold text-gray-700">Silver Plan</h3>
            </div>
            <div className="flex items-baseline justify-center my-8">
              <span className="mr-2 text-5xl font-extrabold">$99</span>
              <span className="text-gray-500 dark:text-gray-400">/month</span>
            </div>
            <ul role="list" className="mb-8 space-y-4 text-left">
              <li className="flex items-center space-x-3">
                <Check className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" />
                <span>Up to 300 Trips</span>
              </li>
              <li className="flex items-center space-x-3">
                <Check className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" />
                <span>Basic Support Access</span>
              </li>
              <li className="flex items-center space-x-3">
                <Check className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" />
                <span>Access to city drives</span>
              </li>
              <li className="flex items-center space-x-3">
                <Check className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" />
                <span>Keep 80% of profits</span>
              </li>
              <li className="flex items-center space-x-3">
                <Check className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" />
                <span>10% off fuel</span>
              </li>
            </ul>
            <button
              onClick={() => onSelectPlan("silver")}
              className="text-white bg-gray-500 hover:bg-gray-600 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:text-white dark:focus:ring-gray-900 mt-auto"
            >
              Get Started - $99
            </button>
          </div>

          {/* Gold Plan */}
          <div className="flex flex-col max-w-lg p-6 mx-auto text-center text-gray-900 bg-white border border-gray-100 rounded-lg shadow dark:border-gray-600 xl:p-8 dark:bg-gray-800 dark:text-white transition-transform duration-300 hover:scale-105 hover:shadow-lg">
            <div className="bg-yellow-400 -mx-6 -mt-6 p-4 rounded-t-lg">
              <h3 className="text-2xl font-semibold text-gray-900">Gold Plan</h3>
            </div>
            <div className="flex items-baseline justify-center my-8">
              <span className="mr-2 text-5xl font-extrabold">$199</span>
              <span className="text-gray-500 dark:text-gray-400">/month</span>
            </div>
            <ul role="list" className="mb-8 space-y-4 text-left">
              <li className="flex items-center space-x-3">
                <Check className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" />
                <span>Up to 600 Trips</span>
              </li>
              <li className="flex items-center space-x-3">
                <Check className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" />
                <span>Priority Support Access</span>
              </li>
              <li className="flex items-center space-x-3">
                <Check className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" />
                <span>Access to city and suburban drives</span>
              </li>
              <li className="flex items-center space-x-3">
                <Check className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" />
                <span>Keep 90% of profits</span>
              </li>
              <li className="flex items-center space-x-3">
                <Check className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" />
                <span>15% off fuel</span>
              </li>
            </ul>
            <button
              onClick={() => onSelectPlan("gold")}
              className="text-gray-900 bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:text-gray-900 dark:focus:ring-yellow-900 mt-auto"
            >
              Get Started - $199
            </button>
          </div>

          {/* Diamond Plan */}
          <div className="flex flex-col max-w-lg p-6 mx-auto text-center text-gray-900 bg-white border border-gray-100 rounded-lg shadow dark:border-gray-600 xl:p-8 dark:bg-gray-800 dark:text-white transition-transform duration-300 hover:scale-105 hover:shadow-lg">
            <div className="bg-cyan-200 -mx-6 -mt-6 p-4 rounded-t-lg">
              <h3 className="text-2xl font-semibold text-gray-900">Diamond Plan</h3>
            </div>
            <div className="flex items-baseline justify-center my-8">
              <span className="mr-2 text-5xl font-extrabold">$299</span>
              <span className="text-gray-500 dark:text-gray-400">/month</span>
            </div>
            <ul role="list" className="mb-8 space-y-4 text-left">
              <li className="flex items-center space-x-3">
                <Check className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" />
                <span>Unlimited Trips</span>
              </li>
              <li className="flex items-center space-x-3">
                <Check className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" />
                <span>24/7 Dedicated Support</span>
              </li>
              <li className="flex items-center space-x-3">
                <Check className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" />
                <span>Access to all drive zones</span>
              </li>
              <li className="flex items-center space-x-3">
                <Check className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" />
                <span>VIP Trip Alerts</span>
              </li>
              <li className="flex items-center space-x-3">
                <Check className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" />
                <span>Keep 100% of profits</span>
              </li>
              <li className="flex items-center space-x-3">
                <Check className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" />
                <span>20% off fuel</span>
              </li>
            </ul>
            <button
              onClick={() => onSelectPlan("diamond")}
              className="text-gray-900 bg-cyan-200 hover:bg-cyan-300 focus:ring-4 focus:ring-cyan-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:text-gray-900 dark:focus:ring-cyan-900 mt-auto"
            >
              Get Started - $299
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

