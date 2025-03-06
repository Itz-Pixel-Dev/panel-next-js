"use client"

import React, { use } from 'react'
import { useParams } from 'next/navigation'

export default function Console(){
    return(
        <div>
           The server ID is: {useParams().id}
        </div>
    )
}