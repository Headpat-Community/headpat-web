'use client'
import { Button } from '@/components/ui/button'
import { addFollow } from '@/utils/actions/followers/addFollow'
import { useState } from 'react'
import { removeFollow } from '@/utils/actions/followers/removeFollow'
import { toast } from 'sonner'

export function FollowerButton({ displayName, followerId, isFollowing }) {
  const [isFollowingState, setIsFollowingState] = useState(isFollowing || false)

  const handleFollow = async () => {
    const data = await addFollow(followerId)

    if (data.type === 'addfollow_missing_id') {
      return toast.error('No user ID provided')
    } else if (data.type === 'addfollow_unauthorized') {
      return toast.error('You must be logged in to follow users')
    } else if (data.type === 'addfollow_same_user') {
      return toast.error('You cannot follow yourself')
    } else if (data.type === 'addfollow_already_following') {
      return toast.error('You are already following this user')
    } else if (data.type === 'addfollow_delete_error') {
      return toast.error('There was an error following this user.')
    } else {
      toast.success(`You have followed ${displayName}`)
      setIsFollowingState(true)
    }
  }

  const handleUnfollow = async () => {
    const data = await removeFollow(followerId)

    if (data.type === 'removefollow_missing_id') {
      return toast.error('No user ID provided')
    } else if (data.type === 'removefollow_unauthorized') {
      return toast.error('You must be logged in to follow users')
    } else if (data.type === 'removefollow_same_user') {
      return toast.error('You cannot unfollow yourself')
    } else if (data.type === 'removefollow_not_following') {
      return toast.error('You are not following this user')
    } else if (data.type === 'removefollow_delete_error') {
      return toast.error('There was an error unfollowing this user.')
    } else {
      toast.success(`You have unfollowed ${displayName}`)
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
