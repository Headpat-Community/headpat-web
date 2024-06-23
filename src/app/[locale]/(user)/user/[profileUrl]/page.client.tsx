'use client'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { addFollow } from '@/utils/actions/followers/addFollow'

export function AddFollowerButton({ displayName, followerId }) {
  const { toast } = useToast()

  const handleFriend = async () => {
    const data = await addFollow(followerId)
    if (data.code === 409) {
      return toast({
        title: 'Error',
        description: 'You cannot follow yourself',
        variant: 'destructive',
      })
    } else {
      toast({
        title: 'Follow added',
        description: `You have followed ${displayName}`,
      })
    }
  }
  return (
    <>
      <Button onClick={handleFriend}>Follow</Button>
    </>
  )
}
