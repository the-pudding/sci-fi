<script>
	import { onMount } from 'svelte';
	import { fade, slide, fly } from 'svelte/transition';
	import Scrolly from "$components/helpers/Scrolly.svelte";
	import Decade from "$components/scifi/Scifi.decade.svelte";
	import Text from "$components/scifi/Scifi.text.svelte";
	import Toggle from "$components/helpers/Toggle.svelte";
	export let copy;
	import movies from "$data/movies.json";
	import { groupByDecade, sortByAttributes, getContrastingColors, options } from '$components/helpers/helpers.js';
	const decades = groupByDecade(movies);

	let h = 700;
	let w = 1;
	let catLen;
	let value;
	let titleOn = "title";
	let chartTitleLoc_y = 50;
	let prefersReducedMotion = false;
	let noAnimation = false;
	let instantAnimation = true;

	const colorLookupEra = {
		"future": "#fb04d3",
		"present": "#dc83b9",
		"past": "#c3a2b3",
		"multiple/other": "#dedede"
	};
	const colorLookup = {
		"1": "#fb04d3",
		"0.5": "#dc83b9",
		"0": "#c3a2b3",
		"N/A": "#dedede"
	};
	let colors = ["#fb04d3","#dc83b9","#c3a2b3","#dedede"];
	let loaded = false;
	let decadesShown;
	let objectSize = { width: 24, height: 14 };
	let viewType = "zoom1950";
	let sceneNum = -1;
	let prev_viewType;
	let prev_sceneNum;
	let progress = 0;
	let sceneRatio = 0.4;
	const sceneMaxLookup = {
		"1950": 4,
		"2020": 4,
		"2030": 4
	}
	let translate = {x: w, y: 0, z: 8};


	let sortedColumn = "Social Issues";
	let positions = {};
	let bottomPadding = 90;
	let barHeight = 50;

	function calculatePositions() {
    	// Sort the movies by the specified attributes and group by decade
		const objects = sortByAttributes([...movies], sortedColumn, "decade");
		const uniqueDecades = [...new Set(objects.map(obj => obj.decade))];
		const decadeCount = uniqueDecades.length;

   		// Calculate effective container dimensions
		const effectiveContainerWidth = w;

		const effectiveContainerHeight = h;

    	// Calculate object sizes to ensure 200 elements per decade fit
		const elementsPerDecade = 200;
		const spacePerDecade = effectiveContainerWidth / decadeCount;
		const objectWidth = Math.sqrt(spacePerDecade * effectiveContainerHeight / elementsPerDecade) / 1.8;
		objectSize.width = objectWidth;
		objectSize.height = objectWidth * 1.5;


    	// Assign unique colors to each unique value of the sorted column
		const uniqueValues = [...new Set(objects.map(obj => obj[sortedColumn]))];

    	// Group objects by decade
		const groupedByDecade = objects.reduce((group, obj) => {
			group[obj.decade] = group[obj.decade] || [];
			group[obj.decade].push(obj);
			return group;
		}, {});

		const positions = {};

	    // Calculate the number of elements per row based on screen aspect ratio
	    const aspectRatio = w / h;  // Using width-to-height ratio to ensure correct behavior
	    // const elementsPerRow = Math.max(1, Math.floor(4 * aspectRatio)) + 2; // Adjust the multiplier as needed
	    let elementsPerRow = 10;
	    let divider = 1.2;
	    if (aspectRatio < 0.9) {
	    	elementsPerRow = 5;
	    	divider = 1;
	    } else if (aspectRatio < 1.4) {
	    	elementsPerRow = 8;
	    	divider = 1.2;
	    }
	    const elementsPerCol = 190 / elementsPerRow;
	    barHeight = (elementsPerCol * objectSize.height);
	    if (elementsPerRow == 5) {
	    	barHeight = barHeight*.95
	    }

	    const leftPadding = (spacePerDecade - (elementsPerRow*(objectSize.width - 1.5) )) / 2;
	    const sceneWidth = barHeight * sceneRatio * 8
	    let multiplier = w / sceneWidth;
	    titleOn = "";
	    if (viewType == "zoom1950" && sceneNum < 3) {
	    	titleOn = "title";
	    }
	    if (viewType == "zoom2030" && sceneNum > 2) {
	    	titleOn = "end";
	    }

	    // Changes so the scene doesn't go too fast
	    let additionalY = h/(aspectRatio*(10 - sceneNum));
	    if (sceneNum < 2) {
	    	additionalY = 0;
	    }
	    // reset translate
	    translate = {x: 0, y: 0, z: 1};

	    if (viewType == "zoom1950" && sceneNum == -1) {
	    	translate.z = 8 * multiplier*1.01;
	    	translate.y = (-(h * translate.z) + (barHeight * translate.z) + (bottomPadding * translate.z) - (0 / sceneMaxLookup["1950"] * barHeight * (sceneMaxLookup["1950"]/(sceneMaxLookup["1950"]+1))* (translate.z) ) ) + h/(aspectRatio*8);
	    	translate.x = w;
	    } else if (viewType == "zoom1950") {
	    	translate.z = 8 * multiplier*1.01;
	    	translate.y = -(h * translate.z) + (barHeight * translate.z) + (bottomPadding * translate.z) - (sceneNum / sceneMaxLookup["1950"] * barHeight * (sceneMaxLookup["1950"]/(sceneMaxLookup["1950"]+1))* (translate.z) ) + additionalY;
	    	translate.x = w;
	    } else if (viewType == "zoom1950v2") {
	    	translate.z = divider;
	    	translate.y = -(barHeight*translate.z) + barHeight / divider;
	    	translate.x = w / 2 + (((sceneWidth/8) - spacePerDecade) / 2);
	    } else if (viewType == "zoom2020") {
	    	translate.z = 8 * multiplier*1.01;
	    	translate.y = -(h * translate.z) + (barHeight * translate.z) + (bottomPadding * translate.z) - (sceneNum / sceneMaxLookup["2020"] * barHeight * (sceneMaxLookup["2020"]/(sceneMaxLookup["2020"]+1))* (translate.z)) + additionalY;
	    	translate.x = w * -translate.z;
	    } else if (viewType == "zoom2020v2") {
	    	translate.z = divider;
	    	translate.y = -(barHeight*translate.z) + barHeight / divider;
	    	translate.x = -w / divider;
	    	translate.x = w - (sceneWidth/8) - w/4;
	    } else if (viewType == "zoom2030") {
	    	translate.z = 8 * multiplier*1.01;
	    	translate.y = -(h * translate.z) + (barHeight * translate.z) + (bottomPadding * translate.z) - (sceneNum / sceneMaxLookup["2030"] * barHeight * (sceneMaxLookup["2030"]/(sceneMaxLookup["2030"]+1))* (translate.z)) + additionalY;
	    	translate.x = w * -translate.z;
	    } else if (viewType == "zoom2030v2") {
	    	translate.z = divider;
	    	translate.y = -(barHeight*translate.z) + barHeight / divider;
	    	translate.x = -w / divider;
	    }
	    chartTitleLoc_y = barHeight / h * 100 + 22*translate.z;
	    // Iterate through each decade to calculate positions
	    uniqueDecades.forEach((decade, decadeIndex) => {
	    	const decadeObjects = sortByAttributes(groupedByDecade[decade], sortedColumn, "decade");
	    	let xPos = 0;
	    	let yPos = effectiveContainerHeight - objectSize.height - bottomPadding;

	    	decadeObjects.forEach((obj, index) => {
            // If the index is a multiple of elementsPerRow, move to next row
	    		if (index % elementsPerRow === 0 && index > 0) {
	    			xPos = 0;
	    			yPos -= objectSize.height - 1;
	    		}

	    		const objIndex = obj.index;

            // Calculate the actual positions within the relative container
            const containerWidth = (w * 0.125) - 20; // 12.5% of the width minus some padding
            const xRelativePos = (xPos / spacePerDecade) * 100 + (spacePerDecade - objectSize.width*elementsPerRow)/spacePerDecade*50;
            const yRelativePos = (yPos / effectiveContainerHeight) * 100;
            let movie_colors = colorLookup;
            if (sortedColumn.indexOf("Era") != -1) {
            	movie_colors = colorLookupEra;
            } 
            positions[objIndex] = {
            	x: `${xRelativePos}%`,
            	y: `${yRelativePos}%`,
            	width: `${objectSize.width + 1}px`,
            	height: `${objectSize.height}px`,
            	speed: Math.random() * 1200 + 100,
                color: movie_colors[obj[sortedColumn]] // Assign color based on sortedColumn value
            };

            // Move to the next position in the row
            xPos += objectSize.width;
        });
	    });
	    
	    return positions;
	}

	function dispatchResize() {
		instantAnimation = true;
		positions = calculatePositions();
	}


	$: {
		w = w;
		h = h;
		progress;
		titleOn;
		value = value === undefined ? 0 : value;
		decadesShown = copy.timeline[value].decades === undefined ? "(1950,1960,1970,1980,1990,2000,2010,2020)" : copy.timeline[value].decades;
		sortedColumn = copy.timeline[value]["variable"];
		viewType = copy.timeline[value]["view"] === undefined ? "" : copy.timeline[value]["view"];
		sceneNum = copy.timeline[value]["sceneNum"] === undefined ? 0 : Number(copy.timeline[value]["sceneNum"]);

		if (prev_viewType != viewType || prev_sceneNum != sceneNum || !loaded || (viewType != "zoom1950" && viewType != "zoom2020" && viewType != "zoom2030") ) {
			positions = calculatePositions();
			prev_viewType = viewType;
			prev_sceneNum = sceneNum;	
			loaded = true;
			
		} 
		if (progress != 0) {
			instantAnimation = false;
		}

		barHeight;
	}

	onMount(() => {
		positions = calculatePositions();
		const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

		function updatePreference(e) {
			prefersReducedMotion = e.matches;
		}

        // Add listener
		mediaQuery.addListener(updatePreference);

        // Set initial value
		prefersReducedMotion = mediaQuery.matches;
        // Cleanup function
		return () => {
			mediaQuery.removeListener(updatePreference);
		};
	});
