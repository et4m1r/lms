import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vs } from 'react-syntax-highlighter/dist/esm/styles/hljs'

interface CodeBlockProps {
  code: string
  language: string
}

export function CodeBlock({ code, language }: CodeBlockProps) {
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
