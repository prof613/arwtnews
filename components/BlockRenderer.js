import React from "react"

export default function BlockRenderer({ blocks, datePrefix = null }) {
  if (!blocks || !Array.isArray(blocks)) {
    return <p>No content available.</p>
  }

  const renderBlock = (block, index) => {
    switch (block.type) {
      case "paragraph":
        // If this is the first paragraph and we have a datePrefix, include it
        const isFirstParagraph = index === 0 || (index > 0 && blocks.slice(0, index).every((b) => b.type === "heading"))

        return (
          <p key={index} className="mb-4">
            {isFirstParagraph && datePrefix && datePrefix}
            {renderChildren(block.children)}
          </p>
        )

      case "heading":
        const HeadingTag = `h${block.level || 2}`
        const headingClasses = {
          1: "text-3xl font-bold mb-4 text-[#3C3B6E]",
          2: "text-2xl font-bold mb-3 text-[#3C3B6E]",
          3: "text-xl font-bold mb-2 text-[#3C3B6E]",
          4: "text-lg font-bold mb-2 text-[#3C3B6E]",
          5: "text-base font-bold mb-2 text-[#3C3B6E]",
          6: "text-sm font-bold mb-2 text-[#3C3B6E]",
        }
        return React.createElement(
          HeadingTag,
          { key: index, className: headingClasses[block.level || 2] },
          renderChildren(block.children),
        )

      case "list":
        const ListTag = block.format === "ordered" ? "ol" : "ul"
        const listClass =
          block.format === "ordered" ? "list-decimal list-inside mb-4 ml-4" : "list-disc list-inside mb-4 ml-4"
        return (
          <ListTag key={index} className={listClass}>
            {block.children?.map((item, itemIndex) => (
              <li key={itemIndex} className="mb-1">
                {renderChildren(item.children)}
              </li>
            ))}
          </ListTag>
        )

      case "quote":
        return (
          <blockquote
            key={index}
            className="border-l-4 border-[#B22234] pl-4 italic text-gray-700 mb-4 bg-gray-50 py-2"
          >
            {renderChildren(block.children)}
          </blockquote>
        )

      case "code":
        return (
          <pre key={index} className="bg-gray-100 p-4 rounded mb-4 overflow-x-auto">
            <code>{renderChildren(block.children)}</code>
          </pre>
        )

      case "image":
        // Helper function to build proper image URL
        const buildImageUrl = (url) => {
          if (!url) return null

          // If URL already starts with http, use as-is
          if (url.startsWith("http")) {
            return url
          }

          // If URL starts with /, prepend base URL
          if (url.startsWith("/")) {
            return `${process.env.NEXT_PUBLIC_STRAPI_URL}${url}`
          }

          // Otherwise, assume it needs /uploads/ prefix
          return `${process.env.NEXT_PUBLIC_STRAPI_URL}/${url}`
        }

        let imageUrl = null
        let altText = "Article image"
        let caption = null

        // Structure 1: block.image.url
        if (block.image?.url) {
          imageUrl = buildImageUrl(block.image.url)
          altText = block.image.alternativeText || altText
          caption = block.image.caption
        }
        // Structure 2: block.image.data.attributes
        else if (block.image?.data?.attributes?.url) {
          imageUrl = buildImageUrl(block.image.data.attributes.url)
          altText = block.image.data.attributes.alternativeText || altText
          caption = block.image.data.attributes.caption
        }
        // Structure 3: Direct URL in block
        else if (block.url) {
          imageUrl = buildImageUrl(block.url)
          altText = block.alternativeText || altText
          caption = block.caption
        }
        // Structure 4: File data
        else if (block.file?.url) {
          imageUrl = buildImageUrl(block.file.url)
          altText = block.file.alternativeText || altText
          caption = block.file.caption
        }

        if (!imageUrl) {
          return (
            <div key={index} className="mb-6 p-4 bg-gray-100 border border-gray-300 rounded">
              <p className="text-gray-600">Image could not be loaded</p>
            </div>
          )
        }

        return (
          <div key={index} className="mb-6">
            <img
              src={imageUrl || "/placeholder.svg"}
              alt={altText}
              className="w-full h-auto rounded-lg"
              onError={(e) => {
                console.error("Image failed to load:", imageUrl)
                e.target.src = "/images/core/placeholder.jpg"
              }}
            />
            {caption && <p className="text-sm text-gray-600 italic mt-2 text-center">{caption}</p>}
          </div>
        )

      default:
        // Fallback for unknown block types
        console.warn("Unknown block type:", block.type)
        return (
          <div key={index} className="mb-4 p-2 bg-yellow-50 border border-yellow-200 rounded">
            <p className="text-sm text-yellow-800">Unsupported content block: {block.type}</p>
          </div>
        )
    }
  }

  const renderChildren = (children) => {
    if (!children || !Array.isArray(children)) return ""

    return children.map((child, index) => {
      if (child.type === "text") {
        let text = child.text || ""

        // Apply formatting
        if (child.bold) text = <strong key={index}>{text}</strong>
        if (child.italic) text = <em key={index}>{text}</em>
        if (child.underline) text = <u key={index}>{text}</u>
        if (child.strikethrough) text = <s key={index}>{text}</s>
        if (child.code)
          text = (
            <code key={index} className="bg-gray-100 px-1 rounded">
              {text}
            </code>
          )

        return text
      }

      if (child.type === "link") {
        return (
          <a
            key={index}
            href={child.url}
            className="text-[#B22234] hover:underline"
            target={child.url?.startsWith("http") ? "_blank" : "_self"}
            rel={child.url?.startsWith("http") ? "noopener noreferrer" : ""}
          >
            {renderChildren(child.children)}
          </a>
        )
      }

      return child.text || ""
    })
  }

  return <div className="prose max-w-none">{blocks.map((block, index) => renderBlock(block, index))}</div>
}
