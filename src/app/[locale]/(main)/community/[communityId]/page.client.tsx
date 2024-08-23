'use client'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { useEffect, useState } from 'react'
import { addFollow } from '@/utils/actions/community/addFollow'
import { removeFollow } from '@/utils/actions/community/removeFollow'
import { account } from '@/app/appwrite-client'
import { getIsFollowingCommunity } from '@/utils/server-api/community-followers/getIsFollowingCommunity'

export function FollowerButton({ displayName, communityId }) {
  const { toast } = useToast()
  const [isFollowingState, setIsFollowingState] = useState(false)
  const [userId, setUserId] = useState(null)

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
        title: 'Joined community',
        description: `You have joined ${displayName}`,
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
        title: 'Left community',
        description: `You have left ${displayName}`,
      })
      setIsFollowingState(false)
    }
  }

  return (
    <Button onClick={isFollowingState ? handleUnfollow : handleFollow}>
      {isFollowingState ? 'Leave' : 'Join'}
    </Button>
  )
}
