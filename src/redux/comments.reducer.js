import * as ActionTypes from './actionTypes';

export const Comments = (state = { err: null, comments:[]}, action) => {
  switch (action.type) {
    case ActionTypes.ADD_COMMENTS:
      return {...state, err: null, comments: action.payload};

    case ActionTypes.COMMENTS_FAILED:
      return {...state, err: action.payload};

    case ActionTypes.ADD_COMMENT:
        var comment = action.payload;
        return { ...state, comments: state.comments.concat(comment)};

    default:
      return state;
  }
};