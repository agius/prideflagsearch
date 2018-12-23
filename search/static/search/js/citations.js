function handleShowCitationEvent(flagData, event) {
    const shouldShowCitation = ("false" === event.target.getAttribute("aria-expanded"));
    
    removeAllCitations();
    resetAllShowMoreTexts();
    
    if (shouldShowCitation) {
        showCitation(flagData, event.target); 
    }
}

function removeAllCitations() {
    const citationRowList = document.querySelectorAll(".jx-citation-row");
    
    for (i = 0; i < citationRowList.length; ++i) {
        let child = citationRowList[i];
        if (child.parentElement) {
            child.parentElement.removeChild(child);
        }
    }
}

function resetAllShowMoreTexts() {
    const showMoreSpanList = document.querySelectorAll(".citation-reveal span");
    
    for (i = 0; i < showMoreSpanList.length; ++i) {
        const thisSpan = showMoreSpanList[i];
        thisSpan.innerText = "Show More V";
        thisSpan.setAttribute("aria-expanded", "false");
    }
}

function showCitation(flagData, flagElement) {
    // Change show more text
    flagElement.innerText = "Show Less ^";
    flagElement.setAttribute("aria-expanded", "true");
    
    // Add citation content
    const citationRow = buildCitationRow(flagData.citation);
    
    let [leftOffset, width] = calculateBounds(flagElement);
    
    citationRow.style.position = "relative";
    citationRow.style.left = leftOffset + "px";
    citationRow.style.width = width + "px";
    citationRow.style.outline = "1px solid black";
    
    flagElement.after(citationRow);
}

function buildCitationRow(flagCitation) {
    const citationRow = document.createElement("div");
    citationRow.classList.add("jx-citation-row");
    citationRow.innerText = flagCitation.apa;
    
    return citationRow;
}

function calculateBounds(element) {
    const origBounds = element.getBoundingClientRect();
    const origLeft = origBounds.left;
    const origRight = origBounds.right;
    let leftOffset = Infinity;
    let leftPadding = null;
    let rightOffset = 0;
    let rightPadding = null;
    const flagColList = element.closest(".row").querySelectorAll(".flag-col");
    
    flagColList.forEach((flagCol) => {
        var rect = flagCol.getBoundingClientRect(); 
        
        if (rect.left < leftOffset) {
            leftOffset = rect.left;
            
            const rawPaddingLeft = window.getComputedStyle(flagCol, null).paddingLeft;
            leftPadding = parseInt(rawPaddingLeft.substring(0, rawPaddingLeft.length - 2));
        }
        
        if (rect.right > rightOffset) {
            rightOffset = rect.right;
            
            const rawPaddingRight = window.getComputedStyle(flagCol, null).paddingRight;
            rightPadding = parseInt(rawPaddingRight.substring(0, rawPaddingRight.length - 2));
        }
    });
    
    return [leftOffset - origLeft + leftPadding, rightOffset - leftOffset - leftPadding - rightPadding];
}