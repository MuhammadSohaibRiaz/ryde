"use client"

import { useState } from "react"
import { Calendar, Clock, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import PaymentForm from "./Paymentform"


export default function PaymentModal({ isOpen, onClose }) {
  return (
    <AnimatePresence>
      {
        isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="bg-white rounded-2xl  w-full max-w-md overflow-hidden"
            >
              <div className="p-4 border-b flex items-center justify-between">
                <h2 className="text-lg font-semibold">Schedule Ride</h2>
                <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <PaymentForm />
            </motion.div>
          </motion.div>
        )
      }
    </AnimatePresence>
  )
}
