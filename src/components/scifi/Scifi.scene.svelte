<script>
	import { fade } from 'svelte/transition';
	export let value, barHeight, bottomPadding, viewType, sceneMax, sceneNum, nextDecade, decade, progress, sceneRatio, stepCount, prefersReducedMotion, w, h;
	let opacity = 0;
	let stages = [];
	let top = 0;
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

	function calculateMarginTop(sceneNum) {
		// if (sceneNum === 0) {
		// 	return '-10%';
		// } else if (sceneNum == 4) {
		// 	return `12%`;
		// } else {
		// 	return `${(sceneNum - 1) * 12}%`;
		// }
		return 0;
	}

	function calculateHeight(h, n) {
		let height = h + "%";
		if (n == 4) {
			height = h - ((10-n)) + "%";
		}
		return height;
	}
	let sceneAdjust = 0;
	$: {
		w, h, sceneNum;
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
		
		let aspectRatio = w/h;
		// sceneAdjust = 0;
		// if (sceneNum < 0) {
		// 	if (viewType == "zoom1950") {
		// 		sceneAdjust = 0 - aspectRatio*12;
		// 	} else {
		// 		sceneAdjust = -0.8;	
		// 	}
		// } else if (sceneNum == 0) { 
		// 	sceneAdjust = 1;	
		// } else if (sceneNum == 4 && aspectRatio < 1){
		// 	sceneAdjust = (h*10)/(w);
		// } 
		if (viewType == "zoom2030") {
			sceneMax = 6;
		}
		if (viewType == "zoom1950") {
			sceneMax = 4.7;
		}
		if (aspectRatio < 1) {
			top = sceneNum + progress/100 - aspectRatio;
		} else {
			top = sceneNum + progress/100;
		}
		
		if (progress == 0) {
			top += 1;
		}
	}
</script>

