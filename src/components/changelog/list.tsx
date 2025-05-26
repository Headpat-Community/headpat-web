'use client'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ChevronDown, ChevronUp, Sparkles, Wrench, Bug } from 'lucide-react'
import { useState } from 'react'
import { Separator } from '@/components/ui/separator'
import sanitize from 'sanitize-html'
import { ChangelogDocumentsType } from '@/utils/types/models'

const ChangeIcon = ({
  type
}: {
  type: 'feature' | 'improvement' | 'bugfix'
}) => {
  switch (type) {
    case 'feature':
      return <Sparkles className="size-4 mt-1 text-blue-500" />
    case 'improvement':
      return <Wrench className="size-4 mt-1 text-green-500" />
    case 'bugfix':
      return <Bug className="size-4 mt-1 text-red-500" />
    default:
      return null
  }
}

export default function ListComponent({
  changelogData
}: {
  changelogData: ChangelogDocumentsType[]
}) {
  const [openVersions, setOpenVersions] = useState<string[]>([])

  const toggleVersion = (version: string) => {
    setOpenVersions((prev) =>
      prev.includes(version)
        ? prev.filter((v) => v !== version)
        : [...prev, version]
    )
  }

  if (!changelogData || changelogData.length === 0) {
    return (
      <div className={'flex flex-1 justify-center items-center h-full'}>
        <div className={'p-4 gap-6 text-center'}>
          <h1 className={'text-2xl font-semibold'}>Oh no!</h1>
          <p className={'text-muted-foreground'}>
            Sorry, there are no updates available at the moment.
          </p>
        </div>
      </div>
    )
  }

  const sanitizeDescription = (text: string) => {
    const description = sanitize(text)
    return description.replace(/\n/g, '<br />')
  }

  return (
    <div className="container mx-auto py-10">
      <ScrollArea className="h-[calc(100vh-12rem)] pr-4">
        <div className="space-y-6">
          {changelogData.map((release) => (
            <Card key={release.$id}>
              <CardHeader>
                <Collapsible open={openVersions.includes(release.$id)}>
                  <CollapsibleTrigger asChild>
                    <button
                      className="w-full text-left"
                      onClick={() => toggleVersion(release.$id)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="flex text-2xl items-center">
                            <Badge
                              variant="outline"
                              className={`mr-2 ${release.draft ? 'border-red-500' : ''}`}
                            >
                              {release.draft ? 'Draft' : `v${release.version}`}
                            </Badge>
                            {release.title}
                          </CardTitle>
                          <CardDescription>
                            {new Date(release.date).toLocaleDateString(
                              'en-US',
                              {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              }
                            )}
                          </CardDescription>
                        </div>
                        {openVersions.includes(release.$id) ? (
                          <ChevronUp className="size-4" />
                        ) : (
                          <ChevronDown className="size-4" />
                        )}
                        <span className="sr-only">Toggle changes</span>
                      </div>
                    </button>
                  </CollapsibleTrigger>
                </Collapsible>
              </CardHeader>
              <Collapsible open={openVersions.includes(release.$id)}>
                <CollapsibleContent>
                  <CardContent>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: sanitizeDescription(release.description)
                      }}
                    />
                    <div className="space-y-4 mt-6">
                      {['Web', 'App'].map((platform) => {
                        const bugfixes = release[`bugfixes${platform}`]
                        const features = release[`features${platform}`]
                        const improvements = release[`improvements${platform}`]

                        return (
                          (bugfixes.length > 0 ||
                            features.length > 0 ||
                            improvements.length > 0) && (
                            <div key={platform}>
                              <h4>{platform}</h4>
                              <Separator className={'my-2'} />
                              <ul className="space-y-2">
                                {bugfixes.length > 0 && <h5>Bugfixes</h5>}
                                {bugfixes.map(
                                  (change: string, index: number) => (
                                    <li
                                      key={index}
                                      className="flex items-start"
                                    >
                                      <ChangeIcon type="bugfix" />
                                      <div
                                        className="ml-2"
                                        dangerouslySetInnerHTML={{
                                          __html: sanitizeDescription(change)
                                        }}
                                      />
                                    </li>
                                  )
                                )}
                                {features.length > 0 && <h5>Features</h5>}
                                {features.map(
                                  (change: string, index: number) => (
                                    <li
                                      key={index}
                                      className="flex items-start"
                                    >
                                      <ChangeIcon type="feature" />
                                      <div
                                        className="ml-2"
                                        dangerouslySetInnerHTML={{
                                          __html: sanitizeDescription(change)
                                        }}
                                      />
                                    </li>
                                  )
                                )}
                                {improvements.length > 0 && (
                                  <h5>Improvements</h5>
                                )}
                                {improvements.map(
                                  (change: string, index: number) => (
                                    <li
                                      key={index}
                                      className="flex items-start"
                                    >
                                      <ChangeIcon type="improvement" />
                                      <div
                                        className="ml-2"
                                        dangerouslySetInnerHTML={{
                                          __html: sanitizeDescription(change)
                                        }}
                                      />
                                    </li>
                                  )
                                )}
                              </ul>
                            </div>
                          )
                        )
                      })}
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
