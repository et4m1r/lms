import DocsBreadcrumb from '@/components/docs-breadcrumb'
import Pagination from '@/components/pagination'
import { Leftbar } from '@/components/leftbar'
import { EachRoute } from '@/lib/routes-config'
import { notFound } from 'next/navigation'
import { Typography } from '@/components/typography'
import { payload } from '@/lib/payload'
import { NextResponse } from 'next/server'
import { Lesson } from '@/payload-types'
import type {
  DefaultNodeTypes,
  SerializedBlockNode,
  SerializedInlineBlockNode,
} from '@payloadcms/richtext-lexical'
import { type JSXConvertersFunction, RichText } from '@payloadcms/richtext-lexical/react'
import React from 'react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vs } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import ClientNavigationSetup from '@/context/navbar-setup'

type PageProps = {
  params: Promise<{ slug: string[] }>
}

export default async function CoursePage(props: PageProps) {
  const params = await props.params
  const { slug = [] } = params

  let courseId: number | undefined
  let lessonId: number | undefined
  let moduleId: number | undefined

  const pathName = slug.join('/')

  if (slug.length === 1) {
    courseId = Number(slug[0])
  } else if (slug.length === 5 && slug[3] === 'lessons') {
    courseId = Number(slug[0])
    lessonId = Number(slug[4])
    moduleId = Number(slug[2])
  } else {
    return notFound()
  }

  const course = await payload.findByID({
    collection: 'courses',
    id: courseId,
  })

  if (!lessonId) {
    lessonId = course.modules[0].lessons[0].id
  }

  let lesson: Lesson | null = null

  if (lessonId) {
    lesson = await payload.findByID({
      collection: 'lessons',
      id: lessonId,
    })
  } else {
    return notFound()
  }

  function findPrevNextLesson() {
    const allLessons = []

    // Flatten all lessons into one array with module info (optional)
    for (const currentModule of course.modules) {
      for (const lesson of currentModule.lessons) {
        allLessons.push(lesson)
      }
    }
    // Find index of the current lesson
    const currentIndex = allLessons.findIndex((lesson) => lesson.id === lessonId)

    if (currentIndex === -1) {
      return { prev: null, next: null } // not found
    }
    let prevId, prevTitle, nextId, nextTitle

    if (allLessons[currentIndex - 1]) {
      prevId = allLessons[currentIndex - 1].id || null
      prevTitle = allLessons[currentIndex - 1].title || ''
    }
    if (allLessons[currentIndex + 1]) {
      nextId = allLessons[currentIndex + 1].id || null
      nextTitle = allLessons[currentIndex + 1].title || ''
    }

    return {
      prev: {
        href: prevId ? `/courses/${courseId}/chapter/${moduleId}/lessons/${prevId}` : null,
        title: prevTitle ? prevTitle : '',
      },
      next: {
        href: nextId ? `/courses/${courseId}/chapter/${moduleId}/lessons/${nextId}` : null,
        title: nextTitle ? nextTitle : '',
      },
    }
  }

  const createToCourseMetaData = (data: any): EachRoute => {
    return {
      id: data.id,
      href: `/courses/${data.id}`,
      title: data.title,
      noLink: true,
      items: data.modules.map((module: any) => ({
        id: module.id,
        href: `/chapter/${module.id}`,
        title: module.title,
        noLink: true,
        items: module.lessons.map((lesson: any) => ({
          id: lesson.id,
          title: lesson.title,
          href: `/lessons/${lesson.id}`,
        })),
      })),
    }
  }

  const courseMetaData: EachRoute = createToCourseMetaData(course)

  if (!course) {
    return NextResponse.json({ error: 'Course not found' }, { status: 404 })
  }

  type NodeTypes = DefaultNodeTypes | SerializedBlockNode<any> | SerializedInlineBlockNode<any>

  interface CodeBlockProps {
    code: string
    language: string
  }

  function CodeBlock({ code, language }: CodeBlockProps) {
    return (
      <SyntaxHighlighter
        language={language}
        style={vs}
        PreTag="div"
        className="rounded-md overflow-x-auto"
      >
        {code}
      </SyntaxHighlighter>
    )
  }

  const jsxConverters: JSXConvertersFunction<NodeTypes> = ({ defaultConverters }) => ({
    ...defaultConverters,
    blocks: {
      Code: ({ node }) => (
        <CodeBlock key={node.fields.id} code={node.fields.code} language={node.fields.language} />
      ),
    },
  })

  return (
    <div className="flex items-start gap-8">
      <ClientNavigationSetup navbarProps={{ data: courseMetaData }} />
      <Leftbar key="leftbar" data={courseMetaData} />
      {lesson && (
        <div className="flex-[5.25]">
          <div className="flex items-start gap-10">
            <div className="flex-[4.5] py-10 mx-auto">
              <div className="w-full mx-auto">
                <DocsBreadcrumb paths={['course']} />
                <Typography>
                  <h1 className="sm:text-3xl text-2xl !-mt-0.5">{lesson.title}</h1>
                  <p className="-mt-4 text-muted-foreground sm:text-[16.5px] text-[14.5px]">
                    {lesson.description}
                  </p>
                  <div>{lesson.title}</div>
                  <RichText
                    converters={jsxConverters}
                    data={lesson.content as SerializedEditorState}
                  />
                  <Pagination prev={findPrevNextLesson().prev} next={findPrevNextLesson().next} />
                </Typography>
              </div>
            </div>
          </div>
        </div>
      )}
      {/*<Toc path={pathName} />*/}
    </div>
  )
}
