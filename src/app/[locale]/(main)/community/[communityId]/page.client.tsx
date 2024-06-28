'use client'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { useState } from 'react'
import { addFollow } from '@/utils/actions/community/addFollow'
import { removeFollow } from '@/utils/actions/community/removeFollow'

export function FollowerButton({
  displayName,
  userId,
  communityId,
  isFollowing,
}) {
  const { toast } = useToast()
  const [isFollowingState, setIsFollowingState] = useState(isFollowing || false)

  const handleFollow = async () => {
    const data = await addFollow(userId, communityId)
    if (data.code === 401) {
      return toast({
        title: 'Error',
        description: 'You must be logged in to follow a community',
        variant: 'destructive',
      })
    } else if (data.code === 404) {
      return toast({
        title: 'Error',
        description: 'You are already following this community',
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
    const data = await removeFollow(userId, communityId)
    if (data.code === 401) {
      return toast({
        title: 'Error',
        description: 'You must be logged in to unfollow a community',
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
