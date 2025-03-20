const apiURL =  process.env.REACT_APP_RENDER_API || 'http://localhost:3000'

export const getPrompts = async (userid, selectedSetId) => {
    if(!selectedSetId) return
    try {
        const response = await fetch(`${apiURL}/admin/${userid}/prompts/${selectedSetId}/`,{
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

export const savePrompts = async (userid, selectedSetId, prompts) => {
    if(!selectedSetId) return
    try {
        const response = await fetch(`${apiURL}/admin/${userid}/prompts/${selectedSetId}/`,{
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

export const updatePrompt = async (userid, selectedSetId, promptName, promptValue) => {
    if(!selectedSetId) return
    try {
        const response = await fetch(`${apiURL}/admin/${userid}/prompts/${selectedSetId}/${promptName}`,{
            method: "PUT",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({value: promptValue})
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