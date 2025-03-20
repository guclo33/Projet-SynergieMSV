const apiURL =  process.env.REACT_APP_RENDER_API || 'http://localhost:3000'

export const getPromptSets = async (userid) => {
    try {
        const response = await fetch(`${apiURL}/admin/${userid}/prompts`,{
            method: "GET",
            credentials: "include",
        })
        if(response.ok){
            const data = await response.json()
            console.log("getPromptSets data:", data)
            return data
        }
        console.error("getPromptSets error:", response.statusText)
        return
    } catch (error) {
        console.error("getPromptSets error:", error)
    }
}

export const getPrompts = async (userid, selectedSetName) => {
    if(!selectedSetId) return
    try {
        const response = await fetch(`${apiURL}/admin/${userid}/prompts/${selectedSetName}/`,{
            method: "GET",
            credentials: "include",

        })
        if(response.ok){
            const data = await response.json()
            return data
        }
        console.error("getPrompts error:", response.statusText)
        return
    } catch (error) {
        console.error("fetchPrompts error:", error)
    }
}

export const savePrompts = async (userid, selectedSetName, prompts) => {
    if(!selectedSetId) return
    try {
        const response = await fetch(`${apiURL}/admin/${userid}/prompts/${selectedSetName}/`,{
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(prompts)
        })
        if(response.ok){
            const data = await response.json()
            return data
        }
        console.error("savePrompts error:", response.statusText)
        return
    } catch (error) {
        console.error("savePrompts error:", error)
    }
}

export const updatePrompt = async (userid, selectedSetName, promptDatas) => {
    if(!selectedSetId) return
    try {
        const response = await fetch(`${apiURL}/admin/${userid}/prompts/${selectedSetName}`,{
            method: "PUT",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(promptDatas)
        })
        if(response.ok){
            const data = await response.json()
            return data
        }
        console.error("updatePrompt error:", response.statusText)
        return
    } catch (error) {
        console.error("updatePrompt error:", error)
    }
}