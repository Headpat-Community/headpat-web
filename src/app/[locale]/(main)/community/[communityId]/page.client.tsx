'use client'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import { addFollow } from '@/utils/actions/community/addFollow'
import { removeFollow } from '@/utils/actions/community/removeFollow'
import { functions } from '@/app/appwrite-client'
import { ExecutionMethod } from 'node-appwrite'
import { toast } from 'sonner'

export function FollowerButton({ userSelf, displayName, communityId }) {
  const [isFollowingState, setIsFollowingState] = useState(false)

  const getUserId = async () => {
    try {
      const data = await functions.createExecution(
        'community-endpoints',
        '',
        false,
        `/community/isFollowing?communityId=${communityId}`, // You can specify a static limit here if desired
        ExecutionMethod.GET
      )

      const response = JSON.parse(data.responseBody)
      setIsFollowingState(response)
    } catch (error) {
      // Do nothing
    }
  }

  useEffect(() => {
    getUserId().then()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [communityId])

  const handleFollow = async () => {
    const data = await addFollow(userSelf?.$id, communityId)
    if (data.code === 401) {
      return toast.error('You must be logged in to follow a community')
    } else if (data.code === 404) {
      return toast.error('You are already following this community')
    } else {
      toast.success(`You have joined ${displayName}`)
      setIsFollowingState(true)
    }
  }

  const handleUnfollow = async () => {
    const data = await removeFollow(userSelf?.$id, communityId)
    if (data.code === 401) {
      return toast.error('You must be logged in to unfollow a community')
    } else if (data.code === 403) {
      return toast.error('You are not following this user')
    } else {
      toast.success(`You have left ${displayName}`)
      setIsFollowingState(false)
    }
  }

  return (
    <Button onClick={isFollowingState ? handleUnfollow : handleFollow}>
      {isFollowingState ? 'Leave' : 'Join'}
    </Button>
  )
}
