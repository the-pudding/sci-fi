export function groupByDecade(arr) {
    const grouped = {};
    arr.forEach((item) => {
        if (!grouped[item.decade]) {
            grouped[item.decade] = [];
        }
        grouped[item.decade].push(item);
    });
    const sortedKeys = Object.keys(grouped).sort();
    const sortedGrouped = {};

    sortedKeys.forEach((key) => {
        sortedGrouped[key] = grouped[key];
    });

    return sortedGrouped;
}

export function sortByAttributes(array, primaryAttribute, secondaryAttribute) {
    return array.sort((a, b) => {
        const aPrimary = String(a[primaryAttribute]);
        const bPrimary = String(b[primaryAttribute]);
        const aSecondary = String(a[secondaryAttribute]);
        const bSecondary = String(b[secondaryAttribute]);

        const aIsNA = aPrimary.startsWith('N/A');
        const bIsNA = bPrimary.startsWith('N/A');

        if (aIsNA && !bIsNA) {
            return -1; // a should come before b
        }
        if (!aIsNA && bIsNA) {
            return 1; // b should come before a
        }
        if (aPrimary < bPrimary) {
            return -1;
        }
        if (aPrimary > bPrimary) {
            return 1;
        }
        if (aSecondary < bSecondary) {
            return -1;
        }
        if (aSecondary > bSecondary) {
            return 1;
        }
        return 0;
    });
}

export function getContrastingColors(uniqueValues) {
    const og_colors = ["#fb04d3", "#f541cb", "#ee5cc4", "#e671be", "#dc83b9", "#d093b6", "#c3a2b3"].reverse();
    const step = Math.floor((og_colors.length - 2) / (uniqueValues - 2));
    const contrastingColors = [og_colors[0]]; // Always include the first color

    for (let i = 1; i < uniqueValues - 1; i++) {
        contrastingColors.push(og_colors[i * step]);
    }

    contrastingColors.push(og_colors[og_colors.length - 1]); // Always include the last color
    return contrastingColors;
}


export const options = [
        "Category", "Social Issues", "Era", "Present/Near Future", "Sci Exploration", 
        "Dystopian/Post-Apoc", "Utopian/Idealistic", "Triumph of Humanity", "Failure of Humanity", 
        "World Before", "World During", "World After", "Less Suffering", "More Abundance", 
        "More Egalitarianism", "More Human Agency", "More Sense of Wonder", "Tech Improves Existence", 
        "Comments on Climate", "Comments on Mental Health", "Critique Women's Rights", 
        "Critique Politics", "Critique Religion", "Critique War", "Critique Science/Tech", 
        "Tech Solves Problem", "Existential Threat", "World_v_Reality", "Type of Conflict",
        "Inequality","Suffering","A moral crisis in society","Tech being used in sinister ways",
        "A militarized society","Authoritarian regime","Tech improving human lives","abundance",
        "technology","unknown","society","human","self"
    ];
