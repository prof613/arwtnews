// Helper function to extract text from blocks for excerpts
export const extractTextFromBlocks = (blocks, maxLength = 200) => {
  if (!blocks || !Array.isArray(blocks)) return ""

  let text = ""
  let isFirstBlock = true

  for (const block of blocks) {
    // Add line breaks between blocks (except for the first one)
    if (!isFirstBlock && text.length > 0) {
      text += "\n"
    }

    if (block.type === "paragraph" || block.type === "heading") {
      if (block.children && Array.isArray(block.children)) {
        let blockText = ""
        for (const child of block.children) {
          if (child.type === "text" && child.text) {
            blockText += child.text
          }
        }
        if (blockText.trim()) {
          text += blockText.trim()
        }
      }
    }

    isFirstBlock = false
    if (text.length > maxLength) break
  }

  return text.substring(0, maxLength).trim()
}

// Helper to get first paragraph text (skipping headings for date inline)
export const getFirstParagraphText = (blocks) => {
  if (!blocks || !Array.isArray(blocks)) return ""

  for (const block of blocks) {
    if (block.type === "paragraph" && block.children && Array.isArray(block.children)) {
      let text = ""
      for (const child of block.children) {
        if (child.type === "text" && child.text) {
          text += child.text
        }
      }
      if (text.trim()) {
        return text.trim()
      }
    }
  }
  return ""
}
