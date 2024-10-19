import { useState, useEffect, useRef } from 'react'

const useWebcam = () => {
  const [isStreamActive, setIsStreamActive] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setIsStreamActive(true)
        setError(null)
      }
    } catch (err) {
      console.error("Error accessing the webcam", err)
      setError("Unable to access the webcam. Please make sure it's connected and you've granted the necessary permissions.")
    }
  }

  const stopWebcam = () => {
    console.log(videoRef.current)
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach(track => track.stop())
      videoRef.current.srcObject = null
      setIsStreamActive(false)
    }
  }

  return {
    isStreamActive,
    error,
    videoRef,
    startWebcam,
    stopWebcam
  }
}

export default useWebcam