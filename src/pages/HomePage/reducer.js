/*
 * HomeReducer
 *
 */
const initState = {
    allAsset: [],
};
export default function HomePageReducer (state = initState, action) {
    switch (action.type) {
    case "HOME_GETALLASSET_REDUCER":
        console.log('VOTE_LIST_REDUCER')
        return Object.assign({}, state, {
            "allAsset": action.data
        });
    default:
        return state;
    }
}
