/* eslint-disable */

export const UserSchema = {
    name: 'User',
    properties: {
        _id: 'objectId?',
        avatar: 'string?',
        userID: 'string?',
        username: 'string?',
    },
    primaryKey: '_id',
};

export const createUser = async (username) => {


}
export const editUser = async (username) => {

}

export const getCurrentUserData = async () => {

}
export const getAllUsers = async () => {


}
export const getUserById = async (id) => {


}
export const getCurrentUserLists = async () => {



}


export const subscribeUser = async (id,username,subUsername) => {


}
export const unSubscribeUser = async (id) => {

}

export const getSubscribers = async (id) => {


}
export const getSubscriptions = async (id) => {

}
export const getUserName=async(id)=>{

}
export const getUsersReviews=async (id,userID,username) => {
}
