<script>
	import Scrolly from "$components/helpers/Scrolly.svelte";
	import Decade from "$components/scifi/Scifi.decade.svelte";
	import Text from "$components/scifi/Scifi.text.svelte";
	export let copy;
	import movies from "$data/movies.json";
	import { groupByDecade, sortByAttributes, getContrastingColors, options } from '$components/helpers/helpers.js';
	const decades = groupByDecade(movies);

	let h = 700;
	let w = 1;
	let value;
	let loaded = "noAnimation";
	let decadesShown;
    let objectSize = { width: 24, height: 14 };
    let viewType = "zoom1950";
    let sceneNum = 0;
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
    let bottomPadding = 100;
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

	    const leftPadding = (spacePerDecade - (elementsPerRow*(objectSize.width - 1.5) )) / 2;
	    const sceneWidth = barHeight * sceneRatio * 8
	    let multiplier = w / sceneWidth;
	    if (viewType == "zoom1950") {
	    	translate.z = 8 * multiplier*1.01;
	    	translate.y = -(h * translate.z) + (barHeight * translate.z) + (bottomPadding * translate.z) - (sceneNum / sceneMaxLookup["1950"] * barHeight * (sceneMaxLookup["1950"]/(sceneMaxLookup["1950"]+1))* (translate.z) );
	    	translate.x = w;
	    } else if (viewType == "zoom1950v2") {
	    	translate.z = divider;
	    	translate.y = -(barHeight*translate.z) + barHeight / divider;
	    	translate.x = w / 2 + (((sceneWidth/8) - spacePerDecade) / 2);
	    } else if (viewType == "zoom2020") {
	    	translate.z = 8 * multiplier*1.01;
	    	translate.y = -(h * translate.z) + (barHeight * translate.z) + (bottomPadding * translate.z) - (sceneNum / sceneMaxLookup["2020"] * barHeight * (sceneMaxLookup["2020"]/(sceneMaxLookup["2020"]+1))* (translate.z));
	    	translate.x = w * -translate.z;
	    } else if (viewType == "zoom2020v2") {
	    	translate.z = divider;
	    	translate.y = -(barHeight*translate.z) + barHeight / divider;
	    	translate.x = -w / divider;
	    	translate.x = w - (sceneWidth/8) - w/4;
	    } else if (viewType == "zoom2030") {
	    	translate.z = 8 * multiplier*1.01;
	    	translate.y = -(h * translate.z) + (barHeight * translate.z) + (bottomPadding * translate.z) - (sceneNum / sceneMaxLookup["2030"] * barHeight * (sceneMaxLookup["2030"]/(sceneMaxLookup["2030"]+1))* (translate.z));
	    	translate.x = w * -translate.z;
	    } else if (viewType == "zoom2030v2") {
	    	translate.z = divider;
	    	translate.y = -(barHeight*translate.z) + barHeight / divider;
	    	translate.x = -w / divider;
	    } else {
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
            const xRelativePos = (xPos / spacePerDecade) * 100 + (spacePerDecade - objectSize.width*elementsPerRow)/spacePerDecade*50;
            const yRelativePos = (yPos / effectiveContainerHeight) * 100;

            positions[objIndex] = {
            	x: `${xRelativePos}%`,
            	y: `${yRelativePos}%`,
            	width: `${objectSize.width + 1}px`,
            	height: `${objectSize.height}px`,
            	speed: Math.random() * 1200 + 100,
                color: valueColorMap[obj[sortedColumn]] // Assign color based on sortedColumn value
            };

            // Move to the next position in the row
            xPos += objectSize.width;
        });
	    });

	    return positions;
	}


	function triggerChange() {
		loaded = "noAnimation"
		setTimeout(function() {
			loaded = ""
		},2000)
		positions = calculatePositions();
	}

	$: {
		w = w;
		h = h;
		progress;
		value = value === undefined ? 0 : value;
		decadesShown = copy.timeline[value].decades === undefined ? "(1950,1960,1970,1980,1990,2000,2010,2020)" : copy.timeline[value].decades;
		sortedColumn = copy.timeline[value]["variable"];
		viewType = copy.timeline[value]["view"] === undefined ? "" : copy.timeline[value]["view"];
		sceneNum = copy.timeline[value]["sceneNum"] === undefined ? 0 : Number(copy.timeline[value]["sceneNum"]);
		positions = calculatePositions();
		barHeight;
		if (value > 0) {
			loaded = ""
		}
	}
</script>

<svelte:window on:resize={triggerChange} />

<div class="outsideContainer">
	<section id="scrolly">

		<div class="visualContainer" bind:clientWidth={w} bind:clientHeight={h}>
			<div class="zoomContainer {loaded} {viewType}" style="transform: perspective(0) translate3d({translate.x}px,{translate.y}px, 0) scale({translate.z});">
				{#each Object.keys(decades) as decade}
					<Decade decade={decade} movies={decades[decade]} positions={positions} sortedColumn={sortedColumn} {value} {barHeight} {bottomPadding} {viewType} {decadesShown} {sceneMaxLookup} {sceneNum} {progress} {sceneRatio}/>
				{/each}
			</div>
		</div>

		<Scrolly bind:value top={0} bind:progress={progress}>
			{#each copy.timeline as step_obj, i}
			{@const active = value === i}
			{@const is_firstyear = copy.timeline.findIndex(item => item.time === step_obj.time) === i}
			
			<div class="step {step_obj.addclass ? step_obj.addclass : ''} steptype_{step_obj.type}" class:active>
				{#if step_obj.text != ""}	
				<Text sortedColumn={sortedColumn} copy={step_obj.text} type={step_obj.type} time={step_obj.time} add={step_obj.addclass === "longcopy" ? "longcopy" : "shortcopy"} />
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
	}
	.zoomContainer {
		width: 100%;
		height: 100vh;
		transition: transform 2000ms cubic-bezier(0.455, 0.030, 0.515, 0.955);
		transition-timing-function: cubic-bezier(0.455, 0.030, 0.515, 0.955);
		transform: perspective(0) translate3d(0, 0, 0) scale(1);
		transform-origin: top left;
	}

	.zoomContainer.noAnimation {
		transition: transform 0ms cubic-bezier(0.455, 0.030, 0.515, 0.955);
	}
	
	#sortedColumn {
		position: absolute;
		left: 10px;
		top: 10px;
	}
	
</style>
