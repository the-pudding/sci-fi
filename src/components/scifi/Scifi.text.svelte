<script>
	import { onMount } from 'svelte';
	export let copy, add, time, age, type, firstyear;
	function convertToHTML(text) {
        let finalText = [];
        if (text != undefined) {
        // Split text into lines based on paragraph breaks
            let textArray = text.split(/(\n\n|\r\r|\n\r|\r\n)/);
            textArray.forEach(function(line) {
            // Process lines with special keywords
                if (line.indexOf("Component|") != -1) {
                    let compName = line.split("|")[1];
                    line = `<svelte:component this=${compName}></svelte:component>`;
                }

                if (line.indexOf("IMAGE|") != -1) {
                // line = '<div class="imageContainer"><img class="desktopImage" src="assets/scifi/' + line.replace("IMAGE|", "").replace(/(\r\n|\n|\r)/gm, "") + '.png"/><img class="mobileImage" src="assets/scifi/' + line.replace("IMAGE|", "").replace(/(\r\n|\n|\r)/gm, "") + '_mobile.png"/></div>';
                   line = '<div class="imageContainer"><img class="desktopImage" alt="' + line.split("|")[2] + '" src="assets/scifi/' + line.split("|")[1] + '.png"/>';
               }

               if (line.indexOf(">>") != -1) {
                line = "<div class='chartPlaceholder'>" + line + "</div>";
            }

            // Preserve lines with text and <span> tags
            if (/[A-Za-z0-9]/.test(line) || /<\/?span[^>]*>/.test(line)) {
                finalText.push(line);
            }
        });
            return wrapInPTags(finalText);
        }
    }

    function wrapInPTags(arr) {
        return arr.map(item => {
        // Check if the string is already wrapped in a tag (assuming well-formed HTML and no attributes in the tag)
            if (/^<[^>]+>.*<\/[^>]+>$/.test(item)) {
                return item;
            } else {
                return `<p>${item}</p>`;
            }
    }).join(''); // Join all elements into a single string without any separator
    }



</script>
{#if type != "invisible"}
<div class="textContainer {add === "longcopy" ? "longcopy" : "shortcopy"}">
	{@html convertToHTML(copy)}
</div>
{:else if firstyear && time != 1997}
<div class="textContainer {add === "longcopy" ? "longcopy" : "shortcopy"}">
	<div class="yearLabel">{time}</div>
</div>
{/if}



<style>
	.imageContainer {
        image-rendering: pixelated;
    }
</style>


