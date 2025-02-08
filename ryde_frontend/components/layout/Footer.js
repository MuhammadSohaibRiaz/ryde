export default function Footer() {
    return (
      <footer className="py-4 mt-auto text-center bg-gray-100">
        <div className="flex justify-center gap-4 mb-2">
          <a href="/admin" className="text-gray-600 hover:text-gray-900">
            Admin Dashboard
          </a>
          <a href="/register-driver" className="text-gray-600 hover:text-gray-900">
            Become a Driver
          </a>
          <a href="/terms" className="text-gray-600 hover:text-gray-900">
            Terms
          </a>
          <a href="/privacy" className="text-gray-600 hover:text-gray-900">
            Privacy
          </a>
          <a href="/safety" className="text-gray-600 hover:text-gray-900">
            Safety
          </a>
        </div>
        <p className="text-sm text-gray-500">© 2023 Ryde5. All rights reserved.</p>
      </footer>
    )
  }
  
  