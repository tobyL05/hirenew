'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useVoice } from '@humeai/voice-react'
import useWebcam from '@/utils/useWebcam'
import useExpressions from '@/utils/useExpressions'
import useMessages from '@/utils/useMessages'

export function VideoChat() {
  const [error, setError] = useState<string | null>(null)
  const { messages } = useVoice()
  const { addMessage } = useMessages()
//   const { getCurrentExpression } = useExpressions()
  const { videoRef, isStreamActive, startWebcam, stopWebcam } = useWebcam()


//   useEffect(() => {
    // startWebcam() // works
    // return () => {
    //   stopWebcam()
    // }
//   }, [])

  useEffect(() => {
    if (messages) {
        addMessage(messages[messages.length-1])
        // getCurrentExpression(messages[messages.length - 1])
    }
  },[messages])

  return (
    <Card className="w-full max-w-4xl mx-auto mt-32">
      <CardHeader>
        <CardTitle>Video Chat</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Local Video Feed */}
            <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
              {error && (
                <div className="absolute inset-0 flex items-center justify-center p-4 text-center text-red-500">
                  {error}
                </div>
              )}
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover ${isStreamActive ? '' : 'hidden'}`}
              />
              {!isStreamActive && !error && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-gray-500">Camera is off</p>
                </div>
              )}
            </div>
            
            {/* Remote Video Feed */}
            <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
              <div className="h-full flex flex-col justify-center items-center">
                <h1 className="text-gray-500">hirenew AI</h1>
              </div>
            </div>
            <div className="flex gap-4">
            <Button 
              onClick={isStreamActive ? stopWebcam : startWebcam}
              className="flex-1"
            >
              {isStreamActive ? 'Stop Camera' : 'Start Camera'}
            </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}