"use client"

import {Button} from "@/components/ui/button";
import * as React from "react";
import {useState} from "react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Conversation} from "@11labs/client";
import Image from "next/image";
import SVMGirl from "@/public/SVMGirl.jpeg";
import {cn} from "@/lib/utils";

async function requestMicrophonePermission() {
    try {
        await navigator.mediaDevices.getUserMedia({audio: true})
        return true
    } catch {
        console.error('Microphone permission denied')
        return false
    }
}

async function getSignedUrl(): Promise<string> {
    const response = await fetch('/api/signed-url')
    if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to get signed url')
    }
    const data = await response.json()
    return data.signedUrl
}

export function ConvAI() {
    const [conversation, setConversation] = useState<Conversation | null>(null)
    const [isConnected, setIsConnected] = useState(false)
    const [isSpeaking, setIsSpeaking] = useState(false)

    async function startConversation() {
        try {
            const hasPermission = await requestMicrophonePermission()
            if (!hasPermission) {
                alert("Microphone permission is required")
                return;
            }
            const signedUrl = await getSignedUrl()
            const conversation = await Conversation.startSession({
                signedUrl: signedUrl,
                onConnect: () => {
                    setIsConnected(true)
                    setIsSpeaking(true)
                },
                onDisconnect: () => {
                    setIsConnected(false)
                    setIsSpeaking(false)
                },
                onError: (error) => {
                    console.error('Conversation error:', error)
                    alert('An error occurred during the conversation')
                },
                onModeChange: ({mode}) => {
                    setIsSpeaking(mode === 'speaking')
                },
            })
            setConversation(conversation)
        } catch (error) {
            console.error('Failed to start conversation:', error)
            alert(error instanceof Error ? error.message : 'Failed to start conversation')
        }
    }

    async function endConversation() {
        if (!conversation) {
            return
        }
        await conversation.endSession()
        setConversation(null)
    }

    return (
        <div className={"flex justify-center items-center gap-x-4"}>
            <Card className={'rounded-3xl'}>
                <CardContent>
                    <CardHeader>
                        <CardTitle className={'text-center'}>
                            {isConnected ? (
                                isSpeaking ? `SOONGirl is speaking` : 'SOONGirl is listening'
                            ) : (
                                'Disconnected'
                            )}
                        </CardTitle>
                    </CardHeader>
                    <div className={'flex flex-col gap-y-4 text-center'}>
                        <div className={cn('orb my-16 mx-12',
                            isSpeaking ? 'animate-orb' : (conversation && 'animate-orb-slow'),
                            isConnected ? 'orb-active' : 'orb-inactive')}
                        >
                                                        <Image src={SVMGirl} alt={"SVM Girl"} width={200} height={200}/>

                        </div>


                        <Button
                            variant={'outline'}
                            className={'rounded-full'}
                            size={"lg"}
                            disabled={conversation !== null && isConnected}
                            onClick={startConversation}
                        >
                            Start conversation
                        </Button>
                        <Button
                            variant={'outline'}
                            className={'rounded-full'}
                            size={"lg"}
                            disabled={conversation === null && !isConnected}
                            onClick={endConversation}
                        >
                            End conversation
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}