import { useState, useEffect, useRef } from 'react'

const useWebcam = () => {
  const [stream, setStream] = useState<MediaStream>()
  const [isStreamActive, setIsStreamActive] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)  // Using ref to store the stream


  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      if (videoRef.current) {
        console.log("set stream")
        videoRef.current.srcObject = stream
        streamRef.current = stream
        setIsStreamActive(true)
        // console.log(stream)
        setError(null)
      }
    } catch (err) {
      console.error("Error accessing the webcam", err)
      setError("Unable to access the webcam. Please make sure it's connected and you've granted the necessary permissions.")
    }
  }

  const stopWebcam = () => {
    const stream = streamRef.current // Access the stream from ref
    if (stream) {
      const tracks = stream.getTracks()
      tracks.forEach(track => track.stop())
      setIsStreamActive(false)
    } else {
      console.error("No stream found to stop")
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