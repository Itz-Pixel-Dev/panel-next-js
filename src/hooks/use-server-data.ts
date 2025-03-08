"use client"

import { useState, useEffect } from "react"

type ServerStatus = "online" | "offline" | "starting" | "stopping" | "restarting"

export type Server = {
  id: string
  name: string
  description: string
  status: ServerStatus
  ip: string
  port: number
  memory: {
    allocated: number
    used: number
  }
  cpu: {
    allocated: number
    used: number
  }
  disk: {
    allocated: number
    used: number
  }
}

export function useServerData(serverId: string) {
  const [server, setServer] = useState<Server | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchServer = async () => {
      setIsLoading(true)
      try {
        // In a real app, you would fetch from an API
        // This is just mock data
        const mockServer: Server = {
          id: serverId,
          name: `Server ${serverId}`,
          description: "A game server for Minecraft",
          status: "online",
          ip: "192.168.1.1",
          port: 25565,
          memory: {
            allocated: 2048,
            used: 1024,
          },
          cpu: {
            allocated: 100,
            used: 45,
          },
          disk: {
            allocated: 10240,
            used: 5120,
          },
        }

        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 500))

        setServer(mockServer)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to fetch server data"))
      } finally {
        setIsLoading(false)
      }
    }

    fetchServer()
  }, [serverId])

  return { server, isLoading, error }
}
