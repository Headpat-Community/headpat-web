'use client'
import { Button } from '@/components/ui/button'
import {
  nextIntroductionQuestion,
  pauseVoting,
  previousIntroductionQuestion,
  updateMainSystem,
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
      const data = await previousIntroductionQuestion()
      if (!data) {
        toast.error('Sie sind bereits bei der ersten Frage')
      } else {
        toast.success('Frage zurückgesetzt')
      }
    } catch (error) {
      toast.error(
        'Fehler beim Zurücksetzen der Frage. War sie schon auf dem ersten?'
      )
    }
  }

  const next = async () => {
    try {
      const data = await nextIntroductionQuestion()
      if (!data) {
        toast.error('Sie sind bereits bei der letzten Frage')
      } else {
        toast.success('Frage weitergeschaltet')
      }
    } catch (error) {
      toast.error('Fehler beim Weiterleiten der Frage')
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
        <Button title={'Next'} onClick={next}>
          Next
        </Button>
      </div>
    </>
  )
}

export function MainClient() {
  const updateDocument = async (name: string) => {
    try {
      await updateMainSystem(name)
      toast.success(`Dokument ${name} aktualisiert`)
    } catch (error) {
      toast.error('Fehler beim Aktualisieren')
    }
  }

  return (
    <>
      <div className={'flex flex-col items-center space-y-8'}>
        <Button
          variant={'destructive'}
          onClick={() => pauseVoting('system-main')}
        >
          Pause
        </Button>
        <Button onClick={() => updateDocument('babarian-choice-one')}>
          Babarian choice one
        </Button>
        <Button onClick={() => updateDocument('barbarian-choice-two')}>
          Babarian choice two
        </Button>
        <Button onClick={() => updateDocument('bardin-choice-one')}>
          Bardin choice one
        </Button>
        <Button onClick={() => updateDocument('bardin-choice-two')}>
          Bardin choice two
        </Button>
        <Button onClick={() => updateDocument('mage-decision-one')}>
          Mage decision one
        </Button>
        <Button onClick={() => updateDocument('mage-choice-two')}>
          Mage choice two
        </Button>
        <Button onClick={() => updateDocument('rouge-choice-one')}>
          Rouge choice one
        </Button>
      </div>
    </>
  )
}
