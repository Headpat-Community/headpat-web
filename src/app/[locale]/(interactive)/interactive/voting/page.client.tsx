'use client'
import { client } from '@/app/appwrite-client'
import { createVote } from '@/utils/actions/interactive/createVote'
import { useEffect, useState } from 'react'
import { RealtimeResponseEvent } from 'appwrite'
import { Interactive } from '@/utils/types/models'

export default function VotingClient({
  questionId,
  votes,
  forwardedFor,
}: {
  questionId: number
  votes: Interactive.VotesAnswersType
  forwardedFor: string
}) {
  const [votedQuestions, setVotedQuestions] = useState({})
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(questionId)
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(null)

  const loadVotedQuestions = () => {
    let newVotedQuestions = { ...votedQuestions }
    votes.documents.forEach((vote) => {
      if (vote.ipAddress === forwardedFor) {
        newVotedQuestions[vote.questionId] = Number(vote.optionId)
      }
    })
    setVotedQuestions(newVotedQuestions)
  }

  console.log(votedQuestions)

  // Call this function when the component mounts
  useEffect(() => {
    loadVotedQuestions()
  }, [])

  useEffect(() => {
    if (votedQuestions[selectedQuestionIndex]) {
      setSelectedOptionIndex(votedQuestions[selectedQuestionIndex])
    }
  }, [selectedQuestionIndex, votedQuestions])

  interface QuestionType extends RealtimeResponseEvent<any> {
    questionId: string
  }

  client.subscribe(
    ['databases.interactive.collections.questions.documents.main'],
    (response: QuestionType) => {
      setSelectedQuestionIndex(response.payload.questionId)
    }
  )

  const questions = [
    {
      question: 'You come across a fork in the road. Do you:',
      options: [
        'Take the left path, which seems well-traveled.',
        'Take the right path, which appears less traveled but possibly more interesting.',
        'Consult your map or ask a local for advice.',
      ],
    },
    {
      question: 'You encounter a wounded traveler on the roadside. Do you:',
      options: [
        'Offer immediate assistance, tending to their wounds.',
        "Approach cautiously, unsure if it's a trap.",
        'Ignore them and continue on your journey, not wanting to get involved.',
      ],
    },
    {
      question: 'A merchant offers to sell you a mysterious potion. Do you:',
      options: [
        'Haggle for a lower price before buying it.',
        "Ask for more information about the potion's effects.",
        'Decline the offer, wary of unknown substances.',
      ],
    },
    {
      question: 'You stumble upon a hidden cave entrance. Do you:',
      options: [
        'Investigate further, curious about what treasures it might hold.',
        'Proceed cautiously, wary of potential dangers lurking inside.',
        'Mark the location on your map for later exploration and continue on your current path.',
      ],
    },
    {
      question:
        'A group of bandits blocks your path, demanding payment for safe passage. Do you:',
      options: [
        'Negotiate with them to find a peaceful resolution.',
        'Refuse to pay and prepare to fight if necessary.',
        'Attempt to sneak past them unnoticed.',
      ],
    },
    {
      question: 'You discover an ancient tome in a forgotten library. Do you:',
      options: [
        'Spend time deciphering its contents to gain knowledge or power.',
        'Leave it undisturbed, fearing potential consequences.',
        'Take the tome with you to study later.',
      ],
    },
    {
      question: 'You encounter a magical creature in distress. Do you:',
      options: [
        'Rush to aid the creature, believing it may reward you for your kindness.',
        'Approach cautiously, unsure of its intentions.',
        'Ignore the creature and continue on your journey, not wanting to risk danger.',
      ],
    },
  ]

  const handleVote = async (questionIndex, optionIndex) => {
    if (votedQuestions[questionIndex]) {
      alert('You have already voted on this question.')
      return
    }

    // Check if the user has already voted on this question
    const userHasVoted = votes.documents.some(
      (vote) =>
        vote.questionId === questionIndex && vote.ipAddress === forwardedFor
    )

    if (userHasVoted) {
      alert('You have already voted on this question.')
      return
    }

    // Update the state immediately
    setVotedQuestions((prevState) => {
      return { ...prevState, [selectedQuestionIndex]: optionIndex }
    })

    // Update the selected option immediately
    setSelectedOptionIndex(optionIndex)

    // Then send the vote to the server
    await createVote(selectedQuestionIndex, optionIndex)
  }

  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container grid gap-8 px-4 md:px-6">
        {questions[selectedQuestionIndex].question && (
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            {questions[selectedQuestionIndex].question}
          </h2>
        )}
        {questions[selectedQuestionIndex].options.map((option, optionIndex) => (
          <button
            key={option}
            onClick={() => handleVote(selectedQuestionIndex, optionIndex)}
            className={
              selectedOptionIndex === optionIndex &&
              votedQuestions[selectedQuestionIndex] === optionIndex
                ? 'bg-gray-500'
                : ''
            }
          >
            <div className="rounded-lg border p-4 shadow-sm">
              <div className="space-y-2">
                <div className={'flex justify-between'}>
                  <p className="text-lg font-semibold">{option}</p>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  )
}
