import React from "react"
import { getStrapiMedia } from "../utils/media" // Ensure this path is correct

export default function BlockRenderer({ blocks, datePrefix = null }) {
  if (!blocks || !Array.isArray(blocks)) {
    return <p>No content available.</p>
  }

  const renderBlock = (block, index) => {
    switch (block.__component) {
      case "blocks.enhanced-text":
        return renderEnhancedText(block, index, blocks)
      case "blocks.enhanced-image":
        return renderEnhancedImage(block, index)
      // Fallback for legacy blocks
      default:
        return renderLegacyBlock(block, index)
    }
  }

  const renderEnhancedText = (block, index, allBlocks) => {
    const { content, style, layout } = block

    // --- SIMPLIFIED LOGIC BASED ON YOUR PROPOSAL ---
    // 1. Check if this is the very first block in the article.
    const isTheFirstBlock = index === 0

    // 2. Check if the content of this block starts with a heading.
    const contentStartsWithHeading = (content || "").trim().startsWith("#")

    // 3. Inject the date ONLY if this is the first block AND it does not start with a heading.
    const shouldInjectDate = isTheFirstBlock && datePrefix && !contentStartsWithHeading
    // --- END OF SIMPLIFIED LOGIC ---

    const baseClasses = "mb-4"
    let containerClasses = ""
    let contentClasses = ""

    switch (style) {
      case "pullquote":
        containerClasses =
          "border-l-4 border-[#B22234] pl-6 pr-4 py-4 bg-gray-50 italic text-lg font-medium text-gray-700 my-6"
        break
      case "infobox":
        containerClasses = "border border-blue-200 bg-blue-50 p-4 rounded-lg my-4"
        contentClasses = "text-blue-800"
        break
      case "alert":
        containerClasses = "border border-yellow-200 bg-yellow-50 p-4 rounded-lg my-4"
        contentClasses = "text-yellow-800"
        break
      case "breaking":
        containerClasses = "border border-red-200 bg-red-50 p-4 rounded-lg my-4"
        contentClasses = "text-red-800 font-semibold"
        break
      default:
        contentClasses = "text-gray-600"
    }

    if (layout === "twocolumn") {
      containerClasses += " md:columns-2 md:gap-6"
    }

    let processedContent = (content || "")
      .replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold mb-4 text-[#3C3B6E]">$1</h1>')
      .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-bold mb-3 text-[#3C3B6E]">$1</h2>')
      .replace(/^### (.*$)/gm, '<h3 class="text-xl font-bold mb-2 text-[#3C3B6E]">$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/\n/g, "<br />")

    if (shouldInjectDate) {
      // Prepend the date string. The space after the date is important for inline spacing.
      processedContent = datePrefix + processedContent
    }

    return (
      <div key={index} className={`${baseClasses} ${containerClasses}`}>
        <div className={contentClasses} dangerouslySetInnerHTML={{ __html: processedContent }} />
      </div>
    )
  }

  const renderEnhancedImage = (block, index) => {
    const { image, caption, alignment = "center", size = "medium" } = block
    const imageUrl = getStrapiMedia(image)
    const altText = image?.data?.attributes?.alternativeText || "Article image"

    if (!imageUrl) return null

    const sizeClasses = {
      small: "max-w-xs",
      medium: "max-w-md",
      large: "max-w-2xl",
      full: "w-full",
    }

    const alignmentClasses = {
      left: "float-left mr-6 mb-4",
      right: "float-right ml-6 mb-4",
      center: "mx-auto",
      full: "",
    }

    return (
      <figure key={index} className={`${sizeClasses[size]} ${alignmentClasses[alignment]}`}>
        <img
          src={imageUrl || "/placeholder.svg"}
          alt={altText}
          className="h-auto rounded-lg w-full"
          onError={(e) => {
            e.target.src = "/images/core/placeholder.jpg"
          }}
        />
        {caption && <figcaption className="text-sm text-gray-600 italic mt-2 text-center">{caption}</figcaption>}
      </figure>
    )
  }

  // Legacy block renderer for backward compatibility
  const renderLegacyBlock = (block, index) => {
    switch (block.type) {
      case "paragraph":
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
        const imageUrl = getStrapiMedia(block.image)
        const altText = block.image?.data?.attributes?.alternativeText || "Article image"
        const caption = block.image?.data?.attributes?.caption
        if (!imageUrl) return null
        return (
          <div key={index} className="mb-6">
            <img src={imageUrl || "/placeholder.svg"} alt={altText} className="w-full h-auto rounded-lg" />
            {caption && <p className="text-sm text-gray-600 italic mt-2 text-center">{caption}</p>}
          </div>
        )

      default:
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

  return (
    <div className="prose max-w-none">
      {blocks.map((block, index) => renderBlock(block, index))}
      {/* Clear floats after all blocks */}
      <div className="clear-both"></div>
    </div>
  )
}
