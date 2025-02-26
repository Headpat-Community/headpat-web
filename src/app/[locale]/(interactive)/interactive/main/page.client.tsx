'use client'
import { createVoteMain } from '@/utils/actions/interactive/createVote'
import { useEffect, useState, useCallback } from 'react'
import { RealtimeResponseEvent } from 'appwrite'
import { Interactive } from '@/utils/types/models'
import { client, databases } from '@/app/appwrite-client'
import { Separator } from '@/components/ui/separator'
import { XSquareIcon, CheckIcon } from 'lucide-react'
import { chartConfig, DDChart } from './chart'

export default function VotingClient({
  questionId,
  paused,
  votes,
  forwardedFor,
}: {
  questionId: string // Changed from number to string
  paused: boolean
  votes: Interactive.VotesAnswersType
  forwardedFor: string
}) {
  const [votedQuestions, setVotedQuestions] = useState({})
  const [isPaused, setIsPaused] = useState(paused)
  const [selectedQuestionId, setSelectedQuestionId] = useState(questionId) // Changed from index to ID
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(null)
  const [questions, setQuestions] = useState([])
  const [voteCounts, setVoteCounts] = useState({})

  const loadVotedQuestions = useCallback(() => {
    let newVotedQuestions = { ...votedQuestions }
    votes.documents.forEach((vote) => {
      if (vote.ipAddress === forwardedFor) {
        newVotedQuestions[vote.questionId] = Number(vote.optionId)
      }
    })
    setVotedQuestions(newVotedQuestions)
  }, [votedQuestions, votes, forwardedFor])

  const loadVoteCounts = async () => {
    const response = await databases.listDocuments(
      'interactive',
      'countedAnswers-main'
    )
    const newVoteCounts = response.documents.reduce((acc, doc) => {
      const [questionId, optionIndex] = doc.$id.split('_')
      if (!acc[questionId]) {
        acc[questionId] = {}
      }
      acc[questionId][optionIndex] = doc.amount
      return acc
    }, {})
    setVoteCounts(newVoteCounts)
  }

  // Call this function when the component mounts
  useEffect(() => {
    loadVotedQuestions()
    loadVoteCounts().then()
    databases
      .listDocuments('interactive', 'questions-main')
      .then((response) => {
        setQuestions(response.documents)
      })
  }, [loadVotedQuestions])

  useEffect(() => {
    if (votedQuestions[selectedQuestionId] !== undefined) {
      setSelectedOptionIndex(votedQuestions[selectedQuestionId])
    } else {
      setSelectedOptionIndex(null)
    }
  }, [selectedQuestionId, votedQuestions])

  interface QuestionType extends RealtimeResponseEvent<any> {
    questionId: string
  }

  const handleSubscribedEvents = useCallback(() => {
    return client.subscribe(
      [
        'databases.interactive.collections.system-main.documents.main',
        'databases.interactive.collections.countedAnswers-main.documents',
      ],
      (response: QuestionType) => {
        if (
          response.channels.includes(
            'databases.interactive.collections.system-main.documents'
          )
        ) {
          setSelectedQuestionId(response.payload.questionId)
          setIsPaused(response.payload.paused)
        } else if (
          response.channels.includes(
            'databases.interactive.collections.countedAnswers-main.documents'
          )
        ) {
          const [questionId, optionIndex] = response.payload.$id.split('_')
          setVoteCounts((prevState) => ({
            ...prevState,
            [questionId]: {
              ...prevState[questionId],
              [optionIndex]: response.payload.amount,
            },
          }))
        }
      }
    )
  }, [])

  useEffect(() => {
    const subscription = handleSubscribedEvents()
    return () => {
      // Remove the event listener when the component is unmounted
      if (subscription) {
        subscription()
      }
    }
  }, [handleSubscribedEvents])

  if (!questions || !questions.length) {
    return <div>Loading....</div>
  }

  function handleVote(questionId: string, optionIndex: number) {
    // Check if the user has already voted on this question
    if (votedQuestions[questionId] !== undefined) {
      alert('Du hast bereits abgestimmt für diese Frage!')
      return
    }

    // Confirm the vote
    const isConfirmed = window.confirm(
      'Möchtest du wirklich für diese Option abstimmen?'
    )
    if (!isConfirmed) {
      return
    }

    // Update the state immediately
    setVotedQuestions((prevState) => {
      return { ...prevState, [questionId]: optionIndex }
    })

    // Update the selected option immediately
    setSelectedOptionIndex(optionIndex)

    // Then send the vote to the server
    createVoteMain(questionId, optionIndex).catch((error) => {
      console.error('Error creating vote:', error)
      // Revert the state if there was an error
      setVotedQuestions((prevState) => {
        const newState = { ...prevState }
        delete newState[questionId]
        return newState
      })
      setSelectedOptionIndex(null)
    })
  }

  const totalVotes = Object.entries(voteCounts[selectedQuestionId] || {}).map(
    ([optionIndex, voteCount]) => ({
      browser: `option${optionIndex}`,
      visitors: voteCount,
      fill: chartConfig[`option${optionIndex}`]?.color || 'var(--color-other)',
    })
  )

  // Find the option with the most votes
  const maxVoteCount = Math.max(
    0,
    ...Object.values(voteCounts[selectedQuestionId] || {}).map((value) =>
      Number(value)
    )
  )
  const maxVoteOptionIndex =
    maxVoteCount > 0
      ? Object.keys(voteCounts[selectedQuestionId] || {}).find(
          (key) => voteCounts[selectedQuestionId][key] === maxVoteCount
        )
      : null

  return (
    <section className="w-full py-4">
      <div className="container grid gap-8 px-4 md:px-6">
        {isPaused && (
          <>
            <div className="flex flex-col items-center justify-center bg-background px-4 py-6 sm:px-6 lg:px-8">
              <div className="mx-auto max-w-md text-center">
                <XSquareIcon className="mx-auto h-12 w-12" />
                <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                  Voting is paused!
                </h1>
              </div>
            </div>
            <DDChart data={totalVotes} />
          </>
        )}
        {questions
          .find((q) => q.$id === selectedQuestionId)
          ?.questions?.map((option, optionIndex) => {
            const voteCount = voteCounts[selectedQuestionId]?.[optionIndex] || 0
            return (
              <button
                key={option}
                onClick={() => handleVote(selectedQuestionId, optionIndex)}
                className={
                  selectedOptionIndex === optionIndex &&
                  votedQuestions[selectedQuestionId] === optionIndex
                    ? 'bg-gray-500'
                    : ''
                }
                disabled={isPaused}
              >
                <div className="rounded-lg border p-4 shadow-xs">
                  <div className="space-y-2">
                    <div className={'flex justify-between'}>
                      <div
                        className="text-lg font-semibold"
                        dangerouslySetInnerHTML={{
                          __html: option || 'Nothing here yet!',
                        }}
                      />
                      {isPaused &&
                        optionIndex.toString() === maxVoteOptionIndex && (
                          <CheckIcon className="h-6 w-6 text-green-500" />
                        )}
                    </div>
                  </div>
                  <Separator className={'mt-4'} />
                  <div>{voteCount} votes</div>
                </div>
              </button>
            )
          })}
      </div>
    </section>
  )
}
