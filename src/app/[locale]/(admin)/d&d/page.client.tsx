'use client'
import { Button } from '@/components/ui/button'
import {
  pauseVoting,
  previousIntroductionQuestion,
} from '@/app/[locale]/(admin)/d&d/actions'
import { toast } from 'sonner'

export function IntroductionClient() {
  const pause = async () => {
    try {
      const data = await pauseVoting('system')
      if (data.paused) {
        toast.success('Voten pausiert')
      } else {
        toast.success('Voten fortgesetzt')
      }
    } catch (error) {
      toast.error('Fehler beim Pausieren des Votings')
    }
  }

  const previous = async () => {
    try {
      await previousIntroductionQuestion()
      toast.success('Frage zurückgesetzt')
    } catch (error) {
      toast.error(
        'Fehler beim Zurücksetzen der Frage. War sie schon auf dem ersten?'
      )
    }
  }

  return (
    <>
      <div className={'flex items-center justify-between'}>
        <Button title={'Previous'} onClick={previous}>
          Previous
        </Button>
        <Button title={'Pause'} variant={'destructive'} onClick={pause}>
          Pause
        </Button>
        <Button title={'Next'}>Next</Button>
      </div>
    </>
  )
}
