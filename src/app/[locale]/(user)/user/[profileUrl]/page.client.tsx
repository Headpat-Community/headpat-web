'use client'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { addFollow } from '@/utils/actions/followers/addFollow'
import { useEffect, useState } from 'react'
import { removeFollow } from '@/utils/actions/followers/removeFollow'
import sanitizeHtml from 'sanitize-html'

export function FollowerButton({
  displayName,
  userId,
  followerId,
  isFollowing,
}) {
  const { toast } = useToast()
  const [isFollowingState, setIsFollowingState] = useState(isFollowing || false)

  const handleFollow = async () => {
    const data = await addFollow(userId, followerId)
    console.log(data)
    if (data.code === 401) {
      return toast({
        title: 'Error',
        description: 'You must be logged in to follow users',
        variant: 'destructive',
      })
    } else if (data.code === 409) {
      return toast({
        title: 'Error',
        description: 'You cannot follow yourself',
        variant: 'destructive',
      })
    } else if (data.code === 404) {
      return toast({
        title: 'Error',
        description: 'You are already following this user',
        variant: 'destructive',
      })
    } else {
      toast({
        title: 'Follow added',
        description: `You have followed ${displayName}`,
      })
      setIsFollowingState(true)
    }
  }

  const handleUnfollow = async () => {
    const data = await removeFollow(followerId, userId)
    if (data.code === 401) {
      return toast({
        title: 'Error',
        description: 'You must be logged in to unfollow users',
        variant: 'destructive',
      })
    } else if (data.code === 409) {
      return toast({
        title: 'Error',
        description: 'You cannot unfollow yourself',
        variant: 'destructive',
      })
    } else if (data.code === 403) {
      return toast({
        title: 'Error',
        description: 'You are not following this user',
        variant: 'destructive',
      })
    } else {
      toast({
        title: 'Follow removed',
        description: `You have unfollowed ${displayName}`,
      })
      setIsFollowingState(false)
    }
  }

  return (
    <>
      <Button onClick={isFollowingState ? handleUnfollow : handleFollow}>
        {isFollowingState ? 'Unfollow' : 'Follow'}
      </Button>
    </>
  )
}