{#if (decade=="2020" && viewType=="zoom2020") || (decade=="2030" && viewType=="zoom2030") || (decade=="1950" && viewType=="zoom1950")}
<div class="scene scene-{decade} {nextDecade} scene{opacity}" style="width: {w}px; height: {w*2.8}px; bottom: {bottomPadding}px; opacity: {opacity};" transition:fade>
	<div class="background_color" style="margin-top:{-(top+1) / sceneMax * 100}%"></div>
	<div class="foreground_color" style="margin-top:{-(top+1) / sceneMax * 100}%"></div>
	

	{#each ["left", "right"] as side}
	{#each Object.entries(scalings) as [key, scale]}
	{#if key =="background" && side == "right"}
	{:else}
	{#if decade=="2030" && key=="background"}
	<div class="{key}_container scene_containers" 
	style="transform: translateY({-top / sceneMax * 100}%); height: {calculateHeight(sceneHeight[key], top)}; margin-top: {calculateMarginTop(top)};">
	<img src='assets/scifi/{decade}-{key}{key != 'background' ? `-${side}` : ''}.png' />
</div>
{:else}
<div class="{key}_container scene_containers {side}" 
style="transform: translateY({-top / sceneMax * 100 + sceneAdjust}%); height: {sceneHeight[key]}%;">
<img src='assets/scifi/{decade}-{key}{key != 'background' ? `-${side}` : ''}.png' />
</div>
{/if}
{/if}
{/each}
{/each}
{#if decade=="2030"}
<div class="end_container scene_containers" 
style="transform: translateY({-top / sceneMax * 100 + sceneAdjust}%);">
<img src='assets/scifi/2030-end.png' />
</div>
{/if}
{#if decade =="2020"}
<div class="fly_container scene_containers" style="transform: translateY({-top / sceneMax * 100}%);">
	<img src='assets/scifi/2020-fly-left.png' />
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
/*		transition: opacity 2000ms cubic-bezier(0.455, 0.030, 0.515, 0.955);
		transition-timing-function: cubic-bezier(0.455, 0.030, 0.515, 0.955);*/
		overflow: hidden;
		pointer-events: none;
	}
	.scene .background_color {
		background: #9D47AA;
		position: absolute;
		top: 0px;
		height: 30%;
		width: 100%;
/*		transition: margin-top 3400ms cubic-bezier(0.455, 0.030, 0.515, 0.955);
		transition-timing-function: cubic-bezier(0.455, 0.030, 0.515, 0.955);*/
	}
	
	.scene .foreground_color {
		background: #a35c9e;
		position: absolute;
		bottom: 0px;
		height: 65%;
		width: 100%;
		/*transition: margin-top 3400ms cubic-bezier(0.455, 0.030, 0.515, 0.955);
		transition-timing-function: cubic-bezier(0.455, 0.030, 0.515, 0.955);*/
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
		top: 0px;
		width: 100%;
		height: 100%;
		transform-origin: bottom left;
/*		transition: transform 10ms linear;*/
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
	.scene_containers img {
		width: 100%;
		height: 100%;
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
		left: 0%;
		width: 90%;
	}
	.scene-1950 .frontground_container.left {
		left: 20%;
		width: 80%;
		height: 132% !important;
		margin-top: 25%;

	} 
	.scene-1950 .frontground_container.left img {
		width: 70%;
		height: 70%;
		position: absolute;
		bottom: 3%;
	}
	.scene-1950 .frontground_container.right {
		right: 5%;
		width: 80%;
		margin-top: 50%;
		height: 132% !important;
	} 
	.scene-1950 .frontground_container.right img {
		width: 70%;
		height: 70%;
		position: absolute;
		bottom: 3%;
		right: 0px;
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
		margin-top: 40%;
		height: 138% !important;
	}
	.scene-2020 .frontground_container.left img {
		height: 50%;
		position: absolute;
		bottom: 2%;
	}
	.scene-2020 .frontground_container.right {
		width: 40%;
		right: 0%;
		margin-top: 40%;
		height: 138% !important;
	}
	.scene-2020 .frontground_container.right img {
		height: 50%;
		position: absolute;
		bottom: 2%;
	}
		.scene-2020 .fly_container {
		height: 360% !important;
		z-index: 999;
	}
	.scene-2020 .fly_container img {
		position: absolute;
		left: 0px;
		bottom: 50%;
		width: 18%;
		height: 2.3%;
		animation: flyAcross 4s ease-in-out infinite; /* Adjust timing as needed */
		perspective: 0;
	}

	@keyframes flyAcross {
		0% {
			left: 120%; /* Off the screen to the right */
			bottom: 54%;
			transform: rotate(0deg) translateZ(0);
		}
		40% {
			transform: rotate(10deg) translateZ(0);
			bottom: 56%;
		}
		55% {
			transform: rotate(0deg) translateZ(0);
			bottom: 54%;
		}
		70% {
			transform: rotate(10deg) translateZ(0);
			bottom: 53%;
		}
		100% {
			left: -20%; /* Off the screen to the left (adjust for width of image) */
			bottom: 50%;
			transform: rotate(-10deg) translateZ(0);
		}
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
		height: 138% !important;
		margin-top: 90%;
	}


	@keyframes slideInOut {
		0% {
			left: 0%;
			top: 0%;
			transform: rotate(-14deg);
		}
		20% {
			left: 5%;
			top: -2%;
			transform: rotate(2deg);
		}
		40% {
			left: -5%;
			top: 2%;
			transform: rotate(-6deg);
		}
		60% {
			left: 4%;
			top: -4%;
			transform: rotate(1deg);
		}
		80% {
			left: -4%;
			top: 4%;
			transform: rotate(-6deg);
		}
		100% {
			left: 0%;
			top: 0%;
			transform: rotate(-14deg);
		}
	}

	.scene-2030 .frontground_container.right img {
		position: absolute;
		top: 10%;
		width: 100%;
		height: 42%;
		transform-origin: center;
		animation: slideInOut 15s infinite; /* Adjust duration as needed */
	}
	.scene-2030 .end_container {
		position: absolute;
		height: 138%;
		left: 25%;
		width: 50%;
		z-index: 100;
/*		top: 50%;*/
}
.scene-2030 .end_container img {
	width: 100%;
	height: 80%;
	position: absolute;
	left: 0px;
	bottom: -4%;
}
.scene-2030 .right.foreground_container {
	width: 18%;
	height: 120% !important;
	margin-top: 13%;
}
.scene-2030 .right.foreground_container img {
	height: 90%;
	width: 90%;
	position: absolute;
	right: 0px;
}
.scene-2030 .left.foreground_container {
	width: 60%;
	left: -19%;
	height: 176% !important;
}
.scene-2030 .left.foreground_container img {
	position: absolute;
	bottom: 3%;
	height: 90%;
}
.scene-2030 .right.midground_container {
	right: 10%;
	width: 18%;
}
.scene-2030 .right.midground_container img {
	position: absolute;
	right: 10%;
	width: 80%;
	height: 80%;
}
.scene-2030 .left.midground_container {
	left: 6%;
	width: 50%;
	height: 90% !important;
}
.scene-2030 .background_container {
	left: 0%;
	width: 100%;
		/*transition: all 3400ms cubic-bezier(0.455, 0.030, 0.515, 0.955);
		transition-timing-function: cubic-bezier(0.455, 0.030, 0.515, 0.955);*/
	}
	.scene-2030 .background_container {
		position: absolute;
		left: 0px;
		bottom: 0px;
		width: 100%;
	}
</style>