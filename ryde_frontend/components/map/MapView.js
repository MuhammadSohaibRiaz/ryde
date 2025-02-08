"use client"

import { useEffect, useRef, useState } from "react"
import { Loader } from "@googlemaps/js-api-loader"
import { MAPS_CONFIG } from "./maps"

export default function MapView({
  onRouteCalculated,
  onError,
  pickup,
  dropoff,
  bookingState,
  driverLocation,
  userLocation,
}) {
  const mapRef = useRef(null)
  const [map, setMap] = useState(null)
  const markersRef = useRef({
    pickup: null,
    dropoff: null,
    driver: null,
    cars: [],
  })
  const routeRef = useRef(null)
  const animationRef = useRef(null)

  useEffect(() => {
    if (!mapRef.current) return

    const loader = new Loader({
      apiKey: MAPS_CONFIG.apiKey,
      version: "weekly",
      libraries: MAPS_CONFIG.libraries,
    })

    loader.load().then((google) => {
      const mapInstance = new google.maps.Map(mapRef.current, {
        center: MAPS_CONFIG.defaultCenter,
        zoom: MAPS_CONFIG.defaultZoom,
        ...MAPS_CONFIG.mapOptions,
      })

      setMap(mapInstance)

      // Initialize simulated cars
      const cars = []
      for (let i = 0; i < 8; i++) {
        const position = {
          lat: MAPS_CONFIG.defaultCenter.lat + (Math.random() - 0.5) * 0.1,
          lng: MAPS_CONFIG.defaultCenter.lng + (Math.random() - 0.5) * 0.1,
        }
        const car = new google.maps.Marker({
          position,
          map: mapInstance,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: "#4CAF50",
            fillOpacity: 0.8,
            strokeWeight: 2,
            strokeColor: "#FFFFFF",
          },
        })
        cars.push(car)
      }
      markersRef.current.cars = cars

      // Animate cars
      setInterval(() => {
        cars.forEach((car) => {
          const currentPos = car.getPosition()
          const newPos = {
            lat: currentPos.lat() + (Math.random() - 0.5) * 0.002,
            lng: currentPos.lng() + (Math.random() - 0.5) * 0.002,
          }
          car.setPosition(newPos)
        })
      }, 3000)
    })

    return () => {
      markersRef.current.cars.forEach((car) => car.setMap(null))
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (!map || !pickup || !dropoff) return

    // Clear existing markers and route
    Object.values(markersRef.current).forEach((marker) => {
      if (Array.isArray(marker)) {
        marker.forEach((m) => m?.setMap(null))
      } else {
        marker?.setMap(null)
      }
    })
    if (routeRef.current) routeRef.current.setMap(null)

    const bounds = new google.maps.LatLngBounds()

    // Set pickup marker
    markersRef.current.pickup = new google.maps.Marker({
      position: pickup.coordinates,
      map: map,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 8,
        fillColor: "#FFA500",
        fillOpacity: 1,
        strokeWeight: 2,
        strokeColor: "#FFFFFF",
      },
    })
    bounds.extend(pickup.coordinates)

    // Set dropoff marker
    markersRef.current.dropoff = new google.maps.Marker({
      position: dropoff.coordinates,
      map: map,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 8,
        fillColor: "#4CAF50",
        fillOpacity: 1,
        strokeWeight: 2,
        strokeColor: "#FFFFFF",
      },
    })
    bounds.extend(dropoff.coordinates)

    // Fit map to bounds
    map.fitBounds(bounds)

    // Calculate and animate route
    const directionsService = new google.maps.DirectionsService()
    const directionsRenderer = new google.maps.DirectionsRenderer({
      map: map,
      suppressMarkers: true,
      polylineOptions: {
        strokeColor: "#FFA500",
        strokeWeight: 5,
      },
    })

    directionsService.route(
      {
        origin: pickup.coordinates,
        destination: dropoff.coordinates,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK") {
          // Animate the route
          const path = result.routes[0].overview_path
          const polyline = new google.maps.Polyline({
            path: [path[0]],
            strokeColor: "#FFA500",
            strokeWeight: 5,
            map: map,
          })

          let currentIndex = 0
          const animate = () => {
            if (currentIndex < path.length - 1) {
              currentIndex++
              const currentPath = polyline.getPath()
              currentPath.push(path[currentIndex])
              animationRef.current = requestAnimationFrame(animate)
            } else {
              // Animation complete, show the full route
              directionsRenderer.setDirections(result)
              polyline.setMap(null)
            }
          }

          animate()
          routeRef.current = directionsRenderer

          const route = result.routes[0]
          const leg = route.legs[0]
          onRouteCalculated({
            distance: leg.distance.text,
            duration: leg.duration.text,
            fare: calculateFare(leg.distance.value),
            pickupEta: Math.ceil((leg.duration.value / 60) * 0.3),
          })
        } else {
          onError?.(new Error("Could not calculate route"))
        }
      },
    )
  }, [map, pickup, dropoff, onRouteCalculated, onError])

  useEffect(() => {
    if (!map || !driverLocation) return

    if (markersRef.current.driver) {
      markersRef.current.driver.setPosition(driverLocation)
    } else {
      markersRef.current.driver = new google.maps.Marker({
        position: driverLocation,
        map: map,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: "#2196F3",
          fillOpacity: 0.8,
          strokeWeight: 2,
          strokeColor: "#FFFFFF",
        },
      })
    }
  }, [map, driverLocation])

  return (
    <div className="w-full h-full">
      <div ref={mapRef} className="w-full h-full" />
    </div>
  )
}

function calculateFare(distanceInMeters) {
  const distanceInMiles = distanceInMeters / 1609.34
  const baseRate = 2.5
  const minimumFare = 5
  return Math.max(minimumFare, baseRate * distanceInMiles).toFixed(2)
}

