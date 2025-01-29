
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
        updateSingleGroupsData(state, action) {
            console.log("BEFORE UPDATE:", JSON.parse(JSON.stringify(state.groupesData.groupesData)));

            if (!Array.isArray(state.groupesData.groupesData)) {
                console.error("❌ ERREUR: `groupesData` n'est pas un tableau!", state.groupesData.groupesData);
                return;
            }

            const { groupeData, id } = action.payload;

            state.groupesData.groupesData = state.groupesData.groupesData.map(groupe =>
                groupe.id === id ? { ...groupe, ...groupeData } : groupe
            );

            console.log("AFTER UPDATE:", state.groupesData.groupesData);
    
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
    resetNewGroup,
    updateSingleGroupsData

} = adminSlice.actions

export default adminSlice.reducer