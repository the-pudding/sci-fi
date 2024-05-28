<script>
	import Scrolly from "$components/helpers/Scrolly.svelte";
	import Decade from "$components/scifi/Scifi.decade.svelte";
	import Text from "$components/scifi/Scifi.text.svelte";
	export let copy;
	import movies from "$data/movies.json";
	import { groupByDecade, sortByAttributes, getContrastingColors, options } from '$components/helpers/helpers.js';
	const decades = groupByDecade(movies);

	let h = 700;
	let w = 800;
	let value;
	let decadesShown;
    let objectSize = { width: 24, height: 14 }; // Adjust the size as needed
    let viewType = "";
    let translate = {x: 0, y: 0, z: 1};
    

    let sortedColumn = "Social Issues";
    let positions = {};
    let bottomPadding = 100;
    let barHeight = 50;

    $: positions = calculatePositions();

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
    	const colors = getContrastingColors(uniqueValues.length);
    	const valueColorMap = uniqueValues.reduce((map, value, index) => {
    		map[value] = colors[index % colors.length];
    		return map;
    	}, {});

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
	    let divider = 1.5;
	    let divider2 = 1.25;
	    if (aspectRatio < 1.2) {
	    	elementsPerRow = 5;
	    	divider = 1;
	    	divider2 = 2.25;
	    }
	    const elementsPerCol = 190 / elementsPerRow;
	    barHeight = (elementsPerCol * objectSize.height);
	   
	    const leftPadding = (spacePerDecade - (elementsPerRow*(objectSize.width - 1.5) )) / 2;

	    if (viewType == "zoom1950") {
	    	translate.z = 8;
	    	translate.y = -(h * translate.z) + (barHeight * translate.z) + (bottomPadding * translate.z);
	    	translate.x = w;
	    	
		} else if (viewType == "zoom1950v2") {
			translate.z = divider;
	    	translate.y = -(barHeight*translate.z) + barHeight / divider;
	    	translate.x = w / 2;
		} else if (viewType == "zoom2020") {
	    	translate.z = 8;
	    	translate.y = -(h * translate.z) + (barHeight * translate.z) + (bottomPadding * translate.z);
	    	translate.x = w * -6;
	    	
		} else if (viewType == "zoom2020v2") {
			translate.z = divider;
	    	translate.y = -(barHeight*translate.z) + barHeight / divider;
	    	translate.x = -w / divider2;
		}  else {
			translate = {x: 0, y: 0, z: 1};
		}

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
            const xRelativePos = (xPos / spacePerDecade) * containerWidth + leftPadding;
            const yRelativePos = (yPos / effectiveContainerHeight) * h;

            positions[objIndex] = {
            	x: `${xRelativePos}px`,
            	y: `${yRelativePos}px`,
            	width: `${objectSize.width}px`,
            	height: `${objectSize.height}px`,
            	speed: Math.random() * 1000 + 200,
                color: valueColorMap[obj[sortedColumn]] // Assign color based on sortedColumn value
            };

            // Move to the next position in the row
            xPos += objectSize.width;
        });
	    });

	    return positions;
	}


	function triggerChange() {
		positions = calculatePositions();
	}

	$: {
		w = w;
		h = h;
		value = value === undefined ? 0 : value;
		decadesShown = copy.timeline[value].decades === undefined ? "(1950,1960,1970,1980,1990,2000,2010,2020)" : copy.timeline[value].decades;
		sortedColumn = copy.timeline[value]["variable"];
		viewType = copy.timeline[value]["view"] === undefined ? "" : copy.timeline[value]["view"];
		positions = calculatePositions();
		barHeight;
	}
</script>

<svelte:window on:resize={triggerChange} />

<div class="outsideContainer">
	<section id="scrolly">

		<div class="visualContainer" bind:clientWidth={w} bind:clientHeight={h}>
			<div class="zoomContainer {viewType}" style="transform: perspective(0) translate3d({translate.x}px,{translate.y}px, 0) scale({translate.z});">
				{#each Object.keys(decades) as decade}
				<Decade decade={decade} movies={decades[decade]} positions={positions} sortedColumn={sortedColumn} {value} {barHeight} {bottomPadding} {viewType} {decadesShown}/>
				{/each}
			</div>
		</div>

		<Scrolly bind:value top={100}>
			{#each copy.timeline as step_obj, i}
			{@const active = value === i}
			{@const is_firstyear = copy.timeline.findIndex(item => item.time === step_obj.time) === i}
			<div class="step {step_obj.addclass ? step_obj.addclass : ''} steptype_{step_obj.type}" class:active>
				<Text sortedColumn={sortedColumn} copy={step_obj.text} type={step_obj.type} time={step_obj.time} add={step_obj.addclass === "longcopy" ? "longcopy" : "shortcopy"} />
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
	}
	.zoomContainer {
		width: 100%;
		height: 100vh;
		transition: transform 2000ms cubic-bezier(0.455, 0.030, 0.515, 0.955);
		transition-timing-function: cubic-bezier(0.455, 0.030, 0.515, 0.955);
		transform: perspective(0) translate3d(0, 0, 0) scale(1);
		transform-origin: top left;
	}
	
	#sortedColumn {
		position: absolute;
		left: 10px;
		top: 10px;
	}
	
</style>
