export const extractTextFromBlocks = (blocks, maxLength = 100) => {
  if (!blocks || !Array.isArray(blocks)) {
    return ""
  }

  let extractedText = ""

  blocks.forEach((block, blockIndex) => {
    if (block.__component === "blocks.enhanced-text") {
      let blockText = ""

      if (block.content && Array.isArray(block.content)) {
        block.content.forEach((contentBlock) => {
          if (contentBlock.children && Array.isArray(contentBlock.children)) {
            contentBlock.children.forEach((child) => {
              if (child.type === "text" && child.text) {
                blockText += child.text + " "
              }
            })
          }
        })
      }

      // Add the block text with spacing
      if (blockText.trim()) {
        // Add line break between blocks (except for first block)
        if (extractedText && blockIndex > 0) {
          extractedText += " "
        }
        extractedText += blockText.trim()
      }
    } else if (block.type === "paragraph") {
      if (Array.isArray(block.children)) {
        block.children.forEach((child) => {
          if (child.type === "text") {
            extractedText += child.text || ""
          }
        })
      }
    } else if (block.type === "heading") {
      if (Array.isArray(block.children)) {
        block.children.forEach((child) => {
          if (child.type === "text") {
            extractedText += child.text || ""
          }
        })
      }
    }
  })

  // Clean up and truncate
  extractedText = extractedText.replace(/<[^>]*>/g, "").trim()

  if (extractedText.length > maxLength) {
    const truncated = extractedText.substring(0, maxLength)
    const lastSpace = truncated.lastIndexOf(" ")
    return lastSpace > 0 ? truncated.substring(0, lastSpace) : truncated
  }

  return extractedText
}
