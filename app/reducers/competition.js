'use strict';
import { createSelector } from 'reselect';
import Immutable from 'immutable';
import {
  POST_ACTION_REQUEST,
  POST_ACTION_SUCCESS,
  POST_ACTION_FAILURE,
  GET_ACTION_TYPES_REQUEST,
  GET_ACTION_TYPES_SUCCESS,
  GET_ACTION_TYPES_FAILURE,
  OPEN_TEXTACTION_VIEW,
  CLOSE_TEXTACTION_VIEW,
  OPEN_CHECKIN_VIEW,
  CLOSE_CHECKIN_VIEW,
  SHOW_NOTIFICATION,
  HIDE_NOTIFICATION,
  UPDATE_COOLDOWNS,
  SET_EDITABLE_IMAGE,
  CLEAR_EDITABLE_IMAGE,
} from '../actions/competition';
import ActionTypes from '../constants/ActionTypes';

const initialState = Immutable.fromJS({
  isSending: false,
  isError: false,
  isLoadingActionTypes: false,
  isErrorLoadingActionTypes: false,
  actionTypes: [],
  disabledActionTypes: [],
  cooldownTimes: {},
  isTextActionViewOpen: false,
  isCheckInViewOpen: false,
  isNotificationVisible: false,
  notificationText: '',
  editableImage: null,
});

const getDisabledActions = state => {
  // Called once a second from FeedList (UPDATE_COOLDOWNS action)
  // - go through all cooldownTimes
  // - compare them to current time
  // - if actionType has cooldownTime and cooldownTime > now, add actionType to disabledActionTypes list

  const now = new Date().getTime();
  return state
    .get('actionTypes')
    .map(at => at.get('code'))
    .reduce((acc, curr) => {
      const cooldownEnd = state.getIn(['cooldownTimes', curr]);
      const isActionCoolingDown = cooldownEnd && cooldownEnd > now;
      if (isActionCoolingDown) {
        return acc.push(curr);
      }

      return acc;
    }, Immutable.List());
};

export const getActionTypes = store => store.competition.get('actionTypes');

const hiddenActionTypes = [ActionTypes.COMMENT];
export const getActionTypesForFeed = createSelector(getActionTypes, actionTypes => {
  let feedActionTypes = actionTypes.filter(type => hiddenActionTypes.indexOf(type.get('code')) < 0);

  return feedActionTypes;
});

export default function competition(state = initialState, action) {
  switch (action.type) {
    case OPEN_TEXTACTION_VIEW:
      return state.set('isTextActionViewOpen', true);
    case CLOSE_TEXTACTION_VIEW:
      return state.set('isTextActionViewOpen', false);
    case OPEN_CHECKIN_VIEW:
      return state.set('isCheckInViewOpen', true);
    case CLOSE_CHECKIN_VIEW:
      return state.set('isCheckInViewOpen', false);
    case POST_ACTION_REQUEST:
      return state.merge({
        isSending: true,
        isError: false,
      });
    case POST_ACTION_SUCCESS:
      const actionType = state
        .get('actionTypes')
        .find(at => at.get('code') === action.payload.type);
      const actionCooldownTime = actionType ? actionType.get('cooldown') : 0;
      const availableNextTime = new Date().getTime() + actionCooldownTime;
      return state
        .merge({ isSending: false, isError: false })
        .update('cooldownTimes', times => times.set(action.payload.type, availableNextTime));
    case POST_ACTION_FAILURE:
      return state.merge({
        isSending: false,
        isError: true,
      });
    case GET_ACTION_TYPES_REQUEST:
      return state.merge({
        isLoadingActionTypes: true,
        isErrorLoadingActionTypes: false,
      });
    case GET_ACTION_TYPES_SUCCESS:
      return state.merge({
        isLoadingActionTypes: false,
        isErrorLoadingActionTypes: false,
        actionTypes: action.payload,
      });
    case GET_ACTION_TYPES_FAILURE:
      return state.merge({
        isLoadingActionTypes: false,
        isErrorLoadingActionTypes: true,
      });
    case SHOW_NOTIFICATION:
      return state.merge({
        isNotificationVisible: true,
        notificationText: action.payload,
      });
    case HIDE_NOTIFICATION:
      return state.merge({
        isNotificationVisible: false,
        notificationText: '',
      });
    case UPDATE_COOLDOWNS:
      return state.set('disabledActionTypes', getDisabledActions(state));
    case SET_EDITABLE_IMAGE:
      return state.set('editableImage', action.payload);
    case CLEAR_EDITABLE_IMAGE:
      return state.set('editableImage', null);
    default:
      return state;
  }
}
