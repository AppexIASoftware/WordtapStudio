export function createMetadata(example: string, note: string, category: string, tagsInput: string, noteType: "bulb" | "pin"): string {
  const tags = tagsInput.split(",").map((tag) => tag.trim().toLowerCase()).filter((tag) => tag.length > 0);
  return JSON.stringify({
    example: example.trim(),
    note: note.trim(),
    category: category.trim(),
    tags: tags.length > 0 ? tags : undefined,
    noteType,
  });
}
