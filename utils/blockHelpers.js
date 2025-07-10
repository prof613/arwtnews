/**
 * Extracts plain text from Strapi's dynamic zone blocks for previews.
 * This version is designed to read MARKDOWN content.
 *
 * @param {Array} blocks - The array of blocks from the rich_body field.
 * @param {number} [maxLength=200] - The maximum length of the returned text.
 * @returns {string} - A truncated, plain-text representation of the content with newlines.
 */
export const extractTextFromBlocks = (blocks, maxLength = 200) => {
  if (!Array.isArray(blocks) || blocks.length === 0) {
    return ""
  }

  let fullText = ""

  for (const block of blocks) {
    let blockText = ""
    // New Enhanced Text Block (contains MARKDOWN)
    if (block.__component === "blocks.enhanced-text" && block.content) {
      // Just clean the markdown, the newlines are already there.
      blockText = block.content
        .replace(/^##+\s*/gm, "") // Remove heading markers
        .replace(/\*\*(.*?)\*\*/g, "$1") // Remove bold
        .replace(/\*(.*?)\*/g, "$1") // Remove italic
    }
    // Legacy Paragraph or Heading Block
    else if ((block.type === "paragraph" || block.type === "heading") && Array.isArray(block.children)) {
      blockText = block.children.map((child) => child.text || "").join("")
    }

    if (blockText) {
      // Add a newline between blocks if fullText is not empty
      fullText += (fullText ? "\n" : "") + blockText.trim()
    }

    if (fullText.length > maxLength) {
      break
    }
  }

  // Final cleanup of whitespace
  const cleanText = fullText.trim()

  // Truncate if necessary
  if (cleanText.length <= maxLength) {
    return cleanText
  }

  const truncated = cleanText.substr(0, maxLength)
  const lastSpace = truncated.lastIndexOf(" ")
  const lastNewline = truncated.lastIndexOf("\n")
  const cutIndex = Math.max(lastSpace, lastNewline)

  return cutIndex > 0 ? truncated.substr(0, cutIndex) : truncated
}

// This function can be simplified or removed if not used elsewhere,
// as extractTextFromBlocks now handles the primary logic.
// export const getFirstParagraphText = (blocks) => {
//   if (!Array.isArray(blocks) || !blocks.length) return ""
//   // Find the first text-based block and return its content
//   for (const block of blocks) {
//     if (block.__component === "blocks.enhanced-text" && block.content) {
//       return block.content
//         .split("\n")[0]
//         .replace(/^##+\s*/, "")
//         .trim()
//     }
//     if (block.type === "paragraph" && block.children) {
//       return block.children.map((c) => c.text).join("")
//     }
//   }
//   return ""
// }
