<script>
	export let value, barHeight, bottomPadding, viewType, sceneMax, sceneNum, nextDecade, decade, progress;
	let opacity = 0;
	let stages = [];
	const scalings = {
		"background": 1,
		"midground": 1.5,
		"foreground": 2
	};
	const sceneHeight = {
		"background": 100,
		"midground": 125,
		"foreground": 95
	};
	let sceneAdjust = 0;
	$: {
		if (viewType != "") {
			opacity = 1;
		} else {
			opacity = 0;
		}
		stages = Array.from({ length: sceneMax + 1 }, (_, i) => i);

		sceneAdjust = 0;
		if (viewType.indexOf("v2") != -1) {
			sceneAdjust = 0.5;
		}
	}
</script>

<div class="scene {nextDecade} scene{opacity}" style="height: {barHeight}px; bottom: {bottomPadding}px; opacity: {opacity};">
	{#each ["","right_side"] as side}
	{#each Object.entries(scalings) as [key, scale]}
		<div class="{key}_container scene_containers {side}" 
			style="
				transform: perspective(0) translate3d(0, 0, 0) scale({scale});
				top: {key === 'background' ? 0 : -(sceneNum / sceneMax + sceneAdjust) * scale * 30}%; z-index: {scale*10};
				background-image: url('assets/scifi/{key}.png');"
		>
			<!-- {#each stages as num}
			<div class="num {key}" style="top:{num * sceneHeight[key] / stages.length}%; height: {sceneHeight[key] / stages.length}%;">
				{num}
			</div>
			{/each} -->
			
		</div>
	{/each}
	{/each}
</div>

<style>
	.scene {
		position: absolute;
		bottom: 60px;
		right: 100%;
		height: calc(100% - 60px);
		width: 100%;
/*		border: 0.01px solid #000;*/
		transition: opacity 2000ms cubic-bezier(0.455, 0.030, 0.515, 0.955);
		transition-timing-function: cubic-bezier(0.455, 0.030, 0.515, 0.955);
		overflow: hidden;
		pointer-events: none;
		image-rendering: -moz-crisp-edges;
		image-rendering: -moz-crisp-edges;
		image-rendering: -o-crisp-edges;
		image-rendering: -webkit-optimize-contrast;
		-ms-interpolation-mode: nearest-neighbor;
	}
	.scene1 {
		pointer-events: auto;
	}
	.scene.nextDecade {
		right: auto;
		left: 100%;
	}
	/*.scene img {
		position: absolute;
		left: 0px;
		top: 0px;
		width: 100%;
		height: auto;
		image-rendering: -moz-crisp-edges;
		image-rendering: -moz-crisp-edges;
		image-rendering: -o-crisp-edges;
		image-rendering: -webkit-optimize-contrast;
		-ms-interpolation-mode: nearest-neighbor;
	}*/
	.num {
		position: absolute;
		left: 0;
		border: 0.01px solid #000;
	}
	.scene_containers {
		position: absolute;
		left: 0px;
		top: 0px;
		width: 100%;
		height: 100%;
		transform-origin: top left;
		transition: top 2000ms cubic-bezier(0.455, 0.030, 0.515, 0.955);
		transition-timing-function: cubic-bezier(0.455, 0.030, 0.515, 0.955);
		text-align: right;
		font-size: 3px;
		line-height: 3px;
		background-size: 100% auto;
		background-repeat: repeat-y;
/*		box-shadow: 0px 0px 3px 0px;*/
	}
	.scene::after {
		content: "";
		background: linear-gradient(to bottom, rgba(28, 5, 38, 0) 0%, #1c0526 80%);
		height: 45px;
		position: absolute;
		width: 100%;
		bottom: -3px;
		left: 0px;
		z-index: 999;
	}
	.scene_containers.right_side {
		left: auto;
		right: 0px;
		text-align: left;
		transform-origin: top right;
	}
	.foreground_container {
		width: 10%;
	}
	.num.foreground {
		width: 100%;
		background: #333;
	}
	.midground_container {
		width: 25%;
	}
	.num.midground {
		width: 100%;
		background: #888;
	}
	.background_container {
		width: 50%;
		left: 25% !important;
		right: auto !important;
		text-align: center !important;
	}
	.num.background {
		width: 100%;
		background: #aaa;
	}
</style>
