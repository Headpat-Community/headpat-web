"use client"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronDown, ChevronUp, Sparkles, Wrench, Bug } from "lucide-react"
import { useState } from "react"
import { Separator } from "@/components/ui/separator"
import sanitize from "sanitize-html"
import type { ChangelogDocumentsType } from "@/utils/types/models"

const ChangeIcon = ({
  type,
}: {
  type: "feature" | "improvement" | "bugfix"
}) => {
  switch (type) {
    case "feature":
      return <Sparkles className="mt-1 size-4 text-blue-500" />
    case "improvement":
      return <Wrench className="mt-1 size-4 text-green-500" />
    case "bugfix":
      return <Bug className="mt-1 size-4 text-red-500" />
    default:
      return null
  }
}

export default function ListComponent({
  changelogData,
}: {
  changelogData: ChangelogDocumentsType[]
}) {
  const [openVersions, setOpenVersions] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState<"web" | "app">("web")

  const toggleVersion = (version: string) => {
    setOpenVersions((prev) =>
      prev.includes(version)
        ? prev.filter((v) => v !== version)
        : [...prev, version]
    )
  }

  if (!changelogData || changelogData.length === 0) {
    return (
      <div className={"flex h-full flex-1 items-center justify-center"}>
        <div className={"gap-6 p-4 text-center"}>
          <h1 className={"text-2xl font-semibold"}>Oh no!</h1>
          <p className={"text-muted-foreground"}>
            Sorry, there are no updates available at the moment.
          </p>
        </div>
      </div>
    )
  }

  // Sort changelogData by version (descending, latest first)
  function compareVersions(
    a: ChangelogDocumentsType,
    b: ChangelogDocumentsType
  ) {
    const pa = a.version.split(".").map(Number)
    const pb = b.version.split(".").map(Number)
    for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
      const na = pa[i] || 0
      const nb = pb[i] || 0
      if (na > nb) return -1 // descending order
      if (na < nb) return 1
    }
    return 0
  }
  const sortedChangelogData = [...changelogData].sort(compareVersions)

  // Filter changelog data by type
  const webChangelog = sortedChangelogData.filter((item) => item.type === "web")
  const appChangelog = sortedChangelogData.filter((item) => item.type === "app")

  const sanitizeDescription = (text: string) => {
    const description = sanitize(text)
    return description.replace(/\n/g, "<br />")
  }

  const renderChangelogList = (changelogList: ChangelogDocumentsType[]) => (
    <ScrollArea className="h-[calc(100vh-12rem)] pr-4">
      <div className="space-y-6">
        {changelogList.map((release) => (
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
                        <CardTitle className="flex items-center text-2xl">
                          <Badge
                            variant="outline"
                            className={`mr-2 ${release.draft ? "border-red-500" : ""}`}
                          >
                            {release.draft ? "Draft" : `v${release.version}`}
                          </Badge>
                          {release.title}
                        </CardTitle>
                        <CardDescription>
                          {new Date(release.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
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
                      __html: sanitizeDescription(release.description),
                    }}
                  />
                  <div className="mt-6 space-y-4">
                    {release.type === "web" ? (
                      <div>
                        <h4>Web</h4>
                        <Separator className={"my-2"} />
                        <ul className="space-y-2">
                          {release.bugfixesWeb.length > 0 && <h5>Bugfixes</h5>}
                          {release.bugfixesWeb.map(
                            (change: string, index: number) => (
                              <li key={index} className="flex items-start">
                                <ChangeIcon type="bugfix" />
                                <div
                                  className="ml-2"
                                  dangerouslySetInnerHTML={{
                                    __html: sanitizeDescription(change),
                                  }}
                                />
                              </li>
                            )
                          )}
                          {release.featuresWeb.length > 0 && <h5>Features</h5>}
                          {release.featuresWeb.map(
                            (change: string, index: number) => (
                              <li key={index} className="flex items-start">
                                <ChangeIcon type="feature" />
                                <div
                                  className="ml-2"
                                  dangerouslySetInnerHTML={{
                                    __html: sanitizeDescription(change),
                                  }}
                                />
                              </li>
                            )
                          )}
                          {release.improvementsWeb.length > 0 && (
                            <h5>Improvements</h5>
                          )}
                          {release.improvementsWeb.map(
                            (change: string, index: number) => (
                              <li key={index} className="flex items-start">
                                <ChangeIcon type="improvement" />
                                <div
                                  className="ml-2"
                                  dangerouslySetInnerHTML={{
                                    __html: sanitizeDescription(change),
                                  }}
                                />
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    ) : (
                      <div>
                        <h4>App</h4>
                        <Separator className={"my-2"} />
                        <ul className="space-y-2">
                          {release.bugfixesApp.length > 0 && <h5>Bugfixes</h5>}
                          {release.bugfixesApp.map(
                            (change: string, index: number) => (
                              <li key={index} className="flex items-start">
                                <ChangeIcon type="bugfix" />
                                <div
                                  className="ml-2"
                                  dangerouslySetInnerHTML={{
                                    __html: sanitizeDescription(change),
                                  }}
                                />
                              </li>
                            )
                          )}
                          {release.featuresApp.length > 0 && <h5>Features</h5>}
                          {release.featuresApp.map(
                            (change: string, index: number) => (
                              <li key={index} className="flex items-start">
                                <ChangeIcon type="feature" />
                                <div
                                  className="ml-2"
                                  dangerouslySetInnerHTML={{
                                    __html: sanitizeDescription(change),
                                  }}
                                />
                              </li>
                            )
                          )}
                          {release.improvementsApp.length > 0 && (
                            <h5>Improvements</h5>
                          )}
                          {release.improvementsApp.map(
                            (change: string, index: number) => (
                              <li key={index} className="flex items-start">
                                <ChangeIcon type="improvement" />
                                <div
                                  className="ml-2"
                                  dangerouslySetInnerHTML={{
                                    __html: sanitizeDescription(change),
                                  }}
                                />
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        ))}
      </div>
    </ScrollArea>
  )

  return (
    <div className="container mx-auto py-10">
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as "web" | "app")}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="web">Web</TabsTrigger>
          <TabsTrigger value="app">Mobile</TabsTrigger>
        </TabsList>
        <TabsContent value="web" className="mt-6">
          {webChangelog.length > 0 ? (
            renderChangelogList(webChangelog)
          ) : (
            <div className={"flex h-full flex-1 items-center justify-center"}>
              <div className={"gap-6 p-4 text-center"}>
                <h1 className={"text-2xl font-semibold"}>No Web Updates</h1>
                <p className={"text-muted-foreground"}>
                  No web updates available at the moment.
                </p>
              </div>
            </div>
          )}
        </TabsContent>
        <TabsContent value="app" className="mt-6">
          {appChangelog.length > 0 ? (
            renderChangelogList(appChangelog)
          ) : (
            <div className={"flex h-full flex-1 items-center justify-center"}>
              <div className={"gap-6 p-4 text-center"}>
                <h1 className={"text-2xl font-semibold"}>No Mobile Updates</h1>
                <p className={"text-muted-foreground"}>
                  No mobile updates available at the moment.
                </p>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
