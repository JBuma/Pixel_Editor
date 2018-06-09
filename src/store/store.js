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
	},
	mutations: {
		setCurrentColor(state, currentColor) {
			state.currentColor = currentColor;
		},
		setCurrentTool(state, currentTool) {
			state.currentTool = currentTool;
		},
	},
	actions: {
		setCurrentColor({ commit }, currentColor) {
			commit('setCurrentColor', currentColor);
		},
		setCurrentTool({ commit }, currentTool) {
			commit('setCurrentTool', currentTool);
		},
	},
});
