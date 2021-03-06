/* global fetch */
/**
 * Internal dependencies
 */
import {
	SETTING_LOAD_START,
	SETTING_LOAD_SUCCESS,
	SETTING_LOAD_FAILED,
	SETTING_SAVING,
	SETTING_SAVED,
	SETTING_SAVE_FAILED,
	STATUS_COMPLETE,
	SETTING_LOAD_STATUS,
} from './type';
import { getApi, RedirectionApi } from 'lib/api';

export const loadSettings = () => ( dispatch, getState ) => {
	if ( getState().settings.loadStatus === STATUS_COMPLETE ) {
		return null;
	}

	getApi( RedirectionApi.setting.get() )
		.then( json => {
			dispatch( { type: SETTING_LOAD_SUCCESS, values: json.settings, groups: json.groups, postTypes: json.post_types, installed: json.installed, canDelete: json.canDelete } );
		} )
		.catch( error => {
			dispatch( { type: SETTING_LOAD_FAILED, error } );
		} );

	return dispatch( { type: SETTING_LOAD_START } );
};

export const saveSettings = settings => dispatch => {
	getApi( RedirectionApi.setting.update( settings ) )
		.then( json => {
			dispatch( { type: SETTING_SAVED, values: json.settings, groups: json.groups, installed: json.installed } );
		} )
		.catch( error => {
			dispatch( { type: SETTING_SAVE_FAILED, error } );
		} );

	return dispatch( { type: SETTING_SAVING } );
};

export const deletePlugin = () => dispatch => {
	getApi( RedirectionApi.plugin.delete() )
		.then( json => {
			document.location.href = json.location;
		} )
		.catch( error => {
			dispatch( { type: SETTING_SAVE_FAILED, error } );
		} );

	return dispatch( { type: SETTING_SAVING } );
};

export const loadStatus = () => dispatch => {
	getApi( RedirectionApi.plugin.status() )
		.then( json => {
			dispatch( { type: SETTING_LOAD_STATUS, pluginStatus: json } );
		} )
		.catch( error => {
			dispatch( { type: SETTING_LOAD_FAILED, error } );
		} );

	return dispatch( { type: SETTING_LOAD_START } );
};

export const fixStatus = () => dispatch => {
	getApi( RedirectionApi.plugin.fix() )
		.then( json => {
			dispatch( { type: SETTING_LOAD_STATUS, pluginStatus: json } );
		} )
		.catch( error => {
			dispatch( { type: SETTING_LOAD_FAILED, error } );
		} );

	return dispatch( { type: SETTING_LOAD_START } );
};
