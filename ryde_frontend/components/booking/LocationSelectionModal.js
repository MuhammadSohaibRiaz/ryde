"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { MapPin, X, ArrowLeft } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Loader } from "@googlemaps/js-api-loader"
import { MAPS_CONFIG } from "@/components/map/maps"

const RECENT_LOCATIONS_KEY = "recent_locations"

function getRecentLocations() {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem(RECENT_LOCATIONS_KEY)
  return stored ? JSON.parse(stored) : []
}

function addRecentLocation(location) {
  if (typeof window === "undefined") return
  const recent = getRecentLocations()
  const updated = [location, ...recent.filter((loc) => loc.address !== location.address)].slice(0, 5)
  localStorage.setItem(RECENT_LOCATIONS_KEY, JSON.stringify(updated))
}

export default function LocationSelectionModal({ isOpen, onClose, onSelect, type, initialLocation = null }) {
  const [mode, setMode] = useState("search")
  const [searchQuery, setSearchQuery] = useState("")
  const [suggestions, setSuggestions] = useState([])
  const mapRef = useRef(null)
  const centerMarkerRef = useRef(null)
  const googleRef = useRef(null)
  const mapInstanceRef = useRef(null)

  // Initialize Google Maps API
  useEffect(() => {
    if (!isOpen) return

    const loader = new Loader({
      apiKey: MAPS_CONFIG.apiKey,
      version: "weekly",
      libraries: MAPS_CONFIG.libraries,
    })

    loader
      .load()
      .then((google) => {
        googleRef.current = google
      })
      .catch((error) => {
        console.error("Error loading Google Maps:", error)
      })

    return () => {
      // Cleanup map instance and marker when modal closes
      if (centerMarkerRef.current) {
        centerMarkerRef.current.setMap(null)
        centerMarkerRef.current = null
      }
      if (mapInstanceRef.current) {
        mapInstanceRef.current = null
      }
      if (mapRef.current) {
        mapRef.current.innerHTML = ""
      }
    }
  }, [isOpen])

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setMode("search")
      setSearchQuery(initialLocation?.address || "")
      setSuggestions([])
    }
  }, [isOpen, initialLocation])

  const handleSearch = useCallback(async (query) => {
    if (!query.trim() || !googleRef.current) return

    try {
      const autocomplete = new googleRef.current.maps.places.AutocompleteService()
      const predictions = await new Promise((resolve, reject) => {
        autocomplete.getPlacePredictions(
          {
            input: query,
            componentRestrictions: { country: "uk" },
            location: new googleRef.current.maps.LatLng(MAPS_CONFIG.defaultCenter),
            radius: 50000,
          },
          (results, status) => {
            if (status === "OK") resolve(results)
            else reject(new Error("Location search failed"))
          },
        )
      })
      setSuggestions(predictions)
    } catch (error) {
      console.error("Location search error:", error)
      setSuggestions([])
    }
  }, [])

  const initializeMap = useCallback(() => {
    if (!mapRef.current || !googleRef.current) return

    const initialPosition = initialLocation?.coordinates || MAPS_CONFIG.defaultCenter

    // Create new map instance
    const mapInstance = new googleRef.current.maps.Map(mapRef.current, {
      center: initialPosition,
      zoom: initialLocation ? 16 : MAPS_CONFIG.defaultZoom,
      ...MAPS_CONFIG.mapOptions,
    })

    // Create center marker
    const centerMarker = new googleRef.current.maps.Marker({
      position: mapInstance.getCenter(),
      map: mapInstance,
      icon: {
        path: googleRef.current.maps.SymbolPath.CIRCLE,
        scale: 10,
        fillColor: "#FFA500",
        fillOpacity: 1,
        strokeWeight: 2,
        strokeColor: "#FFFFFF",
      },
    })

    // Update marker position when map is dragged
    mapInstance.addListener("center_changed", () => {
      centerMarker.setPosition(mapInstance.getCenter())
    })

    // Store references
    mapInstanceRef.current = mapInstance
    centerMarkerRef.current = centerMarker
  }, [initialLocation])

  // Initialize map when switching to map mode
  useEffect(() => {
    if (mode === "map" && googleRef.current) {
      // Clean up previous instances
      if (centerMarkerRef.current) {
        centerMarkerRef.current.setMap(null)
        centerMarkerRef.current = null
      }
      if (mapRef.current) {
        mapRef.current.innerHTML = ""
      }

      // Initialize new map
      initializeMap()
    }
  }, [mode, initializeMap])

  const handleBack = useCallback(() => {
    if (mode === "map") {
      setMode("search")
    } else {
      onClose()
    }
  }, [mode, onClose])

  const handleMapSelect = useCallback(() => {
    if (!mapInstanceRef.current || !centerMarkerRef.current || !googleRef.current) return

    const position = centerMarkerRef.current.getPosition()
    const geocoder = new googleRef.current.maps.Geocoder()

    geocoder.geocode({ location: { lat: position.lat(), lng: position.lng() } }, (results, status) => {
      if (status === "OK" && results[0]) {
        const location = {
          address: results[0].formatted_address,
          coordinates: {
            lat: position.lat(),
            lng: position.lng(),
          },
        }
        addRecentLocation(location)
        onSelect(location)
        onClose()
      } else {
        console.error("Geocode was not successful for the following reason: " + status)
      }
    })
  }, [onSelect, onClose])

  const handleLocationSelect = useCallback(
    (place) => {
      if (!googleRef.current) return

      const placesService = new googleRef.current.maps.places.PlacesService(document.createElement("div"))
      placesService.getDetails(
        {
          placeId: place.place_id,
          fields: ["formatted_address", "geometry"],
        },
        (placeDetails, status) => {
          if (status === "OK" && placeDetails.geometry) {
            const location = {
              address: placeDetails.formatted_address,
              coordinates: {
                lat: placeDetails.geometry.location.lat(),
                lng: placeDetails.geometry.location.lng(),
              },
            }
            addRecentLocation(location)
            onSelect(location)
            onClose()
          }
        },
      )
    },
    [onSelect, onClose],
  )

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-white z-50"
        >
          {mode === "search" ? (
            <div className="h-full flex flex-col">
              <div className="p-4 border-b flex items-center gap-4">
                <button onClick={handleBack} className="p-1 hover:bg-gray-100 rounded-full">
                  <ArrowLeft className="w-6 h-6" />
                </button>
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder={`Enter ${type === "pickup" ? "pickup" : "dropoff"} location`}
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value)
                      handleSearch(e.target.value)
                    }}
                    className="w-full p-2 outline-none text-lg"
                    autoFocus
                  />
                </div>
              </div>

              <div className="flex-1 overflow-auto">
                <button
                  onClick={() => setMode("map")}
                  className="w-full p-4 flex items-center gap-3 hover:bg-gray-50 border-b"
                >
                  <div className="w-10 h-10 rounded-full bg-[#FFA500]/10 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-[#FFA500]" />
                  </div>
                  <span className="font-medium">Choose on map</span>
                </button>

                {getRecentLocations().length > 0 && searchQuery.length === 0 && (
                  <div className="border-b">
                    <div className="p-4 text-sm text-gray-500">Recent Locations</div>
                    {getRecentLocations().map((location, index) => (
                      <button
                        key={index}
                        onClick={() => onSelect(location)}
                        className="w-full p-4 flex items-center gap-3 hover:bg-gray-50 border-b"
                      >
                        <MapPin className="w-5 h-5 text-gray-400" />
                        <div className="text-left">
                          <p className="font-medium">{location.address}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {suggestions.map((place) => (
                  <button
                    key={place.place_id}
                    onClick={() => handleLocationSelect(place)}
                    className="w-full p-4 flex items-center gap-3 hover:bg-gray-50 border-b"
                  >
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <div className="text-left">
                      <p className="font-medium">{place.structured_formatting.main_text}</p>
                      <p className="text-sm text-gray-500">{place.structured_formatting.secondary_text}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col">
              <div className="flex-1 relative">
                <div ref={mapRef} className="w-full h-full" />
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <MapPin className="w-8 h-8 text-[#FFA500] -mb-8" />
                </div>
                <button onClick={handleBack} className="absolute top-4 left-4 p-2 bg-white rounded-full shadow-lg">
                  <ArrowLeft className="w-6 h-6" />
                </button>
              </div>
              <div className="p-4 bg-white border-t">
                <button
                  onClick={handleMapSelect}
                  className="w-full py-4 bg-[#FFA500] text-white rounded-full font-medium hover:bg-[#FFD700] transition-colors"
                >
                  Confirm Location
                </button>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

