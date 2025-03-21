const apiURL = process.env.REACT_APP_RENDER_API || "http://localhost:3000"

export const getPromptSets = async (userid) => {
  try {
    const response = await fetch(`${apiURL}/admin/${userid}/prompts`, {
      method: "GET",
      credentials: "include",
    })
    if (response.ok) {
      const data = await response.json()
      console.log("getPromptSets data:", data)
      return data
    }
    console.error("getPromptSets error:", response.statusText)
    return []
  } catch (error) {
    console.error("getPromptSets error:", error)
    return []
  }
}

export const getPrompts = async (userid, selectedSetName) => {
  if (!selectedSetName) return []
  try {
    const response = await fetch(`${apiURL}/admin/${userid}/prompts/${selectedSetName}/`, {
      method: "GET",
      credentials: "include",
    })
    if (response.ok) {
      const data = await response.json()
      console.log("getPrompts data:", data)
      return data
    }
    console.error("getPrompts error:", response.statusText)
    return []
  } catch (error) {
    console.error("fetchPrompts error:", error)
    return []
  }
}

export const createPrompts = async (userid, selectedSetName, prompts) => {
  if (!selectedSetName) return null
  console.log("Creating prompts:", prompts)
  try {
    const response = await fetch(`${apiURL}/admin/${userid}/prompts/${selectedSetName}/`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(prompts),
    })
    if (response.ok) {
      const data = await response.json()
      console.log("createPrompts success:", data)
      return data
    }
    console.error("savePrompts error:", response.statusText)
    return null
  } catch (error) {
    console.error("savePrompts error:", error)
    return null
  }
}

export const updatePrompt = async (userid, selectedSetName, promptData) => {
  if (!selectedSetName) return null
  console.log("Updating prompt:", promptData)
  try {
    const response = await fetch(`${apiURL}/admin/${userid}/prompts/${selectedSetName}`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(promptData),
    })
    if (response.ok) {
      const data = await response.json()
      console.log("updatePrompt success:", data)
      return data
    }
    console.error("updatePrompt error:", response.statusText)
    return null
  } catch (error) {
    console.error("updatePrompt error:", error)
    return null
  }
}

export const deletePrompt = async (userid, selectedSetName, promptName) => {
  if (!selectedSetName) return null
  console.log("Deleting prompt:", promptName)
  try {
    const response = await fetch(`${apiURL}/admin/${userid}/prompts/${selectedSetName}/${promptName}`, {
      method: "DELETE",
      credentials: "include",
    })
    if (response.ok) {
      const data = await response.json()
      console.log("deletePrompt success:", data)
      return data
    }
    console.error("deletePrompt error:", response.statusText)
    return null
  } catch (error) {
    console.error("deletePrompt error:", error)
    return null
  }
}