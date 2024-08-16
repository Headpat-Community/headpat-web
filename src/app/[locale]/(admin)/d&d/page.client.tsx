'use client'
import { Button } from '@/components/ui/button'
import {
  pauseVoting,
  updateMainSystem,
  updateSystem,
} from '@/app/[locale]/(admin)/d&d/actions'
import { toast } from 'sonner'

export function IntroductionClient() {
  const updateDocument = async (name: string) => {
    try {
      await updateSystem(name)
      toast.success(`Dokument ${name} aktualisiert`)
    } catch (error) {
      toast.error('Fehler beim Aktualisieren')
    }
  }

  return (
    <>
      <div className={'flex flex-col items-center space-y-6'}>
        <div /> {/* This div is absolutely needed for padding lol */}
        <Button variant={'destructive'} onClick={() => pauseVoting('system')}>
          Pause
        </Button>
        <Button onClick={() => updateDocument('66afd6270038b6fdd474')}>
          1
        </Button>
        <Button onClick={() => updateDocument('66afec390030294adb8d')}>
          2
        </Button>
        <Button onClick={() => updateDocument('66afec800031d08079e6')}>
          3
        </Button>
        <Button onClick={() => updateDocument('66afecab0007938d9e70')}>
          4
        </Button>
        <Button onClick={() => updateDocument('66afecc9001ce9ebe14c')}>
          5
        </Button>
        <Button onClick={() => updateDocument('66afecf300078f65ef71')}>
          6
        </Button>
        <Button onClick={() => updateDocument('66afed26002aa705859c')}>
          7
        </Button>
        <Button onClick={() => updateDocument('66afed440007cf65ac46')}>
          8
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
