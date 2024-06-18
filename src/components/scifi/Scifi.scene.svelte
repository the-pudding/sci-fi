<script>
	import { fade } from 'svelte/transition';
	export let value, barHeight, bottomPadding, viewType, sceneMax, sceneNum, nextDecade, decade, progress, sceneRatio, prefersReducedMotion;
	let opacity = 0;
	let stages = [];
	const scalings = {
		"background": 0,
		"midground": 0.3 / 2,
		"foreground": 0.7 / 2,
		"frontground": 0.54 / 2
	};
	const sceneHeight = {
		"background": 99,
		"midground": 108,
		"foreground": 126,
		"frontground": 130
	};

	let sceneAdjust = 0;
	$: {
		if (viewType == "zoom2030" && decade == "2020") {
			opacity = 0
		} else if (viewType == "zoom2020" && decade == "2030") {
			opacity = 0
		} else if (viewType != "all") {
			opacity = 1;
		} else {
			opacity = 0;
		}
		stages = Array.from({ length: sceneMax + 1 }, (_, i) => i);

		sceneAdjust = 0;
		if (viewType.indexOf("v2") != -1) {
			sceneAdjust = 4;
		}
	}
</script>

{#if (decade=="2020" && viewType=="zoom2020") || (decade=="2030" && viewType=="zoom2030") || (decade=="1950" && viewType=="zoom1950") || (decade=="1950" && viewType=="zoom1950v2")}
<div class="scene scene-{decade} {nextDecade} scene{opacity}" style="height: {barHeight}px; width: {barHeight*sceneRatio}px; bottom: {bottomPadding}px; opacity: {opacity};" transition:fade>
	
	<div class="foreground_color"></div>
	<div class="background_color"></div>

	{#each ["left", "right"] as side}
		{#each Object.entries(scalings) as [key, scale]}
			{#if key =="background" && side == "right"}
			{:else}
				<div class="{key}_container scene_containers {side}" 
					style="transform: perspective(0) translate3d(0, 0, 0); top: {-(sceneNum + sceneAdjust) / sceneMax * 100 * scale}%; height: {sceneHeight[key]}%;
					background-image: url('assets/scifi/{decade}-{key}{key != 'background' ? `-${side}` : ''}.png');">
				</div>
			{/if}
		{/each}
	{/each}

	<div class="shadow"></div>
</div>
{/if}

<style>
	.scene {
		position: absolute;
		bottom: 60px;
		right: 100%;
		height: calc(100% - 60px);
		width: 100%;
		transition: opacity 2000ms cubic-bezier(0.455, 0.030, 0.515, 0.955);
		transition-timing-function: cubic-bezier(0.455, 0.030, 0.515, 0.955);
		overflow: hidden;
		pointer-events: none;
	}
	.scene .background_color {
		background: #9D47AA;
		position: absolute;
		top: 0px;
		height: 50%;
		width: 100%;
	}
	.scene-1950 .background_color {
		background: #e9abff;
	}
	.scene-2030 .background_color {
		background: #f6ccff;
	}

	.scene .foreground_color {
		background: #a35c9e;
		position: absolute;
		bottom: 0px;
		height: 20%;
		width: 100%;
	}
	.scene-1950 .foreground_color, .scene-2020 .foreground_color  {
		background: #200724;
		height: 43vh;
	}
	.scene-2030 .foreground_color {
		border-bottom: 2px solid #200724;
	}
	.scene1 {
		pointer-events: auto;
	}
	.scene.nextDecade {
		right: auto;
		left: 100%;
	}
	.scene_containers {
		display: block;
		position: absolute;
		left: 0px;
		bottom: 1px;
		width: 100%;
		height: 100%;
		transform-origin: bottom left;
		transition: top 3500ms cubic-bezier(0.455, 0.030, 0.515, 0.955);
		transition-timing-function: cubic-bezier(0.455, 0.030, 0.515, 0.955);
		text-align: right;
		font-size: 3px;
		line-height: 3px;
		background-size: 100% 100%;
		background-repeat: repeat-y;
		image-rendering: optimizeSpeed;
		image-rendering: -moz-crisp-edges;
		image-rendering: -o-crisp-edges;
		image-rendering: -webkit-optimize-contrast;
		image-rendering: pixelated;
		image-rendering: optimize-contrast;
		-ms-interpolation-mode: nearest-neighbor;
	}
	.scene_containers {
		transform-origin: bottom left;
	}
	.scene_containers.right {
		left: auto;
		right: 0px;
		text-align: left;
		transform-origin: top right;
		background-position: top right;
	}
	.shadow {
		display: block;
		background: linear-gradient(to bottom, rgba(28, 5, 38, 0) 0%, #200724 50%);
		height: 2vh;
		position: absolute;
		width: 100%;
		bottom: -2px;
		left: 0px;
		z-index: 10000;
		transform: translate3d(0,0,10px);
	}
	.scene-2030 .shadow {
		background: linear-gradient(to bottom, rgba(28, 5, 38, 0) 0%, #a35c9e 50%);
	}
	.num {
		position: absolute;
		left: 0;
		background-size: cover;
		background-repeat: no-repeat;
		border: 0.01px solid red;
		overflow: hidden;
		color: white;
	}

	/* Specific styles for different containers */
	.frontground_container {
		width: 35%;
		left: 0%;
		z-index: 100;
	}
	.scene-2020 .frontground_container.left {
		width: 43%;
	}
	.scene-2020 .frontground_container.right {
		width: 50%;
		right: -17%;
	}
	.scene-1950 .frontground_container.left {
		width: 55%;
		left: 15%;
		margin-top: -8%;
	} 
	.scene-1950 .frontground_container.right {
		width: 44%;
		right: 10%;
	} 
	.scene-2030 .frontground_container.left {
		width: 44%;
		left: -12%;
		margin-top: -18%;
		height: 140% !important;
	} 
	.scene-2030 .frontground_container.right {
		right: 33%;
	}

	.foreground_container {
		width: 16%;
		left: 0%;
		z-index: 90;
	}
	.num.foreground {
		width: 100%;
	}
	.scene-2030 .right.foreground_container {
		height: 140% !important;
	}
	.scene-2030 .left.foreground_container {
		height: 108% !important;
		width: 35%;
		left: -5%;
	}

	.midground_container {
		width: 35%;
		left: 0%;
		z-index: 80;
	}
	.scene-1950 .right.midground_container {
		right: 10%;
	}
	.scene-1950 .left.midground_container {
		left: 10%;
	}
	.num.midground {
		width: 100%;
	}
	.scene-2030 .right.midground_container {
		right: 12%;
		width: 48%;
		height: 110% !important;
	}
	.scene-2030 .left.midground_container {
		left: 2%;
		width: 50%;
		height: 110% !important;
	}

	.background_container {
		width: 66%;
		left: 17%;
		right: auto;
		text-align: center;
		z-index: 70;
	}
	.scene-1950 .background_container {
		left: 22%;
	}
	.scene-2030 .background_container {
		left: 0%;
		width: 100%;
	}
	.num.background {
		width: 100%;
	}
</style>
