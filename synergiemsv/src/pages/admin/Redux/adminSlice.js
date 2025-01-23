
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    clientsData : [],
    leadersData : [],
    photosProfile : [],
    newGroup: {
        groupe_name : null,
        have_leader : false,
        leader_id : null,
        members_ids : [],
        date_presentation : null,


    },
    groupesData : []
}



const adminSlice = createSlice({
    name: "admin",
    initialState: initialState,
    reducers: {
        setClientsData(state,action) {
            state.clientsData = action.payload
        },
        setLeadersData(state, action) {
            state.leadersData = action.payload
        },
        setPhotosProfile(state, action) {
            state.photosProfile = action.payload
        },
        setNewGroup(state, action) {
            const { key, value } = action.payload
            state.newGroup[key] = value
        },
        setGroupesData(state, action) {
            state.groupesData = action.payload
        }

       
    
}})

export const {
    setClientsData,
    setGroupesData,
    setLeadersData,
    setNewGroup,
    setPhotosProfile

} = adminSlice.actions

export default adminSlice.reducer