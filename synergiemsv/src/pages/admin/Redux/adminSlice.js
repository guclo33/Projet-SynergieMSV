
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    clientsData : [],
    leadersData : [],
    photosProfile : [],
    newGroup: {
        group_name : "",
        have_leader : false,
        nom_leader : "",
        leader_id : null,
        members_ids : [],
        date_presentation : null,
        active : true


    },
    newLeader : {
        nom_leader : "",
        email : "",
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
        },
        setNewLeader(state, action) {
            const { key, value } = action.payload
            state.newLeader[key] = value
        },
        appendMembersIds(state,action) {
            state.newGroup.members_ids.push(action.payload)
        },
        removeMembersIds(state,action) {
            state.newGroup.members_ids = state.newGroup.members_ids.filter(id => id!== action.payload)
        },
        resetNewGroup(state,action) {
            state.newGroup = {
                group_name : "",
                have_leader : false,
                nom_leader : "",
                leader_id : null,
                members_ids : [],
                date_presentation : null,
                active : true
            }
        }

       
    
}})

export const {
    setClientsData,
    setGroupesData,
    setLeadersData,
    setNewGroup,
    setPhotosProfile,
    setNewLeader,
    appendMembersIds,
    removeMembersIds,
    resetNewGroup

} = adminSlice.actions

export default adminSlice.reducer