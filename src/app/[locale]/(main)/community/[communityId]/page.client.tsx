'use client'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { useEffect, useState } from 'react'
import { addFollow } from '@/utils/actions/community/addFollow'
import { removeFollow } from '@/utils/actions/community/removeFollow'
import { listDocuments } from '@/components/api/documents'
import { Query } from 'node-appwrite'
import { account } from '@/app/appwrite-client'

export function FollowerButton({ displayName, communityId }) {
  const { toast } = useToast()
  const [isFollowingState, setIsFollowingState] = useState(false)
  const [userId, setUserId] = useState(null)

  useEffect(() => {
    const getUserId = async () => {
      const data = await account.get()
      setUserId(data.$id)
    }
    getUserId().then()
  }, [])

  useEffect(() => {
    const isFollowing = async () => {
      const data = await listDocuments(userId, communityId, [
        Query.equal('userId', userId),
        Query.equal('communityId', communityId),
      ])
      if (data.documents.length > 0) {
        setIsFollowingState(true)
      }
    }
    if (userId) {
      isFollowing().then()
    }
  }, [communityId, userId])

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
    <Button onClick={isFollowingState ? handleUnfollow : handleFollow}>
      {isFollowingState ? 'Unfollow' : 'Follow'}
    </Button>
  )
}
