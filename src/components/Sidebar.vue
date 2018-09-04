<template>
	<aside class="sidebar" :class="{collapsed: isCollapsed, collapsible}">
	<!-- <div v-if="collapsible" @click="toggleSidebar" class="collapse-button"> -->
	</div>
		<slot>
		
		</slot>
	</aside>
</template>

<script>
	import colorSelector from './Tools/colorSelector.vue';
	import toolbox from './Tools/Toolbox.vue';
	export default {
		components: {
			colorSelector,
			toolbox,
		},
		props:{
			side:{
				type: String,
				default:"left"
			},
			collapsible:{
				type: Boolean,
				default: false
			}
		},
		data(){
			return{
				isCollapsed:false
			}
		},
		methods:{
			toggleSidebar(){
				this.isCollapsed = !this.isCollapsed;
			}
		}
	};

</script>

<style lang="scss">
$collapse-button--width:40px;
	@import '../static/globals.scss';
	.sidebar {
		padding: $spacing--medium;
		height: 100%;
		min-width: $sidebar--min-width;
		max-width: $sidebar--max-width;
		width: $sidebar--width;
		background-color: $background--dark;
		color: $text--dark;

		transition:transform 0.3s ease-in-out;

		&.small:not(.collapsed){
			min-width: $sidebar--min-width ;
			max-width: $sidebar--max-width / 2;
			width: $sidebar--width / 2;
		}
		&.collapsed{
			min-width:none;
			width:0px;
			transform:translateX(100%);
		}
		&.collapsible{
			position:relative;
			&:before{
				font-family:Icons;
				
				position:absolute;
				top:50%;
				left:$spacing--medium * -3;
				padding:$spacing--large $spacing--medium;
				margin:0;
				width:$collapse-button--width;
				// height:40px;
				// transform: translate(($collapse-button--width + $spacing--medium) * -1, 45vh );
				background-color:red;
			}
			&:not(.collapsed):before{
				content:"\f104";
			}
			&.collapsed:before{
				content:"\f105"
			}
		}
	}
	

</style>
