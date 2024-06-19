<script>
	import { fade } from 'svelte/transition';
	export let value, barHeight, bottomPadding, viewType, sceneMax, sceneNum, nextDecade, decade, progress, sceneRatio, prefersReducedMotion, w, h;
	let opacity = 0;
	let stages = [];
	const scalings = {
		"background": .6,
		"midground": .8,
		"foreground": 1,
		"frontground": 1.1
	};
	const sceneHeight = {
		"background": 99,
		"midground": 108,
		"foreground": 132,
		"frontground": 80
	};

	$: {
		w, h;
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
		if (sceneNum == -1) {
			sceneNum = -0.9;
		}
	}
</script>

{#if (decade=="2020" && viewType=="zoom2020") || (decade=="2030" && viewType=="zoom2030") || (decade=="1950" && viewType=="zoom1950")}
<div class="scene scene-{decade} {nextDecade} scene{opacity}" style="width: {w}px; height: {w*2.8}px; bottom: {bottomPadding}px; opacity: {opacity};" transition:fade>
	<div class="background_color" style="margin-top:{-(sceneNum+1) / sceneMax * 100}%"></div>
	<div class="foreground_color" style="margin-top:{-(sceneNum+1) / sceneMax * 100}%"></div>
	

	{#each ["left", "right"] as side}
	{#each Object.entries(scalings) as [key, scale]}
	{#if key =="background" && side == "right"}
	{:else}
	{#if decade=="2030" && key=="background"}
	<div class="{key}_container scene_containers" 
	style="top: {-(sceneNum) / (sceneMax-0.8) * 100 * 0.5}%; height: {sceneHeight[key]* (30-sceneNum)/34}%;
	background-image: url('assets/scifi/{decade}-{key}{key != 'background' ? `-${side}` : ''}.png');">
	</div>
	{:else}
	<div class="{key}_container scene_containers {side}" 
	style="top: {-(sceneNum) / (sceneMax-0.8) * 100 * scale}%; height: {sceneHeight[key]}%;
	background-image: url('assets/scifi/{decade}-{key}{key != 'background' ? `-${side}` : ''}.png');">
	</div>
	{/if}
	{/if}
	{/each}
	{/each}
	{#if decade=="2030"}
	<div class="end_container scene_containers" 
	style="top: {-(sceneNum) / (sceneMax-0.8) * 100 * 1}%;
	background-image: url('assets/scifi/2030-end.png');">
	</div>
	{/if}

<div class="shadow"></div>
</div>
{/if}

<style>
	.scene {
		position: absolute;
		top: 0px;
		left: 0%;
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
		height: 30%;
		width: 100%;
		transition: margin-top 3400ms cubic-bezier(0.455, 0.030, 0.515, 0.955);
		transition-timing-function: cubic-bezier(0.455, 0.030, 0.515, 0.955);
	}
	
	.scene .foreground_color {
		background: #a35c9e;
		position: absolute;
		bottom: 0px;
		height: 65%;
		width: 100%;
		transition: margin-top 3400ms cubic-bezier(0.455, 0.030, 0.515, 0.955);
		transition-timing-function: cubic-bezier(0.455, 0.030, 0.515, 0.955);
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
		bottom: 0px;
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
		width: 40%;
		left: 0%;
		z-index: 100;
	}
	
	

	.foreground_container {
		width: 16%;
		left: 0%;
		z-index: 90;
	}
	.num.foreground {
		width: 100%;
	}


	.midground_container {
		width: 35%;
		left: 0%;
		z-index: 80;
	}

	.num.midground {
		width: 100%;
	}
	
	.background_container {
		width: 66%;
		left: 17%;
		right: auto;
		text-align: center;
		z-index: 70;
	}
	
	
	.num.background {
		width: 100%;
	}

	/*---------------- 
	1950
	-----------------*/
	.scene-1950 .background_color {
		background: #e9abff;
	}
	.scene-1950 .foreground_color, .scene-2020 .foreground_color  {
		background: #200724;
	}
	.scene-1950 .background_container {
		left: 22%;
	}
	.scene-1950 .frontground_container.left {
		left: 20%;
		width: 40%;
		margin-top: 200%;
	} 
	.scene-1950 .frontground_container.right {
		right: 10%;
		width: 50%;
		margin-top: 220%;
	} 
	.scene-1950 .right.midground_container {
		right: 10%;
	}
	.scene-1950 .left.midground_container {
		left: 10%;
	}

	/*---------------- 
	2020
	-----------------*/
	.scene-2020 .background_container {
		height: 90% !important;
	}
	.scene-2020 .midground_container {
		height: 112% !important;
	}
	.scene-2020 .foreground_container {
		height: 138% !important;
	}
	.scene-2020 .frontground_container.left {
		width: 43%;
		margin-top: 260%;
		height: 70% !important;
	}
	.scene-2020 .frontground_container.right {
		width: 40%;
		right: 0%;
		margin-top: 280%;
		height: 60% !important;
	}

	/*----------------
	2030 
	-----------------*/
	.scene-2030 .foreground_color {
		border-bottom: 2px solid #200724;
	}
	.scene-2030 .background_color {
		background: #f6ccff;
	}
	.scene-2030 .shadow {
		background: linear-gradient(to bottom, rgba(28, 5, 38, 0) 0%, #a35c9e 50%);
	}

	.scene-2030 .frontground_container.right {
		left: 30%;
		width: 40%;
		height: 60% !important;
		margin-top: 285%;
	}
	.scene-2030 .end_container {
		position: absolute;
		left: 30%;
		height: 60% !important;
		margin-top: 255%;
		width: 40%;
		z-index: 100;

	}
	.scene-2030 .right.foreground_container {
		height: 125% !important;
		width: 17%;
		margin-top: 40%;
	}
	.scene-2030 .left.foreground_container {
		width: 47%;
		left: -14%;
		margin-top: 50%;
		height: 120% !important;
	}
	.scene-2030 .right.midground_container {
		right: 10%;
		width: 18%;
		height: 108% !important;
	}
	.scene-2030 .left.midground_container {
		left: 2%;
		width: 50%;
		height: 110% !important;
	}
	.scene-2030 .background_container {
		left: 0%;
		width: 100%;
		transition: height 3500ms cubic-bezier(0.455, 0.030, 0.515, 0.955), top 3500ms cubic-bezier(0.455, 0.030, 0.515, 0.955);
		transition-timing-function: cubic-bezier(0.455, 0.030, 0.515, 0.955);
	}
</style>