</script>
<svelte:window on:resize={dispatchResize}></svelte:window>
<div class="outsideContainer">
	<section id="scrolly">

		<div class="visualContainer {titleOn} reduceMotion-{prefersReducedMotion} reduceMotion-{noAnimation} reduceMotion-{instantAnimation}" bind:clientWidth={w} bind:clientHeight={h}>
			{#if viewType == "" || viewType.indexOf("v2") != -1}
			<div class="chartTitles" style="bottom: {chartTitleLoc_y}%;" in:slide>
				<div class="legend_title" in:slide>{copy.timeline[value].hed}</div>
				<div class="legend_container" in:slide>
					{#each copy.timeline[value].categories as category, i}
					<div class="legendItem" style="background: {colors[i]};" in:slide>{category}</div>
					{/each}
				</div>
			</div>
			{/if}
			<div class="zoomContainer {viewType}" style="transform: perspective(0) translate3d({translate.x}px,{translate.y}px, 0) scale({translate.z});">
				{#each Object.keys(decades) as decade}
				<Decade decade={decade} movies={decades[decade]} positions={positions} sortedColumn={sortedColumn} {value} {barHeight} {bottomPadding} {viewType} {decadesShown} {sceneMaxLookup} {sceneNum} {progress} {sceneRatio} {prefersReducedMotion}/>
				{/each}
			</div>
			{#if sceneNum == -1}
			<div class="title_container" transition:fade>
				<h1>{copy.Hed}</h1>
				<div class="byline">by <a href="https://pudding.cool/author/alvin-chang/">Alvin Chang</a></div>
				<Toggle label="Animation" bind:value={noAnimation} options={ [{value: false, text: "On"}, {value: true, text: "Off"}] }/>
			</div>
			{/if}
		</div>

		<Scrolly bind:value top={0} bind:progress={progress}>
			{#each copy.timeline as step_obj, i}
			{@const active = value === i}
			{@const is_firstyear = copy.timeline.findIndex(item => item.time === step_obj.time) === i}
			
			<div class="step {step_obj.addclass ? step_obj.addclass : ''} steptype_{step_obj.type}" class:active>
				{#if step_obj.text != ""}	
				<Text sortedColumn={sortedColumn} copy={step_obj.text}  type={step_obj.type} time={step_obj.time} add={step_obj.addclass === "longcopy" ? "longcopy" : "shortcopy"} />
				{/if}
			</div>
			{/each}
		</Scrolly>

	</section>
</div>

<style>
	.visualContainer {
		overflow: hidden;
		position: sticky;
		top: 0px;
		left: 0px;
		display: block;
		width: 100%;
		padding: 0 0px;
		height: 100vh;
		transition: background 2000ms cubic-bezier(0.455, 0.030, 0.515, 0.955);
		transition-timing-function: cubic-bezier(0.455, 0.030, 0.515, 0.955);
	}
	.visualContainer.reduceMotion-true, .visualContainer.reduceMotion-true * {
		transition: none !important;
	}
	.visualContainer.title {
		background: #e9abff;
		font-family: CozetteVector, Courier, monospace;
	}
	.visualContainer.end {
		background: #a35c9e;
	}
	.title_container {
		position: absolute;
		left: 0%;
		width: 100%;
		text-align: center;
		bottom: 65vh;
		color: #200724;
		font-weight: bold;
		font-family: CozetteVector, Courier, monospace;
	}
	.title_container.title_container h1 {
		font-size: 2em;
	}
	.title_container .byline {
		font-size: 1.2em;
		opacity: 0.6;
	}
	.chartTitles {
		color: white;
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
		width: 100%;
		text-align: center;
		bottom: var(--chartTitleLocY, 0); /* Using CSS variable for dynamic positioning */
	}
	.legend_container {
		color: white;
		display: flex;
		flex-direction: row;
		align-items: center; 
		justify-content: center; /* Centers items horizontally */
		text-align: center;
	}
	.legend_title {
		margin-bottom: 5px;
		font-size: 1.5em;
		padding-bottom: 0px;
		line-height: 1em;
		font-family: CozetteVector, Courier, monospace;
	}
	.legendItem {
		flex: 0 0 auto;
		align-items: center;
		text-align: center;
		justify-content: center;
		color: var(--color-lightpurple);
		white-space: normal;
		margin: 2px;
		padding: 0 4px;
		min-width: 40px;
		text-shadow: 0px 0px 4px #000;
		font-size: 1.2em;
		font-family: CozetteVector, Courier, monospace;
	}
	.zoomContainer {
		width: 100%;
		height: 100vh;
		transition: transform 3400ms cubic-bezier(0.455, 0.030, 0.515, 0.955);
		transition-timing-function: cubic-bezier(0.455, 0.030, 0.515, 0.955);
		transform: perspective(0) translate3d(0, 0, 0) scale(1);
		transform-origin: top left;
	}

	.reduceMotion-true .zoomContainer {
		transition: none !important;
	}

	#sortedColumn {
		position: absolute;
		left: 10px;
		top: 10px;
	}

</style>
