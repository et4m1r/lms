import DocsBreadcrumb from '@/components/docs-breadcrumb'
import Pagination from '@/components/pagination'
import { Typography } from '@/components/typography'
import { RichText } from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import { findPrevNextLesson } from '@/lib/course/course-utils'
import type { Lesson } from '@/payload-types'
import type { JSXConvertersFunction } from '@payloadcms/richtext-lexical/react'
import type {
  DefaultNodeTypes,
  SerializedBlockNode,
  SerializedInlineBlockNode,
} from '@payloadcms/richtext-lexical'
import { CodeBlock } from '@/components/course/code-block'

interface CourseContentProps {
  lesson: Lesson
  course: any
  courseId: number
  lessonId: number
  moduleId: number
}

type NodeTypes = DefaultNodeTypes | SerializedBlockNode<any> | SerializedInlineBlockNode<any>

export const jsxConverters: JSXConvertersFunction<NodeTypes> = ({ defaultConverters }) => ({
  ...defaultConverters,
  blocks: {
    ...defaultConverters.blocks,
    Code: ({ node }) => (
      <CodeBlock key={node.fields.id} code={node.fields.code} language={node.fields.language} />
    ),
  },
})

export default function CourseContent({
  lesson,
  course,
  courseId,
  lessonId,
  moduleId,
}: CourseContentProps) {
  // Get navigation links for pagination
  const { prev, next } = findPrevNextLesson(course, lessonId, courseId, moduleId)

  return (
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
              <RichText converters={jsxConverters} data={lesson.content as SerializedEditorState} />
              <Pagination prev={prev} next={next} />
            </Typography>
          </div>
        </div>
      </div>
    </div>
  )
}
