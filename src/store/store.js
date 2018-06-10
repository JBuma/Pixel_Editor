import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
	strict: true,
	state: {
		currentColor: {
			r: 0,
			g: 0,
			b: 0,
			a: 255,
		},
		currentTool: {},
		settings: {
			zoomSensitivity: 7.5,
			gridDimensions: {
				x: 16,
				y: 16,
			},
		},
		imageBuffer: new Uint8ClampedArray(),
	},
	mutations: {
		setCurrentColor(state, currentColor) {
			state.currentColor = currentColor;
		},
		setCurrentTool(state, currentTool) {
			state.currentTool = currentTool;
		},
		setSettings(state, settings) {
			state.settings = settings;
		},
		setBuffer(state, buffer) {
			state.imageBuffer = buffer;
		},
	},
	actions: {
		setCurrentColor({
			commit
		}, currentColor) {
			commit('setCurrentColor', currentColor);
		},
		setCurrentTool({
			commit
		}, currentTool) {
			commit('setCurrentTool', currentTool);
		},
		setSettings({
			commit
		}, settings) {
			commit('setSettings', settings);
		},
		setBuffer({
			commit
		}, buffer) {
			commit('setBuffer', buffer);
		},
	},
});
